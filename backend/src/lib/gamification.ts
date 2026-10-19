/**
 * Points, levels and badges (docs/ADMIN_ROADMAP.md, Phase 6).
 *
 * Every scored action is one row in the points ledger (unique per member,
 * action and source), so an action never scores twice and can be taken back.
 * Awarding never fails the request it belongs to.
 */
import { Level, Prisma, PointRule } from '@prisma/client';
import { prisma } from './prisma';

export const POINT_ACTIONS = {
  POST_PUBLISHED: 'Publishing a post',
  COMMENT_ADDED: 'Commenting',
  LIKE_RECEIVED: 'Getting a like on your post',
  EVENT_JOINED: 'Joining an event',
  POST_REVIEWED: "Reviewing a new member's post",
  GUIDE_ACCEPTED: 'Accepting the community guide',
  POST_REMOVED_BY_TEAM: 'Having a post removed by the team',
  VOUCHED_POST_REMOVED: 'A post you approved in review being removed',
  WARNING_RECEIVED: 'Receiving a warning',
  MANUAL: 'Adjusted by the team',
} as const;

export type PointAction = keyof typeof POINT_ACTIONS;

const CACHE_MS = 30_000;
let rulesCache: { value: Map<string, PointRule>; at: number } | null = null;
let levelsCache: { value: Level[]; at: number } | null = null;

async function getRules() {
  if (rulesCache && Date.now() - rulesCache.at < CACHE_MS) return rulesCache.value;
  const rules = await prisma.pointRule.findMany();
  rulesCache = { value: new Map(rules.map((rule) => [rule.action, rule])), at: Date.now() };
  return rulesCache.value;
}

export async function getLevels() {
  if (levelsCache && Date.now() - levelsCache.at < CACHE_MS) return levelsCache.value;
  const value = await prisma.level.findMany({ orderBy: { minPoints: 'asc' } });
  levelsCache = { value, at: Date.now() };
  return value;
}

export function invalidateGamificationCache() {
  rulesCache = null;
  levelsCache = null;
}

/** The member's level and how far they are from the next one. */
export async function levelFor(points: number) {
  const levels = await getLevels();
  let current = levels[0] ?? { level: 1, name: 'Member', minPoints: 0 };
  for (const level of levels) if (points >= level.minPoints) current = level;
  const next = levels.find((level) => level.minPoints > points) ?? null;
  return {
    level: current.level,
    name: current.name,
    minPoints: current.minPoints,
    next: next ? { level: next.level, name: next.name, minPoints: next.minPoints, pointsToGo: next.minPoints - points } : null,
  };
}

const startOfToday = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

interface Award {
  userId: string;
  action: Exclude<PointAction, 'MANUAL'>;
  sourceType: string;
  sourceId: string;
}

/** Records an action and gives its points (respecting the daily cap). */
export async function awardPoints({ userId, action, sourceType, sourceId }: Award) {
  try {
    const rule = (await getRules()).get(action);
    let points = rule?.enabled ? rule.points : 0;
    if (points > 0 && rule?.dailyCap) {
      const today = await prisma.pointEvent.aggregate({
        where: { userId, action, createdAt: { gte: startOfToday() } },
        _sum: { points: true },
      });
      points = Math.max(0, Math.min(points, rule.dailyCap - (today._sum.points ?? 0)));
    }
    await prisma.$transaction([
      prisma.pointEvent.create({ data: { userId, action, points, sourceType, sourceId } }),
      prisma.userProfile.update({ where: { id: userId }, data: { points: { increment: points } } }),
    ]);
    await checkAutoBadges(userId);
  } catch (error) {
    // Already recorded for this source: nothing to do
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') return;
    console.error('Failed to award points', error);
  }
}

/** Takes an action back (e.g. unlike, removed post) along with its points. */
/** userId is optional: without it, the action is taken back from whoever got it for that source. */
export async function revokePoints({ userId, action, sourceId }: { userId?: string; action: Award['action']; sourceId: string }) {
  try {
    const rows = await prisma.pointEvent.findMany({
      where: { action, sourceId, ...(userId ? { userId } : {}) },
      select: { id: true, userId: true, points: true },
    });
    if (!rows.length) return;
    await prisma.$transaction([
      prisma.pointEvent.deleteMany({ where: { id: { in: rows.map((row) => row.id) } } }),
      ...rows
        .filter((row) => row.points)
        .map((row) => prisma.userProfile.update({ where: { id: row.userId }, data: { points: { decrement: row.points } } })),
    ]);
  } catch (error) {
    console.error('Failed to revoke points', error);
  }
}

/** Points given or taken by staff, with a reason. */
export async function adjustPoints(userId: string, points: number, note: string, byId: string) {
  await prisma.$transaction([
    prisma.pointEvent.create({
      data: { userId, action: 'MANUAL', points, sourceType: 'manual', sourceId: `${byId}:${Date.now()}`, note },
    }),
    prisma.userProfile.update({ where: { id: userId }, data: { points: { increment: points } } }),
  ]);
  await checkAutoBadges(userId);
}

// ─── Automatic badges ────────────────────────────────────────────────────────

export const AUTO_BADGE_TYPES = {
  POSTS: { label: 'Posts published', action: 'POST_PUBLISHED' },
  COMMENTS: { label: 'Comments written', action: 'COMMENT_ADDED' },
  LIKES_RECEIVED: { label: 'Likes received', action: 'LIKE_RECEIVED' },
  EVENTS_JOINED: { label: 'Events joined', action: 'EVENT_JOINED' },
  POINTS: { label: 'Total points', action: null },
} as const;

export type AutoBadgeType = keyof typeof AUTO_BADGE_TYPES;

interface AutoRule {
  type: AutoBadgeType;
  threshold: number;
}

/** Gives the member every automatic badge whose milestone they've reached. Badges are never taken back. */
export async function checkAutoBadges(userId: string) {
  const [badges, held, profile] = await Promise.all([
    prisma.badge.findMany({ where: { archivedAt: null, autoRule: { not: Prisma.AnyNull } } }),
    prisma.memberBadge.findMany({ where: { userId }, select: { badgeId: true } }),
    prisma.userProfile.findUnique({ where: { id: userId }, select: { points: true } }),
  ]);
  const heldIds = new Set(held.map((row) => row.badgeId));
  const candidates = badges.filter((badge) => !heldIds.has(badge.id));
  if (!candidates.length || !profile) return;

  const counts = new Map(
    (
      await prisma.pointEvent.groupBy({ by: ['action'], where: { userId }, _count: { _all: true } })
    ).map((row) => [row.action, row._count._all]),
  );
  const earned = candidates.filter((badge) => {
    const rule = badge.autoRule as unknown as AutoRule;
    if (!rule || !(rule.type in AUTO_BADGE_TYPES)) return false;
    const action = AUTO_BADGE_TYPES[rule.type].action;
    const value = action ? counts.get(action) ?? 0 : profile.points;
    return value >= rule.threshold;
  });
  if (earned.length) {
    await prisma.memberBadge.createMany({
      data: earned.map((badge) => ({ badgeId: badge.id, userId })),
      skipDuplicates: true,
    });
  }
}

/** A member's badges for display next to their name (most recent first). */
export const badgesSelect = {
  badges: {
    orderBy: { awardedAt: 'desc' },
    take: 3,
    where: { badge: { archivedAt: null } },
    select: { badge: { select: { id: true, name: true, emoji: true, color: true } } },
  },
} satisfies Prisma.UserProfileSelect;
