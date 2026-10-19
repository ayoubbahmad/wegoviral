/** Admin tools for points, levels and badges (Phase 6). */
import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { logActivity } from '../../lib/activity';
import {
  adjustPoints,
  AUTO_BADGE_TYPES,
  checkAutoBadges,
  getLevels,
  invalidateGamificationCache,
  POINT_ACTIONS,
} from '../../lib/gamification';
import type { Actor } from './service';
import { AdminError, BadgeInput, LevelsInput, PointRulesInput } from './model';

export async function getGamification() {
  const [rules, levels, badges, holders] = await Promise.all([
    prisma.pointRule.findMany(),
    getLevels(),
    prisma.badge.findMany({ orderBy: [{ archivedAt: 'asc' }, { createdAt: 'asc' }] }),
    prisma.memberBadge.groupBy({ by: ['badgeId'], _count: { _all: true } }),
  ]);
  const holderCount = new Map(holders.map((row) => [row.badgeId, row._count._all]));
  const order = Object.keys(POINT_ACTIONS);
  return {
    rules: rules
      .map((rule) => ({ ...rule, label: POINT_ACTIONS[rule.action as keyof typeof POINT_ACTIONS] ?? rule.action }))
      .sort((a, b) => order.indexOf(a.action) - order.indexOf(b.action)),
    levels,
    badges: badges.map((badge) => ({ ...badge, holderCount: holderCount.get(badge.id) ?? 0 })),
    autoBadgeTypes: Object.entries(AUTO_BADGE_TYPES).map(([type, { label }]) => ({ type, label })),
  };
}

export async function updatePointRules(actor: Actor, input: PointRulesInput) {
  const known = new Set((await prisma.pointRule.findMany({ select: { action: true } })).map((rule) => rule.action));
  const unknown = input.rules.find((rule) => !known.has(rule.action));
  if (unknown) throw new AdminError(400, `Unknown action ${unknown.action}`);
  await prisma.$transaction(
    input.rules.map(({ action, ...data }) => prisma.pointRule.update({ where: { action }, data })),
  );
  invalidateGamificationCache();
  await logActivity({ actorId: actor.id, action: 'points.rules_updated', targetType: 'settings', targetLabel: 'Point rules', details: { rules: input.rules } });
  return getGamification();
}

/** Replaces the levels. They're numbered in order; the first starts at 0 points. */
export async function updateLevels(actor: Actor, input: LevelsInput) {
  const sorted = [...input.levels].sort((a, b) => a.minPoints - b.minPoints);
  if (sorted[0].minPoints !== 0) throw new AdminError(400, 'The first level must start at 0 points');
  if (new Set(sorted.map((level) => level.minPoints)).size !== sorted.length) {
    throw new AdminError(400, 'Two levels can’t start at the same number of points');
  }
  await prisma.$transaction([
    prisma.level.deleteMany(),
    prisma.level.createMany({ data: sorted.map((level, index) => ({ level: index + 1, name: level.name, minPoints: level.minPoints })) }),
  ]);
  invalidateGamificationCache();
  await logActivity({ actorId: actor.id, action: 'points.levels_updated', targetType: 'settings', targetLabel: 'Levels', details: { levels: sorted.length } });
  return getGamification();
}

// ─── Badges ──────────────────────────────────────────────────────────────────

const badgeIdFrom = (name: string) =>
  name
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40) || 'badge';

/** Gives a new or changed automatic badge to everyone who already qualifies. */
async function backfillAutoBadge(autoRule: unknown) {
  if (!autoRule) return;
  const members = await prisma.userProfile.findMany({ where: { joinStatus: 'APPROVED' }, select: { id: true } });
  for (const member of members) await checkAutoBadges(member.id);
}

const toAutoRule = (input: BadgeInput) =>
  input.autoRule ? (input.autoRule as Prisma.InputJsonValue) : Prisma.DbNull;

