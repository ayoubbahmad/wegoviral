/**
 * One-time credit for activity from before points existed (Phase 6):
 * published posts, comments, likes received, event RSVPs, post reviews and guide acceptance.
 * Rows keep the original date, so the 7/30-day leaderboards stay honest, and daily caps
 * apply per original day. Safe to run again: actions already in the ledger are skipped.
 *
 *   yarn points:backfill
 */
import { prisma } from '../src/lib/prisma';
import { checkAutoBadges } from '../src/lib/gamification';

interface Row {
  userId: string;
  action: string;
  sourceType: string;
  sourceId: string;
  createdAt: Date;
}

async function main() {
  const rules = new Map((await prisma.pointRule.findMany()).map((rule) => [rule.action, rule]));
  const [posts, comments, likes, rsvps, reviews, guide] = await Promise.all([
    prisma.communityPost.findMany({ where: { deletedAt: null, reviewStatus: 'PUBLISHED' }, select: { id: true, authorId: true, createdAt: true } }),
    prisma.communityComment.findMany({ where: { deletedAt: null, heldReason: null }, select: { id: true, authorId: true, createdAt: true } }),
    prisma.communityPostLike.findMany({ where: { post: { deletedAt: null } }, select: { postId: true, userId: true, createdAt: true, post: { select: { authorId: true } } } }),
    prisma.eventRsvp.findMany({ select: { eventId: true, userId: true, createdAt: true } }),
    prisma.communityPost.findMany({ where: { reviewedById: { not: null }, reviewedAt: { not: null } }, select: { id: true, reviewedById: true, reviewedAt: true } }),
    prisma.userProfile.findMany({ where: { rulesAcceptedAt: { not: null } }, select: { id: true, rulesAcceptedAt: true } }),
  ]);

  const rows: Row[] = [
    ...posts.map((p) => ({ userId: p.authorId, action: 'POST_PUBLISHED', sourceType: 'post', sourceId: p.id, createdAt: p.createdAt })),
    ...comments.map((c) => ({ userId: c.authorId, action: 'COMMENT_ADDED', sourceType: 'comment', sourceId: c.id, createdAt: c.createdAt })),
    ...likes
      .filter((like) => like.post.authorId !== like.userId)
      .map((like) => ({ userId: like.post.authorId, action: 'LIKE_RECEIVED', sourceType: 'like', sourceId: `${like.postId}:${like.userId}`, createdAt: like.createdAt })),
    ...rsvps.map((r) => ({ userId: r.userId, action: 'EVENT_JOINED', sourceType: 'event', sourceId: r.eventId, createdAt: r.createdAt })),
    ...reviews.map((r) => ({ userId: r.reviewedById!, action: 'POST_REVIEWED', sourceType: 'post', sourceId: r.id, createdAt: r.reviewedAt! })),
    ...guide.map((g) => ({ userId: g.id, action: 'GUIDE_ACCEPTED', sourceType: 'guide', sourceId: 'guide', createdAt: g.rulesAcceptedAt! })),
  ].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  // Skip what's already recorded, and count it towards that day's cap
  const existing = await prisma.pointEvent.findMany({ select: { userId: true, action: true, sourceId: true, points: true, createdAt: true } });
  const recorded = new Set(existing.map((e) => `${e.userId}|${e.action}|${e.sourceId}`));
  const dayTotals = new Map<string, number>();
  const dayKey = (userId: string, action: string, date: Date) => `${userId}|${action}|${date.toISOString().slice(0, 10)}`;
  for (const e of existing) dayTotals.set(dayKey(e.userId, e.action, e.createdAt), (dayTotals.get(dayKey(e.userId, e.action, e.createdAt)) ?? 0) + e.points);

  const data = [];
  for (const row of rows) {
    if (recorded.has(`${row.userId}|${row.action}|${row.sourceId}`)) continue;
    recorded.add(`${row.userId}|${row.action}|${row.sourceId}`);
    const rule = rules.get(row.action);
    let points = rule?.enabled ? rule.points : 0;
    if (points > 0 && rule?.dailyCap) {
      const key = dayKey(row.userId, row.action, row.createdAt);
      const today = dayTotals.get(key) ?? 0;
      points = Math.max(0, Math.min(points, rule.dailyCap - today));
      dayTotals.set(key, today + points);
    }
    data.push({ ...row, points });
  }

  await prisma.pointEvent.createMany({ data, skipDuplicates: true });

  // Totals always match the ledger
  const sums = await prisma.pointEvent.groupBy({ by: ['userId'], _sum: { points: true } });
  for (const sum of sums) {
    await prisma.userProfile.update({ where: { id: sum.userId }, data: { points: sum._sum.points ?? 0 } });
  }
  for (const sum of sums) await checkAutoBadges(sum.userId);

  console.log(`Added ${data.length} ledger rows; updated ${sums.length} members.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
