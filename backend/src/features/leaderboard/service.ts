import { prisma } from '../../lib/prisma';
import { AUTO_BADGE_TYPES, AutoBadgeType, badgesSelect, getLevels, levelFor, POINT_ACTIONS } from '../../lib/gamification';

const DAY_MS = 24 * 60 * 60 * 1000;
const TOP = 50;

export type Period = '7d' | '30d' | 'all';

const memberSelect = {
  id: true,
  username: true,
  name: true,
  avatarUrl: true,
  role: true,
  points: true,
  ...badgesSelect,
};

/** Only members in good standing appear on the leaderboard. */
const rankable = { joinStatus: 'APPROVED' as const, status: { not: 'BANNED' as const } };

const flattenBadges = <T extends { badges: { badge: unknown }[] }>(member: T) => ({
  ...member,
  badges: member.badges.map((row) => row.badge),
});

/** Points per member for the period, highest first. */
async function scores(period: Period) {
  if (period === 'all') {
    const members = await prisma.userProfile.findMany({
      where: { ...rankable, points: { gt: 0 } },
      orderBy: [{ points: 'desc' }, { createdAt: 'asc' }],
      select: { id: true, points: true },
    });
    return members.map((member) => ({ userId: member.id, points: member.points }));
  }
  const since = new Date(Date.now() - (period === '7d' ? 7 : 30) * DAY_MS);
  const rows = await prisma.pointEvent.groupBy({
    by: ['userId'],
    where: { createdAt: { gte: since }, user: rankable },
    _sum: { points: true },
  });
  return rows
    .map((row) => ({ userId: row.userId, points: row._sum.points ?? 0 }))
    .filter((row) => row.points > 0)
    .sort((a, b) => b.points - a.points);
}

export async function getLeaderboard(viewerId: string, period: Period) {
  const ranked = await scores(period);
  const top = ranked.slice(0, TOP);
  const members = await prisma.userProfile.findMany({ where: { id: { in: top.map((row) => row.userId) } }, select: memberSelect });
  const byId = new Map(members.map((member) => [member.id, member]));

  // Equal points share a rank
  let rank = 0;
  let previous: number | null = null;
  const entries = [];
  for (const [index, row] of top.entries()) {
    if (row.points !== previous) rank = index + 1;
    previous = row.points;
    const member = byId.get(row.userId);
    if (!member) continue;
    entries.push({ rank, points: row.points, member: flattenBadges(member), level: await levelFor(member.points) });
  }

  const me = await prisma.userProfile.findUniqueOrThrow({ where: { id: viewerId }, select: memberSelect });
  const myScore = ranked.find((row) => row.userId === viewerId)?.points ?? 0;
  const myRank = myScore > 0 ? ranked.filter((row) => row.points > myScore).length + 1 : null;

  return {
    period,
    entries,
    me: {
      rank: myRank,
      periodPoints: myScore,
      member: flattenBadges(me),
      level: await levelFor(me.points),
    },
  };
}

/** Everything the "How do points work?" explainer shows. */
export async function getHowItWorks() {
  const [rules, levels, badges] = await Promise.all([
    prisma.pointRule.findMany({ where: { enabled: true, points: { not: 0 } }, orderBy: { points: 'desc' } }),
    getLevels(),
    prisma.badge.findMany({ where: { archivedAt: null }, orderBy: { createdAt: 'asc' } }),
  ]);
  return {
    rules: rules.map((rule) => ({
      action: rule.action,
      label: POINT_ACTIONS[rule.action as keyof typeof POINT_ACTIONS] ?? rule.action,
      points: rule.points,
      dailyCap: rule.dailyCap,
    })),
    levels,
    badges: badges.map((badge) => {
      const auto = badge.autoRule as { type: AutoBadgeType; threshold: number } | null;
      return {
        id: badge.id,
        name: badge.name,
        emoji: badge.emoji,
        color: badge.color,
        description: badge.description,
        autoRule: auto,
        howToEarn: auto ? `${auto.threshold.toLocaleString('en')} ${(AUTO_BADGE_TYPES[auto.type]?.label ?? auto.type).toLowerCase()}` : 'Given by the team',
      };
    }),
  };
}
