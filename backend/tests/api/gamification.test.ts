import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { PointRule } from '@prisma/client';
import { cleanupTestData, createTestUser, prisma, TestUser } from './support';

const TEST_PREFIX = '[test]';

describe('points, levels and badges', () => {
  let admin: TestUser;
  let moderator: TestUser;
  let author: TestUser;
  let fan: TestUser;
  let rulesSnapshot: PointRule[];

  const points = async (user: TestUser) =>
    (await prisma.userProfile.findUniqueOrThrow({ where: { id: user.profileId }, select: { points: true } })).points;
  const post = async (user: TestUser, content = 'Points test post') => {
    const response = await user.call('POST', '/feed/posts', { spaceId: 'wins', content });
    assert.equal(response.status, 201);
    return response.data.id as string;
  };
  const setRules = (rules: Partial<PointRule>[]) =>
    admin.call('PUT', '/admin/gamification/rules', {
      rules: rules.map((rule) => {
        const current = rulesSnapshot.find((saved) => saved.action === rule.action)!;
        return { action: current.action, points: current.points, dailyCap: current.dailyCap, enabled: current.enabled, ...rule };
      }),
    });

  const removeTestData = async () => {
    const spaces = await prisma.communitySpace.findMany({ where: { name: { startsWith: TEST_PREFIX } }, select: { id: true } });
    const ids = spaces.map((space) => space.id);
    await prisma.accessRule.deleteMany({ where: { resourceType: 'space', resourceId: { in: ids } } });
    await prisma.communitySpace.deleteMany({ where: { id: { in: ids } } });
    await prisma.badge.deleteMany({ where: { name: { startsWith: TEST_PREFIX } } });
  };

  before(async () => {
    await removeTestData();
    rulesSnapshot = await prisma.pointRule.findMany();
    [admin, moderator, author, fan] = await Promise.all([
      createTestUser('gamadmin', { role: 'ADMIN' }),
      createTestUser('gammod', { role: 'MODERATOR' }),
      createTestUser('gamauthor'),
      createTestUser('gamfan'),
    ]);
  });

  after(async () => {
    // Through the API so the server's cache is refreshed too
    await admin.call('PUT', '/admin/gamification/rules', {
      rules: rulesSnapshot.map(({ action, points, dailyCap, enabled }) => ({ action, points, dailyCap, enabled })),
    });
    await removeTestData();
    await cleanupTestData();
  });

  describe('earning points', () => {
    it('gives points for a post and takes them back when it is deleted', async () => {
      const before = await points(author);
      const id = await post(author);
      assert.equal(await points(author), before + 5);
      assert.equal((await author.call('DELETE', `/feed/posts/${id}`)).status, 204);
      assert.equal(await points(author), before);
    });

    it('gives the first-post badge automatically', async () => {
      await post(author);
      const me = (await author.call('GET', '/auth/me')).data.user;
      assert.ok(me.badges.some((badge: { id: string }) => badge.id === 'first-post'));
      assert.equal(me.points, await points(author));
      assert.equal(typeof me.level.level, 'number');
    });

    it('scores likes received (not self-likes) and comments, and takes them back', async () => {
      const id = await post(author);
      const authorBefore = await points(author);
      await author.call('PUT', `/feed/posts/${id}/like`);
      assert.equal(await points(author), authorBefore, 'self-likes score nothing');
      await fan.call('PUT', `/feed/posts/${id}/like`);
      assert.equal(await points(author), authorBefore + 1);
      await fan.call('DELETE', `/feed/posts/${id}/like`);
      assert.equal(await points(author), authorBefore);

      const fanBefore = await points(fan);
      const comment = await fan.call('POST', `/feed/posts/${id}/comments`, { content: 'Nice one' });
      assert.equal(comment.status, 201);
      assert.equal(await points(fan), fanBefore + 2);
      await fan.call('DELETE', `/feed/comments/${comment.data.id}`);
      assert.equal(await points(fan), fanBefore);
    });

    it('respects the daily cap', async () => {
      assert.equal((await setRules([{ action: 'POST_PUBLISHED', points: 5, dailyCap: 1 }])).status, 200);
      const capped = await createTestUser('gamcap');
      await post(capped);
      await post(capped);
      assert.equal(await points(capped), 1);
      assert.equal((await setRules([{ action: 'POST_PUBLISHED' }])).status, 200);
    });
  });

  describe('penalties', () => {
    it('are off by default', async () => {
      const id = await post(author);
      const before = await points(author);
      await moderator.call('DELETE', `/feed/posts/${id}`);
      assert.equal(await points(author), before - 5, 'only the post points are taken back');
    });

    it('apply when switched on and are undone when the post is restored', async () => {
      assert.equal((await setRules([{ action: 'POST_REMOVED_BY_TEAM', enabled: true }])).status, 200);
      const id = await post(author);
      const before = await points(author);
      await moderator.call('DELETE', `/feed/posts/${id}`);
      assert.equal(await points(author), before - 5 - 10);
      await moderator.call('POST', '/admin/moderation/restore', { targetType: 'post', id });
      assert.equal(await points(author), before);
    });

    it('apply to warnings when switched on', async () => {
      await setRules([{ action: 'WARNING_RECEIVED', enabled: true }]);
      const warned = await createTestUser('gamwarned');
      await moderator.call('POST', `/admin/members/${warned.profileId}/warn`, { reason: 'Please stay on topic' });
      assert.equal(await points(warned), -20);
      await setRules([{ action: 'WARNING_RECEIVED' }, { action: 'POST_REMOVED_BY_TEAM' }]);
    });
  });

  describe('leaderboard', () => {
    it('ranks members for each period and shows where I stand', async () => {
      for (const period of ['7d', '30d', 'all']) {
        const { status, data } = await author.call('GET', `/leaderboard?period=${period}`);
        assert.equal(status, 200);
        assert.equal(data.period, period);
        assert.ok(data.me.rank >= 1);
        assert.ok(data.me.periodPoints > 0);
        const ranks = data.entries.map((entry: { rank: number }) => entry.rank);
        assert.deepEqual(ranks, [...ranks].sort((a, b) => a - b));
      }
    });

    it('explains how points work', async () => {
      const { data } = await fan.call('GET', '/leaderboard/how-it-works');
      assert.ok(data.rules.some((rule: { action: string }) => rule.action === 'POST_PUBLISHED'));
      assert.ok(!data.rules.some((rule: { action: string }) => rule.action === 'WARNING_RECEIVED'), 'disabled rules are hidden');
      assert.equal(data.levels[0].minPoints, 0);
      assert.ok(data.badges.length > 0);
    });
  });

  describe('level locks', () => {
    let spaceId: string;
    let climber: TestUser;

    before(async () => {
      climber = await createTestUser('gamclimber');
      spaceId = (await admin.call('POST', '/admin/spaces', { name: `${TEST_PREFIX} Level lounge`, emoji: '🪜', description: 'For higher levels' })).data.id;
      assert.equal((await admin.call('PUT', `/admin/spaces/${spaceId}/access`, { minLevel: 3 })).status, 200);
    });

    it('locks a space until the member reaches the level', async () => {
      const access = async () =>
        (await climber.call('GET', '/feed/spaces')).data.find((space: { id: string }) => space.id === spaceId).access;
      const locked = await access();
      assert.equal(locked.locked, true);
      assert.equal(locked.reasons[0].type, 'level');
      assert.equal(locked.reasons[0].minLevel, 3);
      assert.ok(locked.reasons[0].pointsToGo > 0);

      const level3 = await prisma.level.findUniqueOrThrow({ where: { level: 3 } });
      await admin.call('POST', `/admin/members/${climber.profileId}/points`, { points: level3.minPoints, reason: 'Testing level locks' });
      assert.equal((await access()).locked, false);
    });
  });

  describe('admin tools', () => {
    let badgeId: string;

    it('is for admins only', async () => {
      assert.equal((await moderator.call('GET', '/admin/gamification')).status, 403);
      assert.equal((await moderator.call('POST', `/admin/members/${fan.profileId}/points`, { points: 5, reason: 'nope' })).status, 403);
      assert.equal((await admin.call('GET', '/admin/gamification')).status, 200);
    });

    it('creates a badge and awards it by hand with a note', async () => {
      const created = await admin.call('POST', '/admin/badges', {
        name: `${TEST_PREFIX} Helper`,
        emoji: '🤝',
        color: '#22c55e',
        description: 'Always helping',
        autoRule: null,
      });
      assert.equal(created.status, 201);
      badgeId = created.data.id;

      const award = () => admin.call('POST', `/admin/members/${fan.profileId}/badges`, { badgeId, note: 'Helped 5 members' });
      assert.equal((await award()).status, 201);
      assert.equal((await award()).status, 409);
      const detail = (await admin.call('GET', `/admin/members/${fan.profileId}`)).data;
      const held = detail.badges.find((row: { badge: { id: string } }) => row.badge.id === badgeId);
      assert.equal(held.note, 'Helped 5 members');
      assert.equal(detail.allowedActions.manageGamification, true);

      assert.equal((await admin.call('DELETE', `/admin/members/${fan.profileId}/badges/${badgeId}`)).status, 204);
      assert.equal((await admin.call('DELETE', `/admin/members/${fan.profileId}/badges/${badgeId}`)).status, 404);
    });

    it('gives a new automatic badge to members who already qualify', async () => {
      const created = await admin.call('POST', '/admin/badges', {
        name: `${TEST_PREFIX} Poster`,
        emoji: '📝',
        color: '#3b82f6',
        description: '',
        autoRule: { type: 'POSTS', threshold: 1 },
      });
      assert.equal(created.status, 201);
      const held = await prisma.memberBadge.findUnique({ where: { badgeId_userId: { badgeId: created.data.id, userId: author.profileId } } });
      assert.ok(held, 'author already has posts');
    });

    it('hides archived badges from members', async () => {
      await admin.call('POST', `/admin/members/${fan.profileId}/badges`, { badgeId });
      assert.equal((await admin.call('PATCH', `/admin/badges/${badgeId}/archive`, { archived: true })).status, 200);
      const me = (await fan.call('GET', '/auth/me')).data.user;
      assert.ok(!me.badges.some((badge: { id: string }) => badge.id === badgeId));
    });

    it('adjusts points with a reason', async () => {
      const before = await points(fan);
      const response = await admin.call('POST', `/admin/members/${fan.profileId}/points`, { points: -3, reason: 'Duplicate posts' });
      assert.equal(response.status, 200);
      assert.equal(response.data.points, before - 3);
      assert.equal((await admin.call('POST', `/admin/members/${fan.profileId}/points`, { points: 0, reason: 'zero' })).status, 400);
    });

    it('validates levels', async () => {
      const bad = await admin.call('PUT', '/admin/gamification/levels', { levels: [{ name: 'One', minPoints: 5 }] });
      assert.equal(bad.status, 400);
      const duplicate = await admin.call('PUT', '/admin/gamification/levels', {
        levels: [
          { name: 'One', minPoints: 0 },
          { name: 'Two', minPoints: 0 },
        ],
      });
      assert.equal(duplicate.status, 400);
    });
  });
});
