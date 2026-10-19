/**
 * Stats dashboard (docs/ADMIN_ROADMAP.md, Phase 10). Series are bucketed by
 * day, week or month in the viewer's time zone. "Active" means the member
 * posted, commented, liked, voted, RSVPed, completed a lesson or checked in.
 */
import { prisma } from '../../lib/prisma';
import { StatsQuery } from './model';

const DAY_MS = 24 * 60 * 60 * 1000;

export type Bucket = 'day' | 'week' | 'month';

const RANGES = {
  '30d': { days: 30, bucket: 'day' },
  '90d': { days: 90, bucket: 'week' },
  '12m': { days: 365, bucket: 'month' },
} as const satisfies Record<string, { days: number; bucket: Bucket }>;

/** Every member action that counts as "active", as (uid, at) rows since $2. */
const ACTIVITY = `
  SELECT "authorId" AS uid, "createdAt" AS at FROM community_posts WHERE "createdAt" >= $2
  UNION ALL SELECT "authorId", "createdAt" FROM community_comments WHERE "createdAt" >= $2
  UNION ALL SELECT "userId", "createdAt" FROM community_post_likes WHERE "createdAt" >= $2
  UNION ALL SELECT "userId", "createdAt" FROM community_poll_votes WHERE "createdAt" >= $2
  UNION ALL SELECT "userId", "createdAt" FROM event_rsvps WHERE "createdAt" >= $2
  UNION ALL SELECT "userId", "completedAt" FROM lesson_progress WHERE "completedAt" >= $2
  UNION ALL SELECT "userId", "createdAt" FROM challenge_check_ins WHERE "createdAt" >= $2`;

/** Timestamps are stored in UTC; this is the same moment on the viewer's clock. */
const local = (column: string) => `((${column} AT TIME ZONE 'UTC') AT TIME ZONE $1)`;
const bucketOf = (column: string) => `to_char(date_trunc($3, ${local(column)}), 'YYYY-MM-DD')`;

const dayKey = (date: Date, timezone: string) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);

