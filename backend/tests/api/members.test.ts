import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { cleanupTestData, createTestUser, prisma, TestUser } from './support';

describe('member profiles and directory', () => {
  let viewer: TestUser;
  let creator: TestUser;
  let banned: TestUser;
  let creatorUsername: string;
  const niche = `Niche${Date.now()}`;

  before(async () => {
    [viewer, creator, banned] = await Promise.all([createTestUser('dirview'), createTestUser('dircreator'), createTestUser('dirbanned')]);
    await prisma.userProfile.update({
      where: { id: creator.profileId },
      data: { bio: 'I film street food.', niche, socialLinks: [{ platform: 'youtube', url: 'https://youtube.com/@creator' }] },
    });
    await prisma.userProfile.update({ where: { id: banned.profileId }, data: { status: 'BANNED', niche } });
    creatorUsername = (await creator.call('GET', '/profile/settings')).data.username;
  });

  after(cleanupTestData);

  it('finds members by niche, and never banned ones', async () => {
    const { status, data } = await viewer.call('GET', `/members?q=${niche}`);
    assert.equal(status, 200);
    const ids = data.members.map((member: { id: string }) => member.id);
    assert.deepEqual(ids, [creator.profileId]);
    assert.equal(data.members[0].niche, niche);
    assert.ok(data.members[0].level.name);
  });

  it('shows a profile, and hides links the member chose to hide', async () => {
    const shown = (await viewer.call('GET', `/members/${creatorUsername}`)).data;
    assert.equal(shown.bio, 'I film street food.');
    assert.equal(shown.socialLinks.length, 1);
    assert.equal(shown.isSelf, false);

    await creator.call('PUT', '/profile/privacy', { showSocialLinks: false });
    assert.deepEqual((await viewer.call('GET', `/members/${creatorUsername}`)).data.socialLinks, []);
    assert.equal((await creator.call('GET', `/members/${creatorUsername}`)).data.socialLinks.length, 1, 'members still see their own');

    const bannedName = (await banned.call('GET', '/auth/me')).data?.user?.username;
    if (bannedName) assert.equal((await viewer.call('GET', `/members/${bannedName}`)).status, 404);
    assert.equal((await viewer.call('GET', '/members/no-such-member-here')).status, 404);
  });

  it('lists one member’s posts for their profile', async () => {
    const spaces = (await creator.call('GET', '/feed/spaces')).data;
    const space = spaces.find((item: { adminOnly: boolean; access?: { locked: boolean } }) => !item.adminOnly && !item.access?.locked);
    const created = await creator.call('POST', '/feed/posts', { spaceId: space.id, content: 'A post for my profile' });
    assert.equal(created.status, 201, JSON.stringify(created.data));
    const { data } = await viewer.call('GET', `/feed/posts?authorId=${creator.profileId}`);
    assert.ok(data.posts.length >= 1);
    assert.ok(data.posts.every((post: { author: { id: string } }) => post.author.id === creator.profileId));
  });
});