export async function createBadge(actor: Actor, input: BadgeInput) {
  let id = badgeIdFrom(input.name);
  for (let suffix = 2; await prisma.badge.findUnique({ where: { id } }); suffix++) id = `${badgeIdFrom(input.name)}-${suffix}`;
  const badge = await prisma.badge.create({
    data: { id, name: input.name, emoji: input.emoji, color: input.color, description: input.description, autoRule: toAutoRule(input) },
  });
  await backfillAutoBadge(input.autoRule);
  await logActivity({ actorId: actor.id, action: 'badge.created', targetType: 'badge', targetId: id, targetLabel: `${badge.emoji} ${badge.name}` });
  return badge;
}

export async function updateBadge(actor: Actor, id: string, input: Partial<BadgeInput>) {
  if (!(await prisma.badge.findUnique({ where: { id } }))) throw new AdminError(404, 'Badge not found');
  const badge = await prisma.badge.update({
    where: { id },
    data: {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.emoji !== undefined ? { emoji: input.emoji } : {}),
      ...(input.color !== undefined ? { color: input.color } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.autoRule !== undefined ? { autoRule: input.autoRule ? (input.autoRule as Prisma.InputJsonValue) : Prisma.DbNull } : {}),
    },
  });
  if (input.autoRule) await backfillAutoBadge(input.autoRule);
  await logActivity({ actorId: actor.id, action: 'badge.updated', targetType: 'badge', targetId: id, targetLabel: `${badge.emoji} ${badge.name}` });
  return badge;
}

/** Archived badges disappear from profiles and stop being awarded; holders keep them if restored. */
export async function setBadgeArchived(actor: Actor, id: string, archived: boolean) {
  const badge = await prisma.badge.update({ where: { id }, data: { archivedAt: archived ? new Date() : null } }).catch(() => null);
  if (!badge) throw new AdminError(404, 'Badge not found');
  await logActivity({
    actorId: actor.id,
    action: archived ? 'badge.archived' : 'badge.unarchived',
    targetType: 'badge',
    targetId: id,
    targetLabel: `${badge.emoji} ${badge.name}`,
  });
  return badge;
}

const memberLabel = async (userId: string) => {
  const member = await prisma.userProfile.findUnique({ where: { id: userId }, select: { username: true, name: true } });
  if (!member) throw new AdminError(404, 'Member not found');
  return member.name ? `${member.name} (@${member.username})` : `@${member.username}`;
};

export async function awardBadge(actor: Actor, userId: string, badgeId: string, note?: string) {
  const label = await memberLabel(userId);
  const badge = await prisma.badge.findFirst({ where: { id: badgeId, archivedAt: null } });
  if (!badge) throw new AdminError(404, 'Badge not found');
  try {
    await prisma.memberBadge.create({ data: { badgeId, userId, awardedById: actor.id, note: note || null } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new AdminError(409, 'This member already has that badge');
    }
    throw error;
  }
  await logActivity({
    actorId: actor.id,
    action: 'badge.awarded',
    targetType: 'member',
    targetId: userId,
    targetLabel: label,
    details: { badge: `${badge.emoji} ${badge.name}`, ...(note ? { note } : {}) },
  });
}

export async function removeBadge(actor: Actor, userId: string, badgeId: string) {
  const label = await memberLabel(userId);
  const { count } = await prisma.memberBadge.deleteMany({ where: { userId, badgeId } });
  if (!count) throw new AdminError(404, "This member doesn't have that badge");
  const badge = await prisma.badge.findUnique({ where: { id: badgeId } });
  await logActivity({
    actorId: actor.id,
    action: 'badge.removed',
    targetType: 'member',
    targetId: userId,
    targetLabel: label,
    details: { badge: badge ? `${badge.emoji} ${badge.name}` : badgeId },
  });
}

export async function adjustMemberPoints(actor: Actor, userId: string, points: number, reason: string) {
  const label = await memberLabel(userId);
  await adjustPoints(userId, points, reason, actor.id);
  await logActivity({
    actorId: actor.id,
    action: 'points.adjusted',
    targetType: 'member',
    targetId: userId,
    targetLabel: label,
    details: { points, reason },
  });
  return prisma.userProfile.findUniqueOrThrow({ where: { id: userId }, select: { points: true } });
}
