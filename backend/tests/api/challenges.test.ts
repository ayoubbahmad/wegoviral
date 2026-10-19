import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { cleanupTestData, createTestUser, prisma, TestUser } from './support';

const DAY_MS = 24 * 60 * 60 * 1000;
const TIMEZONE = 'Africa/Casablanca';
const inDays = (days: number) => new Date(Date.now() + days * DAY_MS).toISOString();
const dayKey = (date: Date) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: TIMEZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);

describe('challenges', () => {
  let moderator: TestUser;
  let instructor: TestUser;
  let runner: TestUser;
  let sprinter: TestUser;
  let outsider: TestUser;
  let challengeId: string;

  const points = async (user: TestUser) =>
    (await prisma.userProfile.findUniqueOrThrow({ where: { id: user.profileId }, select: { points: true } })).points;
  const create = (user: TestUser, overrides: Record<string, unknown> = {}) =>
    user.call('POST', '/challenges', {
      title: '30-day posting sprint',
      description: 'Post every day',
      rules: 'Share your post link each day.',
      prizes: 'A 1:1 strategy call',
      startsAt: inDays(-2.5),
      endsAt: inDays(5),
      timezone: TIMEZONE,
      checkInType: 'DAILY',
      requiredCheckIns: 3,
      ...overrides,
    });

  before(async () => {
    [moderator, instructor, runner, sprinter, outsider] = await Promise.all([
      createTestUser('chmod', { role: 'MODERATOR' }),
      createTestUser('chinstr', { role: 'INSTRUCTOR' }),
      createTestUser('chrunner'),
      createTestUser('chsprint'),
      createTestUser('choutsider'),
    ]);
  });

  after(cleanupTestData); // challenges go with the moderator who created them

  describe('managing', () => {
    it('is for moderators and up', async () => {
      assert.equal((await instructor.call('POST', '/challenges', {})).status, 403);
      assert.equal((await runner.call('POST', '/challenges', {})).status, 403);
      const created = await create(moderator);
      assert.equal(created.status, 201);
      assert.equal(created.data.status, 'DRAFT');
      assert.equal(created.data.requiredCheckIns, 3);
      assert.ok(created.data.totalDays >= 7);
      challengeId = created.data.id;
    });

    it('hides drafts and refuses check-ins until published', async () => {
      assert.equal((await runner.call('GET', `/challenges/${challengeId}`)).status, 404);
      assert.equal((await moderator.call('POST', `/challenges/${challengeId}/check-ins`, { content: 'Day 1' })).status, 400);
      const published = await moderator.call('PATCH', `/challenges/${challengeId}`, { status: 'PUBLISHED' });
      assert.equal(published.data.phase, 'active');
      const listed = (await runner.call('GET', '/challenges?scope=active')).data;
      assert.ok(listed.some((c: { id: string }) => c.id === challengeId));
    });

    it('rejects an end before the start', async () => {
      assert.equal((await moderator.call('PATCH', `/challenges/${challengeId}`, { endsAt: inDays(-5) })).status, 400);
    });
  });

  describe('taking part', () => {
    it('joins and checks in once a day, with points', async () => {
      assert.equal((await runner.call('PUT', `/challenges/${challengeId}/join`)).data.me.checkInCount, 0);
      const before = await points(runner);
      const checkIn = await runner.call('POST', `/challenges/${challengeId}/check-ins`, { content: 'Posted my Reel', link: 'https://instagram.com/p/demo' });
      assert.equal(checkIn.status, 201);
      assert.equal(checkIn.data.me.checkedInToday, true);
      assert.equal(checkIn.data.me.currentStreak, 1);
      assert.equal(await points(runner), before + 3);
      const again = await runner.call('POST', `/challenges/${challengeId}/check-ins`, { content: 'Twice?' });
      assert.equal(again.status, 409);
    });

    it('refuses images from outside the community uploader', async () => {
      const response = await sprinter.call('POST', `/challenges/${challengeId}/check-ins`, { content: 'Look', imageUrl: 'https://evil.example.com/x.png' });
      assert.equal(response.status, 400);
    });

    it('counts streaks across days and finishes the challenge at the target', async () => {
      await sprinter.call('PUT', `/challenges/${challengeId}/join`);
      // Two earlier days, as if checked in then
      for (const daysAgo of [2, 1]) {
        await prisma.challengeCheckIn.create({
          data: { challengeId, userId: sprinter.profileId, day: dayKey(new Date(Date.now() - daysAgo * DAY_MS)), content: `Day -${daysAgo}`, createdAt: new Date(Date.now() - daysAgo * DAY_MS) },
        });
      }
      const before = await points(sprinter);
      const today = await sprinter.call('POST', `/challenges/${challengeId}/check-ins`, { content: 'Day 3!' });
      assert.equal(today.data.me.checkInCount, 3);
      assert.equal(today.data.me.currentStreak, 3);
      assert.equal(today.data.me.bestStreak, 3);
      assert.ok(today.data.me.completedAt);
      assert.equal(await points(sprinter), before + 3 + 30);
      assert.ok(await prisma.memberBadge.findUnique({ where: { badgeId_userId: { badgeId: 'challenge-finisher', userId: sprinter.profileId } } }));
      assert.deepEqual(today.data.myDays.length, 3);
    });

    it('ranks the leaderboard by check-ins and streak', async () => {
      const board = (await runner.call('GET', `/challenges/${challengeId}/leaderboard`)).data;
      assert.equal(board.entries[0].member.id, sprinter.profileId);
      assert.equal(board.entries[0].completed, true);
      assert.equal(board.me.rank, 2);
      assert.equal(board.required, 3);
    });

    it('lists check-ins newest first, with badges', async () => {
      const feed = (await outsider.call('GET', `/challenges/${challengeId}/check-ins`)).data;
      assert.equal(feed.checkIns[0].author.id, sprinter.profileId);
      assert.ok(Array.isArray(feed.checkIns[0].author.badges));
      assert.equal(feed.checkIns[0].canDelete, false);
    });

    it("doesn't let you leave after checking in", async () => {
      assert.equal((await runner.call('DELETE', `/challenges/${challengeId}/join`)).status, 400);
      await outsider.call('PUT', `/challenges/${challengeId}/join`);
      assert.equal((await outsider.call('DELETE', `/challenges/${challengeId}/join`)).data.me, null);
    });

    it('takes back points and completion when a check-in is removed', async () => {
      const feed = (await sprinter.call('GET', `/challenges/${challengeId}/check-ins`)).data;
      const mine = feed.checkIns.find((c: { content: string }) => c.content === 'Day 3!');
      const before = await points(sprinter);
      assert.equal((await outsider.call('DELETE', `/challenges/${challengeId}/check-ins/${mine.id}`)).status, 403);
      assert.equal((await sprinter.call('DELETE', `/challenges/${challengeId}/check-ins/${mine.id}`)).status, 204);
      const state = (await sprinter.call('GET', `/challenges/${challengeId}`)).data.me;
      assert.equal(state.checkInCount, 2);
      assert.equal(state.completedAt, null);
      assert.equal(await points(sprinter), before - 3 - 30);
      // Checking in again today finishes it again
      await sprinter.call('POST', `/challenges/${challengeId}/check-ins`, { content: 'Day 3 again' });
      assert.equal(await points(sprinter), before);
    });

    it('lets the team remove a check-in, keeping a record', async () => {
      const feed = (await moderator.call('GET', `/challenges/${challengeId}/check-ins`)).data;
      const target = feed.checkIns.find((c: { author: { id: string } }) => c.author.id === runner.profileId);
      assert.equal((await moderator.call('DELETE', `/challenges/${challengeId}/check-ins/${target.id}`)).status, 204);
      const row = await prisma.challengeCheckIn.findUnique({ where: { id: target.id } });
      assert.ok(row?.deletedAt);
      assert.equal(row?.deletedById, moderator.profileId);
      assert.equal((await runner.call('GET', `/challenges/${challengeId}`)).data.me.checkInCount, 0);
    });
  });

  describe('winners', () => {
    it('can only be picked after the end', async () => {
      const early = await moderator.call('PUT', `/challenges/${challengeId}/winners`, { mode: 'top', count: 1 });
      assert.equal(early.status, 400);
      assert.equal((await moderator.call('PATCH', `/challenges/${challengeId}`, { startsAt: inDays(-4), endsAt: inDays(-0.01) })).status, 200);
    });

    it('takes the top of the board, with points and the winner badge', async () => {
      const before = await points(sprinter);
      const picked = await moderator.call('PUT', `/challenges/${challengeId}/winners`, { mode: 'top', count: 1 });
      assert.equal(picked.status, 200);
      assert.equal(picked.data.winners[0].member.id, sprinter.profileId);
      assert.equal(await points(sprinter), before + 100);
      assert.ok(await prisma.memberBadge.findUnique({ where: { badgeId_userId: { badgeId: 'challenge-winner', userId: sprinter.profileId } } }));
      assert.equal((await runner.call('PUT', `/challenges/${challengeId}/winners`, { mode: 'top', count: 1 })).status, 403);
    });

    it('can be replaced by hand', async () => {
      const before = await points(sprinter);
      const manual = await moderator.call('PUT', `/challenges/${challengeId}/winners`, { mode: 'manual', userIds: [runner.profileId] });
      assert.equal(manual.data.winners[0].member.id, runner.profileId);
      assert.equal(await points(sprinter), before - 100);
      const notIn = await moderator.call('PUT', `/challenges/${challengeId}/winners`, { mode: 'manual', userIds: [instructor.profileId] });
      assert.equal(notIn.status, 400);
    });

    it('refuses check-ins once ended', async () => {
      const response = await sprinter.call('POST', `/challenges/${challengeId}/check-ins`, { content: 'Late' });
      assert.equal(response.status, 400);
      assert.match(response.data.error, /ended/);
    });
  });

  describe('one-time challenges and access', () => {
    let oneTimeId: string;

    before(async () => {
      oneTimeId = (await create(moderator, { title: 'Share your best hook', checkInType: 'ONE_TIME', status: 'PUBLISHED', requiredCheckIns: null })).data.id;
    });

    it('finishes with a single submission', async () => {
      const first = await runner.call('POST', `/challenges/${oneTimeId}/check-ins`, { content: 'My hook' });
      assert.equal(first.status, 201);
      assert.ok(first.data.me.completedAt);
      assert.equal(first.data.requiredCheckIns, 1);
      assert.equal((await runner.call('POST', `/challenges/${oneTimeId}/check-ins`, { content: 'Another' })).status, 409);
    });

    it('applies access rules', async () => {
      assert.equal((await moderator.call('PUT', `/challenges/${oneTimeId}/access`, { minLevel: 9 })).status, 200);
      const view = (await outsider.call('GET', `/challenges/${oneTimeId}`)).data;
      assert.equal(view.access.locked, true);
      assert.equal(view.rules, '', 'rules stay hidden');
      const response = await outsider.call('POST', `/challenges/${oneTimeId}/check-ins`, { content: 'Let me in' });
      assert.equal(response.status, 403);
      assert.equal((await outsider.call('GET', `/challenges/${oneTimeId}/check-ins`)).status, 403);
      await moderator.call('PUT', `/challenges/${oneTimeId}/access`, { minLevel: null });
    });
  });
});
