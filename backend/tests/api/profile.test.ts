import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { cleanupTestData, createTestUser, prisma, TestUser } from './support';

describe('profile and settings', () => {
  let member: TestUser;
  let other: TestUser;
  let admin: TestUser;

  before(async () => {
    [member, other, admin] = await Promise.all([
      createTestUser('prof'),
      createTestUser('profother'),
      createTestUser('profadmin', { role: 'ADMIN' }),
    ]);
  });

  after(cleanupTestData);

  it('loads everything the settings page shows', async () => {
    const { status, data } = await member.call('GET', '/profile/settings');
    assert.equal(status, 200);
    assert.equal(data.email, member.email);
    assert.deepEqual(data.socialLinks, []);
    assert.equal(data.showOnLeaderboard, true);
    assert.ok(data.level && typeof data.level.name === 'string');
    assert.ok('currentVersion' in data.guide);
  });

  it('edits the profile and validates it', async () => {
    const saved = await member.call('PATCH', '/profile', {
      name: 'Profile Tester',
      bio: 'I make short videos about cooking.',
      niche: 'Food',
      socialLinks: [{ platform: 'instagram', url: 'https://instagram.com/tester' }],
    });
    assert.equal(saved.status, 200, JSON.stringify(saved.data));
    assert.equal(saved.data.bio, 'I make short videos about cooking.');
    assert.equal(saved.data.niche, 'Food');

    const badLink = await member.call('PATCH', '/profile', { socialLinks: [{ platform: 'instagram', url: 'instagram.com/x' }] });
    assert.equal(badLink.status, 400);

    const otherName = (await other.call('GET', '/profile/settings')).data.username;
    const taken = await member.call('PATCH', '/profile', { username: otherName });
    assert.equal(taken.status, 409);

    const foreignPhoto = await member.call('PATCH', '/profile', { avatarUrl: 'https://example.com/me.png' });
    assert.equal(foreignPhoto.status, 400);

    const tooBig = await member.call('POST', '/profile/avatar-upload', { contentType: 'image/png', size: 5 * 1024 * 1024 });
    assert.equal(tooBig.status, 400);
  });

  it('merges preferences and returns them on /auth/me', async () => {
    await member.call('PUT', '/profile/preferences', { theme: 'dark' });
    await member.call('PUT', '/profile/preferences', { reducedMotion: true });
    const me = (await member.call('GET', '/auth/me')).data.user;
    assert.deepEqual(me.preferences, { theme: 'dark', reducedMotion: true });
    assert.equal((await member.call('PUT', '/profile/preferences', { theme: 'neon' })).status, 400);
  });

  it('hides a member from the leaderboard and their badges when they ask', async () => {
    await prisma.userProfile.update({ where: { id: member.profileId }, data: { points: 999_999 } });
    const badge = await prisma.badge.findFirst({ where: { archivedAt: null } });
    if (badge) await prisma.memberBadge.create({ data: { badgeId: badge.id, userId: member.profileId } });

    const board = async (viewer: TestUser) => (await viewer.call('GET', '/leaderboard?period=all')).data;
    const visible = (await board(other)).entries.find((entry: { member: { id: string } }) => entry.member.id === member.profileId);
    assert.ok(visible, 'shown by default');
    if (badge) assert.ok(visible.member.badges.length > 0);

    await member.call('PUT', '/profile/privacy', { showOnLeaderboard: false, showBadges: false });
    const hidden = (await board(other)).entries.find((entry: { member: { id: string } }) => entry.member.id === member.profileId);
    assert.equal(hidden, undefined, 'others no longer see them');
    const own = await board(member);
    assert.equal(own.me.rank, 1, 'they still see their own rank');
    assert.deepEqual(own.me.member.badges, [], 'badges are hidden');
  });

  it('records a deletion request the team can see, and lets the member cancel it', async () => {
    const requested = await member.call('POST', '/profile/deletion-request');
    assert.ok(requested.data.deletionRequestedAt);
    const panel = (await admin.call('GET', `/admin/members/${member.profileId}`)).data;
    assert.ok(panel.deletionRequestedAt);
    const cancelled = await member.call('DELETE', '/profile/deletion-request');
    assert.equal(cancelled.data.deletionRequestedAt, null);
  });
});
