import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { cleanupTestData, createTestUser, prisma, TestUser } from './support';

const TEST_PREFIX = '[test]';
const DAY_MS = 24 * 60 * 60 * 1000;

describe('access rules', () => {
  let superAdmin: TestUser;
  let admin: TestUser;
  let moderator: TestUser;
  let instructor: TestUser;
  let newMember: TestUser;
  let oldMember: TestUser;
  let proMember: TestUser;
  let spaceId: string;
  let tierId: string;

  const spaceAccess = async (user: TestUser) =>
    (await user.call('GET', '/feed/spaces')).data.find((s: { id: string }) => s.id === spaceId)?.access;
  const setRule = (user: TestUser, rule: object) => user.call('PUT', `/admin/spaces/${spaceId}/access`, rule);

  const removeTestData = async () => {
    const spaces = await prisma.communitySpace.findMany({ where: { name: { startsWith: TEST_PREFIX } }, select: { id: true } });
    const ids = spaces.map((space) => space.id);
    await prisma.accessRule.deleteMany({ where: { resourceType: 'space', resourceId: { in: ids } } });
    await prisma.communityPost.deleteMany({ where: { spaceId: { in: ids } } });
    await prisma.communitySpace.deleteMany({ where: { id: { in: ids } } });
    await prisma.userProfile.updateMany({ where: { tier: { name: { startsWith: TEST_PREFIX } } }, data: { tierId: null } });
    await prisma.membershipTier.deleteMany({ where: { name: { startsWith: TEST_PREFIX } } });
  };

  before(async () => {
    await removeTestData(); // leftovers from an interrupted run
    [superAdmin, admin, moderator, instructor, newMember, oldMember, proMember] = await Promise.all([
      createTestUser('accsuper', { role: 'SUPER_ADMIN' }),
      createTestUser('accadmin', { role: 'ADMIN' }),
      createTestUser('accmod', { role: 'MODERATOR' }),
      createTestUser('accinstr', { role: 'INSTRUCTOR' }),
      createTestUser('accnew'),
      createTestUser('accold'),
      createTestUser('accpro'),
    ]);
    await prisma.userProfile.update({ where: { id: newMember.profileId }, data: { createdAt: new Date(Date.now() - 10 * DAY_MS) } });
    await prisma.userProfile.update({ where: { id: oldMember.profileId }, data: { createdAt: new Date(Date.now() - 40 * DAY_MS) } });
    const space = await admin.call('POST', '/admin/spaces', { name: `${TEST_PREFIX} Vault`, emoji: '🔐', description: 'Locked content' });
    spaceId = space.data.id;
  });

  after(async () => {
    await removeTestData();
    await cleanupTestData();
  });

  it('spaces without a rule are open to everyone', async () => {
    assert.deepEqual(await spaceAccess(newMember), { locked: false, reasons: [] });
  });

  describe('time in the community', () => {
    let postId: string;

    before(async () => {
      assert.equal((await setRule(admin, { minDays: 30 })).status, 200);
      postId = (await oldMember.call('POST', '/feed/posts', { spaceId, content: 'For members of 30+ days' })).data.id;
    });

    it('locks the space for a 10-day-old member and opens it for a 40-day-old one', async () => {
      const locked = await spaceAccess(newMember);
      assert.equal(locked.locked, true);
      assert.equal(locked.reasons[0].type, 'time');
      assert.ok(locked.reasons[0].daysLeft >= 19 && locked.reasons[0].daysLeft <= 21);
      assert.equal((await spaceAccess(oldMember)).locked, false);
    });

    it('never sends locked posts to the member', async () => {
      const filtered = await newMember.call('GET', `/feed/posts?spaceId=${spaceId}`);
      assert.equal(filtered.status, 403);
      assert.match(filtered.data.error, /Unlocks in/);
      const all = await newMember.call('GET', '/feed/posts?limit=50');
      assert.ok(!all.data.posts.some((p: { id: string }) => p.id === postId));
      assert.equal((await newMember.call('PUT', `/feed/posts/${postId}/like`)).status, 404);
      assert.equal((await newMember.call('GET', `/feed/posts/${postId}/comments`)).status, 404);
      assert.equal((await newMember.call('POST', '/feed/posts', { spaceId, content: 'hi' })).status, 403);
    });

    it('staff always have access', async () => {
      assert.equal((await spaceAccess(moderator)).locked, false);
      const asModerator = await moderator.call('GET', `/feed/posts?spaceId=${spaceId}`);
      assert.equal(asModerator.status, 200);
    });
  });

  describe('roles', () => {
    it('can open a space to instructors and above', async () => {
      await setRule(admin, { minRole: 'INSTRUCTOR' });
      assert.equal((await spaceAccess(oldMember)).locked, true);
      assert.deepEqual((await spaceAccess(oldMember)).reasons[0], { type: 'role', minRole: 'INSTRUCTOR' });
      assert.equal((await spaceAccess(instructor)).locked, false);
    });
  });

  describe('tiers', () => {
    before(async () => {
      assert.equal((await admin.call('POST', '/admin/tiers', { name: `${TEST_PREFIX} Pro` })).status, 403);
      const tier = await superAdmin.call('POST', '/admin/tiers', { name: `${TEST_PREFIX} Pro`, description: 'Paid members' });
      assert.equal(tier.status, 201);
      tierId = tier.data.id;
    });

    it('only Super Admins decide which tiers can access a space', async () => {
      assert.equal((await setRule(admin, { tierIds: [tierId] })).status, 403);
      assert.equal((await setRule(superAdmin, { tierIds: [tierId] })).status, 200);
      const access = await spaceAccess(proMember);
      assert.equal(access.locked, true);
      assert.equal(access.reasons[0].type, 'tier');
      assert.equal(access.reasons[0].tiers[0].id, tierId);
    });

    it('a member on the right tier gets in; only Super Admins change tiers', async () => {
      assert.equal((await admin.call('PATCH', `/admin/members/${proMember.profileId}/tier`, { tierId })).status, 403);
      assert.equal((await superAdmin.call('PATCH', `/admin/members/${proMember.profileId}/tier`, { tierId })).status, 200);
      assert.equal((await spaceAccess(proMember)).locked, false);
      const me = (await proMember.call('GET', '/auth/me')).data.user;
      assert.equal(me.tier.id, tierId);
    });

    it("admins can still change other conditions without touching tiers", async () => {
      assert.equal((await setRule(admin, { tierIds: [tierId], minDays: 30 })).status, 200);
      const access = await spaceAccess(proMember);
      assert.equal(access.locked, true);
      assert.equal(access.reasons[0].type, 'time');
    });

    it("the default tier can't be deleted; deleting another moves its members to the default", async () => {
      const tiers = (await superAdmin.call('GET', '/admin/tiers')).data;
      const defaultTier = tiers.find((t: { isDefault: boolean }) => t.isDefault);
      assert.equal((await superAdmin.call('DELETE', `/admin/tiers/${defaultTier.id}`)).status, 400);
      assert.equal((await superAdmin.call('DELETE', `/admin/tiers/${tierId}`)).status, 204);
      const me = (await proMember.call('GET', '/auth/me')).data.user;
      assert.equal(me.tier.id, defaultTier.id);
      const rule = await prisma.accessRule.findUnique({ where: { resourceType_resourceId: { resourceType: 'space', resourceId: spaceId } } });
      assert.deepEqual(rule?.tierIds, []);
    });
  });

  it('clearing every condition opens the space again', async () => {
    assert.equal((await setRule(superAdmin, { minRole: null, tierIds: [], minDays: null })).status, 200);
    assert.deepEqual(await spaceAccess(newMember), { locked: false, reasons: [] });
    assert.equal(await prisma.accessRule.count({ where: { resourceId: spaceId } }), 0);
  });
});
