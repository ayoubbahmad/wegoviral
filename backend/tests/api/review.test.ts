import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { cleanupTestData, createTestUser, prisma, TestUser } from './support';

const DAY_MS = 24 * 60 * 60 * 1000;

describe('post review (probation)', () => {
  let newcomer: TestUser;
  let moderator: TestUser;
  let trusted: TestUser;
  let recent: TestUser;
  let admin: TestUser;
  let savedProbationCount: number;

  const post = (user: TestUser, content: string) =>
    user.call('POST', '/feed/posts', { spaceId: 'questions', content });
  const visibleTo = async (user: TestUser, postId: string) =>
    (await user.call('GET', '/feed/posts?spaceId=questions&limit=50')).data.posts.some(
      (p: { id: string }) => p.id === postId,
    );

  before(async () => {
    const settings = await prisma.communitySettings.findUniqueOrThrow({ where: { id: 'default' } });
    savedProbationCount = settings.probationPostCount;
    [newcomer, moderator, trusted, recent, admin] = await Promise.all([
      createTestUser('newcomer', { probation: true }),
      createTestUser('revmod', { role: 'MODERATOR' }),
      createTestUser('trusted'),
      createTestUser('recent'),
      createTestUser('revadmin', { role: 'ADMIN' }),
    ]);
    // Two reviewed posts finish probation in this suite (through the API so the server's cache updates)
    await admin.call('PATCH', '/admin/settings', { probationPostCount: 2 });
    // A trusted member: past probation and in the community for over 30 days
    await prisma.userProfile.update({
      where: { id: trusted.profileId },
      data: { createdAt: new Date(Date.now() - 40 * DAY_MS) },
    });
  });

  after(async () => {
    await admin.call('PATCH', '/admin/settings', { probationPostCount: savedProbationCount });
    await cleanupTestData();
  });

  let firstPostId: string;

  it("holds a new member's post for review, visible only to its author", async () => {
    const created = await post(newcomer, 'My first post');
    assert.equal(created.status, 201);
    assert.equal(created.data.reviewStatus, 'PENDING');
    firstPostId = created.data.id;
    assert.equal(await visibleTo(newcomer, firstPostId), true);
    assert.equal(await visibleTo(trusted, firstPostId), false);
    const me = (await newcomer.call('GET', '/auth/me')).data.user.onboarding;
    assert.deepEqual(me.probation, { onProbation: true, approvedPosts: 0, pendingPosts: 1, required: 2 });
  });

  it("doesn't allow reactions on posts waiting for review", async () => {
    assert.equal((await trusted.call('PUT', `/feed/posts/${firstPostId}/like`)).status, 404);
    assert.equal((await trusted.call('POST', `/feed/posts/${firstPostId}/comments`, { content: 'hi' })).status, 404);
  });

  it('only lets staff and trusted members review', async () => {
    const asNewcomer = await newcomer.call('GET', '/feed/reviews');
    assert.equal(asNewcomer.status, 403);
    const asRecent = await recent.call('GET', '/feed/reviews');
    assert.equal(asRecent.status, 403);
    assert.match(asRecent.data.error, /30 days/);
    assert.equal((await recent.call('GET', '/auth/me')).data.user.onboarding.canReviewPosts, false);
    assert.equal((await trusted.call('GET', '/auth/me')).data.user.onboarding.canReviewPosts, true);
    const queue = await trusted.call('GET', '/feed/reviews');
    assert.equal(queue.status, 200);
    assert.ok(queue.data.some((p: { id: string }) => p.id === firstPostId));
  });

  it("never shows reviewers their own posts or lets them review them", async () => {
    const pendingOwn = await prisma.communityPost.create({
      data: { spaceId: 'questions', authorId: trusted.profileId, content: 'own pending', reviewStatus: 'PENDING' },
    });
    const queue = await trusted.call('GET', '/feed/reviews');
    assert.ok(!queue.data.some((p: { id: string }) => p.id === pendingOwn.id));
    assert.equal((await trusted.call('POST', `/feed/reviews/${pendingOwn.id}/approve`)).status, 403);
  });

  it('publishes an approved post and records the reviewer', async () => {
    const approved = await trusted.call('POST', `/feed/reviews/${firstPostId}/approve`);
    assert.equal(approved.data.reviewStatus, 'PUBLISHED');
    assert.equal((await moderator.call('POST', `/feed/reviews/${firstPostId}/approve`)).status, 409);
    assert.equal(await visibleTo(recent, firstPostId), true);
    const stored = await prisma.communityPost.findUniqueOrThrow({ where: { id: firstPostId } });
    assert.equal(stored.reviewedById, trusted.profileId);
  });

  it('shows the author why a post was refused', async () => {
    const created = await post(newcomer, 'Buy my course!!!');
    await moderator.call('POST', `/feed/reviews/${created.data.id}/reject`, { note: 'No promotion in Questions' });
    const own = (await newcomer.call('GET', '/feed/posts?spaceId=questions&limit=50')).data.posts.find(
      (p: { id: string }) => p.id === created.data.id,
    );
    assert.equal(own.reviewStatus, 'REJECTED');
    assert.equal(own.reviewNote, 'No promotion in Questions');
    assert.equal(await visibleTo(recent, created.data.id), false);
  });

  it('ends probation after enough approved posts', async () => {
    const second = await post(newcomer, 'Second post');
    assert.equal(second.data.reviewStatus, 'PENDING');
    await moderator.call('POST', `/feed/reviews/${second.data.id}/approve`);
    const me = (await newcomer.call('GET', '/auth/me')).data.user.onboarding;
    assert.deepEqual(me.probation, { onProbation: false });
    const third = await post(newcomer, 'Now I post directly');
    assert.equal(third.data.reviewStatus, 'PUBLISHED');
  });

  it("existing members and special members aren't on probation", async () => {
    assert.equal((await post(recent, 'Existing member post')).data.reviewStatus, 'PUBLISHED');
    const special = await createTestUser('revspecial', { probation: true });
    await prisma.userProfile.update({ where: { id: special.profileId }, data: { specialMember: true } });
    assert.equal((await post(special, 'Special member post')).data.reviewStatus, 'PUBLISHED');
  });

  describe('responsibility trail', () => {
    it("records on the reviewer's history when a post they approved is removed", async () => {
      await moderator.call('DELETE', `/feed/posts/${firstPostId}`);
      const history = await moderator.call('GET', `/admin/activity?targetId=${trusted.profileId}`);
      const entry = history.data.entries.find((e: { action: string }) => e.action === 'member.vouched_post_removed');
      assert.ok(entry, 'missing vouched_post_removed entry');
      assert.equal(entry.details.postId, firstPostId);
    });

    it("records on the referrer's history when someone they referred is restricted", async () => {
      const { data: referral } = await trusted.call('GET', '/onboarding/referral');
      const friend = await createTestUser('revfriend', { joined: false });
      await friend.call('POST', '/onboarding/application', {
        fullName: 'Referred Friend',
        phone: '+212 600 000 000',
        niche: 'Travel',
        platforms: [{ platform: 'instagram', handle: '@friend' }],
        code: referral.code,
      });
      await moderator.call('POST', `/admin/members/${friend.profileId}/restriction`, {
        status: 'MUTED',
        reason: 'Spam',
        durationDays: 1,
      });
      const history = await moderator.call('GET', `/admin/activity?targetId=${trusted.profileId}`);
      assert.ok(history.data.entries.some((e: { action: string }) => e.action === 'member.referral_restricted'));
    });
  });

  it('counts posts waiting for review in the admin overview', async () => {
    await post(await createTestUser('revpending', { probation: true }), 'waiting');
    const overview = await moderator.call('GET', '/admin/overview');
    assert.ok(overview.data.pendingReviews >= 1);
  });
});
