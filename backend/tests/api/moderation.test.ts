import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { cleanupTestData, createTestUser, prisma, TestUser } from './support';

const TEST_SPACE_PREFIX = '[test]';
const FLAGGED = 'zzflaggedword';

describe('moderation', () => {
  let admin: TestUser;
  let moderator: TestUser;
  let author: TestUser;
  let reporter: TestUser;
  let reporter2: TestUser;
  let savedFlaggedWords: string[];
  let savedOrder: { id: string; position: number }[];

  const post = (user: TestUser, content: string, spaceId = 'questions') =>
    user.call('POST', '/feed/posts', { spaceId, content });
  const visibleIn = async (user: TestUser, postId: string) =>
    (await user.call('GET', '/feed/posts?limit=50')).data.posts.some((p: { id: string }) => p.id === postId);

  before(async () => {
    const settings = await prisma.communitySettings.findUniqueOrThrow({ where: { id: 'default' } });
    savedFlaggedWords = settings.flaggedWords.filter((word) => word !== FLAGGED);
    savedOrder = await prisma.communitySpace.findMany({ select: { id: true, position: true } });
    // Leftover spaces from an interrupted run
    await prisma.communityPost.deleteMany({ where: { space: { name: { startsWith: TEST_SPACE_PREFIX } } } });
    await prisma.communitySpace.deleteMany({ where: { name: { startsWith: TEST_SPACE_PREFIX } } });
    [admin, moderator, author, reporter, reporter2] = await Promise.all([
      createTestUser('modadmin', { role: 'ADMIN' }),
      createTestUser('modmod', { role: 'MODERATOR' }),
      createTestUser('modauthor'),
      createTestUser('modrep1'),
      createTestUser('modrep2'),
    ]);
  });

  after(async () => {
    await admin.call('PATCH', '/admin/settings', { flaggedWords: savedFlaggedWords });
    await prisma.communityPost.deleteMany({ where: { space: { name: { startsWith: TEST_SPACE_PREFIX } } } });
    await prisma.communitySpace.deleteMany({ where: { name: { startsWith: TEST_SPACE_PREFIX } } });
    await prisma.$transaction(
      savedOrder.map(({ id, position }) => prisma.communitySpace.update({ where: { id }, data: { position } })),
    );
    await cleanupTestData();
  });

  describe('reports', () => {
    let postId: string;

    before(async () => {
      postId = (await post(author, 'Totally normal post')).data.id;
    });

    it('lets members report once, but not their own content', async () => {
      assert.equal((await reporter.call('POST', `/feed/posts/${postId}/report`, { reason: 'SPAM', note: 'Links everywhere' })).status, 201);
      assert.equal((await reporter.call('POST', `/feed/posts/${postId}/report`, { reason: 'SPAM' })).status, 409);
      assert.equal((await reporter2.call('POST', `/feed/posts/${postId}/report`, { reason: 'HARASSMENT' })).status, 201);
      assert.equal((await author.call('POST', `/feed/posts/${postId}/report`, { reason: 'SPAM' })).status, 400);
    });

    it('groups open reports per item for staff only', async () => {
      assert.equal((await author.call('GET', '/admin/moderation/reports')).status, 403);
      const { data } = await moderator.call('GET', '/admin/moderation/reports');
      const group = data.find((g: { targetId: string }) => g.targetId === postId);
      assert.equal(group.reports.length, 2);
      assert.equal(group.post.author.id, author.profileId);
      const overview = await moderator.call('GET', '/admin/overview');
      assert.ok(overview.data.openReports >= 2);
    });

    it('can dismiss reports and leave the post up', async () => {
      const result = await moderator.call('POST', '/admin/moderation/reports/resolve', {
        targetType: 'post', targetId: postId, action: 'dismiss',
      });
      assert.equal(result.data.status, 'DISMISSED');
      assert.equal(await visibleIn(reporter, postId), true);
      const again = await moderator.call('POST', '/admin/moderation/reports/resolve', {
        targetType: 'post', targetId: postId, action: 'dismiss',
      });
      assert.equal(again.status, 409);
    });

    it('can remove a post and warn its author, who sees the warning once', async () => {
      const bad = await post(author, 'Offensive post');
      await reporter.call('POST', `/feed/posts/${bad.data.id}/report`, { reason: 'HATE' });
      const result = await moderator.call('POST', '/admin/moderation/reports/resolve', {
        targetType: 'post',
        targetId: bad.data.id,
        action: 'remove',
        authorAction: { type: 'warn', reason: 'Keep it respectful' },
      });
      assert.equal(result.data.status, 'RESOLVED');
      assert.match(result.data.resolution, /removed the post, warned the author/);
      assert.equal(await visibleIn(reporter, bad.data.id), false);

      const me = (await author.call('GET', '/auth/me')).data.user;
      assert.equal(me.warnings.length, 1);
      assert.equal(me.warnings[0].reason, 'Keep it respectful');
      assert.equal((await author.call('POST', `/auth/warnings/${me.warnings[0].id}/ack`)).status, 204);
      assert.equal((await author.call('GET', '/auth/me')).data.user.warnings.length, 0);
    });

    it("respects moderators' limits when acting on the author, and keeps the reports open", async () => {
      const bad = await post(author, 'Another bad post');
      await reporter.call('POST', `/feed/posts/${bad.data.id}/report`, { reason: 'SPAM' });
      const tooLong = await moderator.call('POST', '/admin/moderation/reports/resolve', {
        targetType: 'post',
        targetId: bad.data.id,
        action: 'remove',
        authorAction: { type: 'suspend', reason: 'Repeated spam', durationDays: 30 },
      });
      assert.equal(tooLong.status, 403);
      assert.equal(await visibleIn(reporter, bad.data.id), true);
      const stillOpen = await prisma.contentReport.count({ where: { postId: bad.data.id, status: 'OPEN' } });
      assert.equal(stillOpen, 1);
    });

    it('reports on comments work the same way', async () => {
      const comment = await author.call('POST', `/feed/posts/${postId}/comments`, { content: 'rude comment' });
      assert.equal((await reporter.call('POST', `/feed/comments/${comment.data.id}/report`, { reason: 'HARASSMENT' })).status, 201);
      const result = await moderator.call('POST', '/admin/moderation/reports/resolve', {
        targetType: 'comment', targetId: comment.data.id, action: 'remove',
      });
      assert.equal(result.data.status, 'RESOLVED');
      const comments = (await reporter.call('GET', `/feed/posts/${postId}/comments`)).data;
      assert.ok(!comments.some((c: { id: string }) => c.id === comment.data.id));
    });
  });

  describe('editing', () => {
    it('authors edit their own posts; staff edits are marked', async () => {
      const created = await post(author, 'Original text');
      const own = await author.call('PATCH', `/feed/posts/${created.data.id}`, { content: 'Fixed typo' });
      assert.equal(own.data.content, 'Fixed typo');
      assert.ok(own.data.editedAt);
      assert.equal(own.data.editedByStaff, undefined);
      assert.equal((await reporter.call('PATCH', `/feed/posts/${created.data.id}`, { content: 'hacked' })).status, 403);
      const byStaff = await moderator.call('PATCH', `/feed/posts/${created.data.id}`, { content: 'Removed a phone number' });
      assert.equal(byStaff.data.editedByStaff, true);
      const log = await moderator.call('GET', `/admin/activity?targetId=${created.data.id}`);
      assert.equal(log.data.entries[0].action, 'post.edited');
    });

    it('comments can be edited the same way', async () => {
      const target = await post(author, 'Post for comments');
      const comment = await reporter.call('POST', `/feed/posts/${target.data.id}/comments`, { content: 'nice' });
      const edited = await reporter.call('PATCH', `/feed/comments/${comment.data.id}`, { content: 'very nice' });
      assert.equal(edited.data.content, 'very nice');
      assert.equal((await author.call('PATCH', `/feed/comments/${comment.data.id}`, { content: 'x' })).status, 403);
      const byStaff = await moderator.call('PATCH', `/feed/comments/${comment.data.id}`, { content: 'edited by team' });
      assert.equal(byStaff.data.editedByStaff, true);
    });
  });

  describe('recently deleted', () => {
    it('lets staff restore a deleted comment, and counts it again', async () => {
      const target = await post(author, 'Restore test');
      const comment = await reporter.call('POST', `/feed/posts/${target.data.id}/comments`, { content: 'bring me back' });
      await moderator.call('DELETE', `/feed/comments/${comment.data.id}`);
      const deleted = await moderator.call('GET', '/admin/moderation/deleted');
      const entry = deleted.data.comments.find((c: { id: string }) => c.id === comment.data.id);
      assert.equal(entry.deletedBy.id, moderator.profileId);
      await moderator.call('POST', '/admin/moderation/restore', { targetType: 'comment', id: comment.data.id });
      const comments = (await reporter.call('GET', `/feed/posts/${target.data.id}/comments`)).data;
      assert.ok(comments.some((c: { id: string }) => c.id === comment.data.id));
      const stored = await prisma.communityPost.findUniqueOrThrow({ where: { id: target.data.id } });
      assert.equal(stored.commentCount, 1);
    });

    it('restores deleted posts', async () => {
      const target = await post(author, 'Deleted by mistake');
      await author.call('DELETE', `/feed/posts/${target.data.id}`);
      assert.equal(await visibleIn(reporter, target.data.id), false);
      assert.equal((await author.call('POST', '/admin/moderation/restore', { targetType: 'post', id: target.data.id })).status, 403);
      await moderator.call('POST', '/admin/moderation/restore', { targetType: 'post', id: target.data.id });
      assert.equal(await visibleIn(reporter, target.data.id), true);
    });
  });

  describe('flagged words', () => {
    before(async () => {
      assert.equal((await moderator.call('PATCH', '/admin/settings', { flaggedWords: [FLAGGED] })).status, 403);
      await admin.call('PATCH', '/admin/settings', { flaggedWords: [...savedFlaggedWords, FLAGGED] });
    });

    it('holds a matching post for staff review only', async () => {
      const created = await post(author, `This contains ${FLAGGED.toUpperCase()} somewhere`);
      assert.equal(created.data.reviewStatus, 'PENDING');
      assert.equal(created.data.heldForReview, true);
      assert.equal(await visibleIn(reporter, created.data.id), false);
      const held = await moderator.call('GET', '/admin/moderation/held');
      assert.ok(held.data.posts.some((p: { id: string }) => p.id === created.data.id));
      assert.equal((await moderator.call('POST', `/feed/reviews/${created.data.id}/approve`)).status, 200);
      assert.equal(await visibleIn(reporter, created.data.id), true);
    });

    it('holds a matching comment until staff release it', async () => {
      const target = await post(author, 'Clean post');
      const comment = await reporter.call('POST', `/feed/posts/${target.data.id}/comments`, { content: `${FLAGGED}!` });
      assert.equal(comment.data.heldForReview, true);
      const asAuthor = (await reporter.call('GET', `/feed/posts/${target.data.id}/comments`)).data;
      assert.ok(asAuthor.some((c: { id: string }) => c.id === comment.data.id));
      const asOthers = (await author.call('GET', `/feed/posts/${target.data.id}/comments`)).data;
      assert.ok(!asOthers.some((c: { id: string }) => c.id === comment.data.id));
      assert.equal((await prisma.communityPost.findUniqueOrThrow({ where: { id: target.data.id } })).commentCount, 0);
      await moderator.call('POST', `/admin/moderation/comments/${comment.data.id}/release`);
      const released = (await author.call('GET', `/feed/posts/${target.data.id}/comments`)).data;
      assert.ok(released.some((c: { id: string }) => c.id === comment.data.id));
      assert.equal((await prisma.communityPost.findUniqueOrThrow({ where: { id: target.data.id } })).commentCount, 1);
    });

    it("doesn't filter staff", async () => {
      const created = await post(moderator, `Quoting ${FLAGGED} to explain the rule`);
      assert.equal(created.data.reviewStatus, 'PUBLISHED');
    });
  });

  describe('spaces', () => {
    let spaceId: string;

    it('only admins manage spaces', async () => {
      assert.equal((await moderator.call('GET', '/admin/spaces')).status, 403);
      const created = await admin.call('POST', '/admin/spaces', {
        name: `${TEST_SPACE_PREFIX} Brand Deals`,
        emoji: '💼',
        description: 'Talk about brand partnerships',
      });
      assert.equal(created.status, 201);
      spaceId = created.data.id;
      assert.match(spaceId, /^test-brand-deals/);
      const listed = (await author.call('GET', '/feed/spaces')).data;
      assert.ok(listed.some((s: { id: string }) => s.id === spaceId));
    });

    it('can make a space staff-only', async () => {
      await admin.call('PATCH', `/admin/spaces/${spaceId}`, { adminOnly: true, description: 'Team updates on deals' });
      assert.equal((await post(author, 'hi', spaceId)).status, 403);
      assert.equal((await post(moderator, 'Team post', spaceId)).status, 201);
    });

    it('validates and saves a new order', async () => {
      const active = (await admin.call('GET', '/admin/spaces')).data.filter((s: { archivedAt: string | null }) => !s.archivedAt);
      const ids = active.map((s: { id: string }) => s.id);
      assert.equal((await admin.call('PUT', '/admin/spaces/order', { ids: ids.slice(1) })).status, 400);
      const reversed = await admin.call('PUT', '/admin/spaces/order', { ids: [...ids].reverse() });
      assert.equal(reversed.status, 200);
      const first = (await author.call('GET', '/feed/spaces')).data[0];
      assert.equal(first.id, ids[ids.length - 1]);
    });

    it('archiving hides the space and closes it to new posts', async () => {
      await admin.call('PATCH', `/admin/spaces/${spaceId}/archive`, { archived: true });
      const listed = (await author.call('GET', '/feed/spaces')).data;
      assert.ok(!listed.some((s: { id: string }) => s.id === spaceId));
      assert.equal((await post(moderator, 'too late', spaceId)).status, 400);
      await admin.call('PATCH', `/admin/spaces/${spaceId}/archive`, { archived: false });
      assert.ok((await author.call('GET', '/feed/spaces')).data.some((s: { id: string }) => s.id === spaceId));
    });
  });
});