/** The bucket a calendar day falls in: itself, its Monday, or the 1st of its month. */
function bucketKey(day: string, bucket: Bucket) {
  if (bucket === 'day') return day;
  if (bucket === 'month') return `${day.slice(0, 7)}-01`;
  const date = new Date(`${day}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - ((date.getUTCDay() + 6) % 7));
  return date.toISOString().slice(0, 10);
}

/** Every bucket in the range, oldest first, so empty days show as zero. */
function bucketsFor(since: Date, bucket: Bucket, timezone: string) {
  const keys = new Set<string>();
  for (let time = since.getTime(); time <= Date.now(); time += DAY_MS) keys.add(bucketKey(dayKey(new Date(time), timezone), bucket));
  keys.add(bucketKey(dayKey(new Date(), timezone), bucket));
  return [...keys].sort();
}

type Row = { bucket: string; value: number };

function fill(keys: string[], rows: Row[]) {
  const values = new Map(rows.map((row) => [row.bucket, Number(row.value)]));
  return keys.map((key) => ({ bucket: key, value: values.get(key) ?? 0 }));
}

function context(query: StatsQuery) {
  const range = RANGES[query.range];
  const since = new Date(Date.now() - range.days * DAY_MS);
  return { ...range, since, timezone: query.timezone, keys: bucketsFor(since, range.bucket, query.timezone) };
}

const countSeries = (table: string, column: string, extra = '') => async (ctx: ReturnType<typeof context>) =>
  fill(
    ctx.keys,
    await prisma.$queryRawUnsafe<Row[]>(
      `SELECT ${bucketOf(`"${column}"`)} AS bucket, COUNT(*)::int AS value FROM ${table} WHERE "${column}" >= $2 ${extra} GROUP BY 1`,
      ctx.timezone,
      ctx.since,
      ctx.bucket,
    ),
  );

// ─── Members ─────────────────────────────────────────────────────────────────

export async function memberStats(query: StatsQuery) {
  const ctx = context(query);
  const monthAgo = new Date(Date.now() - 30 * DAY_MS);
  const cohortStart = new Date();
  cohortStart.setUTCMonth(cohortStart.getUTCMonth() - 5, 1);
  cohortStart.setUTCHours(0, 0, 0, 0);

  const [signups, active, current, cohortSizes, cohortActivity, funnel] = await Promise.all([
    countSeries('"UserProfile"', 'createdAt')(ctx),
    prisma
      .$queryRawUnsafe<Row[]>(
        `WITH activity AS (${ACTIVITY}) SELECT ${bucketOf('at')} AS bucket, COUNT(DISTINCT uid)::int AS value FROM activity GROUP BY 1`,
        ctx.timezone,
        ctx.since,
        ctx.bucket,
      )
      .then((rows) => fill(ctx.keys, rows)),
    prisma.$queryRawUnsafe<{ day: number; week: number; month: number }[]>(
      `WITH activity AS (${ACTIVITY.split('$2').join('$1')})
       SELECT COUNT(DISTINCT uid) FILTER (WHERE at >= NOW() - INTERVAL '1 day')::int AS day,
              COUNT(DISTINCT uid) FILTER (WHERE at >= NOW() - INTERVAL '7 days')::int AS week,
              COUNT(DISTINCT uid)::int AS month
       FROM activity`,
      monthAgo,
    ),
    prisma.$queryRawUnsafe<{ cohort: string; size: number }[]>(
      `SELECT to_char(date_trunc('month', ${local('"createdAt"')}), 'YYYY-MM') AS cohort, COUNT(*)::int AS size
       FROM "UserProfile" WHERE "createdAt" >= $2 GROUP BY 1`,
      ctx.timezone,
      cohortStart,
    ),
    prisma.$queryRawUnsafe<{ cohort: string; offset: number; users: number }[]>(
      `WITH activity AS (${ACTIVITY}),
            cohorts AS (SELECT id, date_trunc('month', ${local('"createdAt"')}) AS month FROM "UserProfile" WHERE "createdAt" >= $2),
            months AS (SELECT a.uid, c.month AS cohort, date_trunc('month', ${local('a.at')}) AS month FROM activity a JOIN cohorts c ON c.id = a.uid)
       SELECT to_char(cohort, 'YYYY-MM') AS cohort,
              ((EXTRACT(YEAR FROM month) - EXTRACT(YEAR FROM cohort)) * 12 + EXTRACT(MONTH FROM month) - EXTRACT(MONTH FROM cohort))::int AS "offset",
              COUNT(DISTINCT uid)::int AS users
       FROM months GROUP BY 1, 2`,
      ctx.timezone,
      cohortStart,
    ),
    joiningFunnel(ctx.since),
  ]);

  const retention = cohortSizes
    .sort((a, b) => a.cohort.localeCompare(b.cohort))
    .map(({ cohort, size }) => ({
      cohort,
      size,
      months: Array.from({ length: 6 }, (_, offset) => {
        const users = cohortActivity.find((row) => row.cohort === cohort && row.offset === offset)?.users ?? 0;
        return { offset, users, share: size ? users / size : 0 };
      }),
    }));

  return { range: query.range, bucket: ctx.bucket, signups, active, current: current[0], retention, funnel };
}

/** Members who signed up in the range, at each step of joining. */
async function joiningFunnel(since: Date) {
  const signedUp = { createdAt: { gte: since } };
  const [total, applied, approved, guide, posted, probation] = await Promise.all([
    prisma.userProfile.count({ where: signedUp }),
    prisma.userProfile.count({ where: { ...signedUp, OR: [{ application: { isNot: null } }, { joinStatus: 'APPROVED' }] } }),
    prisma.userProfile.count({ where: { ...signedUp, joinStatus: 'APPROVED' } }),
    prisma.userProfile.count({ where: { ...signedUp, joinStatus: 'APPROVED', rulesAcceptedAt: { not: null } } }),
    prisma.userProfile.count({ where: { ...signedUp, communityPosts: { some: { reviewStatus: 'PUBLISHED', deletedAt: null } } } }),
    prisma.userProfile.count({ where: { ...signedUp, probationCompletedAt: { not: null } } }),
  ]);
  return [
    { step: 'Signed up', count: total },
    { step: 'Sent the sign-up form', count: applied },
    { step: 'Approved', count: approved },
    { step: 'Accepted the guide', count: guide },
    { step: 'Published a first post', count: posted },
    { step: 'Finished probation', count: probation },
  ];
}

// ─── Engagement ──────────────────────────────────────────────────────────────

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export async function engagementStats(query: StatsQuery) {
  const ctx = context(query);
  const live = 'AND "deletedAt" IS NULL';
  const [posts, comments, likes, spaceRows, spaces, posters, commenters, timing] = await Promise.all([
    countSeries('community_posts', 'createdAt', `${live} AND "reviewStatus" = 'PUBLISHED'`)(ctx),
    countSeries('community_comments', 'createdAt', live)(ctx),
    countSeries('community_post_likes', 'createdAt')(ctx),
    prisma.communityPost.groupBy({
      by: ['spaceId'],
      where: { createdAt: { gte: ctx.since }, deletedAt: null, reviewStatus: 'PUBLISHED' },
      _count: { _all: true },
      _sum: { likeCount: true, commentCount: true },
    }),
    prisma.communitySpace.findMany({ select: { id: true, name: true, emoji: true } }),
    prisma.communityPost.groupBy({
      by: ['authorId'],
      where: { createdAt: { gte: ctx.since }, deletedAt: null, reviewStatus: 'PUBLISHED' },
      _count: { _all: true },
      _sum: { likeCount: true },
    }),
    prisma.communityComment.groupBy({ by: ['authorId'], where: { createdAt: { gte: ctx.since }, deletedAt: null }, _count: { _all: true } }),
    prisma.communityPost.findMany({
      where: { createdAt: { gte: ctx.since }, deletedAt: null, reviewStatus: 'PUBLISHED' },
      select: { createdAt: true, likeCount: true, commentCount: true },
      take: 10_000,
    }),
  ]);

  const spaceById = new Map(spaces.map((space) => [space.id, space]));
  const bySpace = spaceRows
    .map((row) => ({
      spaceId: row.spaceId,
      name: spaceById.get(row.spaceId)?.name ?? row.spaceId,
      emoji: spaceById.get(row.spaceId)?.emoji ?? '',
      posts: row._count._all,
      comments: row._sum.commentCount ?? 0,
      likes: row._sum.likeCount ?? 0,
    }))
    .sort((a, b) => b.posts - a.posts);

  // Top contributors: posts and comments, with likes their posts received
  const scores = new Map<string, { posts: number; comments: number; likesReceived: number }>();
  const entry = (id: string) => scores.get(id) ?? scores.set(id, { posts: 0, comments: 0, likesReceived: 0 }).get(id)!;
  for (const row of posters) Object.assign(entry(row.authorId), { posts: row._count._all, likesReceived: row._sum.likeCount ?? 0 });
  for (const row of commenters) entry(row.authorId).comments = row._count._all;
  const top = [...scores.entries()].sort((a, b) => b[1].posts + b[1].comments - (a[1].posts + a[1].comments)).slice(0, 10);
  const people = await prisma.userProfile.findMany({
    where: { id: { in: top.map(([id]) => id) } },
    select: { id: true, username: true, name: true, avatarUrl: true, role: true },
  });
  const personById = new Map(people.map((person) => [person.id, person]));
  const topContributors = top.filter(([id]) => personById.has(id)).map(([id, counts]) => ({ member: personById.get(id)!, ...counts }));

  // Best posting times: posts and average reactions per weekday and hour, on the viewer's clock
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: ctx.timezone, weekday: 'short', hour: 'numeric', hourCycle: 'h23' });
  const grid = WEEKDAYS.map(() => Array.from({ length: 24 }, () => ({ posts: 0, engagement: 0 })));
  for (const post of timing) {
    const values = Object.fromEntries(parts.formatToParts(post.createdAt).map((part) => [part.type, part.value]));
    const cell = grid[WEEKDAYS.indexOf(values.weekday)]?.[Number(values.hour) % 24];
    if (!cell) continue;
    cell.posts += 1;
    cell.engagement += post.likeCount + post.commentCount;
  }
  const bestTimes = grid.map((hours, day) => ({
    day: WEEKDAYS[day],
    hours: hours.map((cell, hour) => ({ hour, posts: cell.posts, avgEngagement: cell.posts ? cell.engagement / cell.posts : 0 })),
  }));

  return {
    range: query.range,
    bucket: ctx.bucket,
    series: ctx.keys.map((bucket, index) => ({ bucket, posts: posts[index].value, comments: comments[index].value, likes: likes[index].value })),
    totals: {
      posts: posts.reduce((sum, row) => sum + row.value, 0),
      comments: comments.reduce((sum, row) => sum + row.value, 0),
      likes: likes.reduce((sum, row) => sum + row.value, 0),
    },
    bySpace,
    topContributors,
    bestTimes,
  };
}

// ─── Content ─────────────────────────────────────────────────────────────────

export async function contentStats(query: StatsQuery) {
  const ctx = context(query);
  const [courses, events, challenges] = await Promise.all([
    prisma.course.findMany({
      where: { deletedAt: null, status: { not: 'DRAFT' } },
      select: {
        id: true,
        title: true,
        status: true,
        _count: { select: { enrollments: true } },
        enrollments: { select: { startedAt: true, completedAt: true } },
        modules: { select: { _count: { select: { lessons: true } } } },
      },
    }),
    prisma.communityEvent.findMany({
      where: { deletedAt: null, status: { not: 'DRAFT' }, startsAt: { gte: ctx.since } },
      orderBy: { startsAt: 'desc' },
      select: { id: true, title: true, startsAt: true, status: true, capacity: true, category: true, _count: { select: { rsvps: true } } },
    }),
    prisma.challenge.findMany({
      where: { deletedAt: null, status: { not: 'DRAFT' }, endsAt: { gte: ctx.since } },
      orderBy: { startsAt: 'desc' },
      select: {
        id: true,
        title: true,
        startsAt: true,
        endsAt: true,
        status: true,
        checkInType: true,
        participants: { select: { completedAt: true, checkInCount: true } },
      },
    }),
  ]);

  return {
    range: query.range,
    courses: courses
      .map((course) => {
        const completed = course.enrollments.filter((e) => e.completedAt).length;
        return {
          id: course.id,
          title: course.title,
          status: course.status,
          lessons: course.modules.reduce((sum, module) => sum + module._count.lessons, 0),
          enrolled: course._count.enrollments,
          startedInRange: course.enrollments.filter((e) => e.startedAt >= ctx.since).length,
          completed,
          completionRate: course._count.enrollments ? completed / course._count.enrollments : 0,
        };
      })
      .sort((a, b) => b.enrolled - a.enrolled),
    events: events.map((event) => ({
      id: event.id,
      title: event.title,
      startsAt: event.startsAt,
      status: event.status,
      category: event.category,
      going: event._count.rsvps,
      capacity: event.capacity,
      fillRate: event.capacity ? event._count.rsvps / event.capacity : null,
    })),
    challenges: challenges.map((challenge) => {
      const finished = challenge.participants.filter((p) => p.completedAt).length;
      return {
        id: challenge.id,
        title: challenge.title,
        startsAt: challenge.startsAt,
        endsAt: challenge.endsAt,
        status: challenge.status,
        checkInType: challenge.checkInType,
        participants: challenge.participants.length,
        finished,
        checkIns: challenge.participants.reduce((sum, p) => sum + p.checkInCount, 0),
        finishRate: challenge.participants.length ? finished / challenge.participants.length : 0,
      };
    }),
  };
}
