import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { cleanupTestData, createTestUser, prisma, TestUser } from './support';

describe('admin', () => {
  let superAdmin: TestUser;
  let admin: TestUser;
  let moderator: TestUser;
  let instructor: TestUser;
  let member: TestUser;
  let member2: TestUser;

  before(async () => {
    [superAdmin, admin, moderator, instructor, member, member2] = await Promise.all([
      createTestUser('sadmin', { role: 'SUPER_ADMIN' }),
      createTestUser('admin', { role: 'ADMIN' }),
      createTestUser('mod', { role: 'MODERATOR' }),
      createTestUser('instr', { role: 'INSTRUCTOR' }),
      createTestUser('member'),
      createTestUser('member2'),
    ]);
  });
  after(cleanupTestData);

  const post = (user: TestUser) =>
    user.call('POST', '/feed/posts', { spaceId: 'questions', content: `post by ${user.email}` });

  describe('access', () => {
    it('keeps members and instructors out of the admin API', async () => {
      assert.equal((await member.call('GET', '/admin/overview')).status, 403);
      assert.equal((await instructor.call('GET', '/admin/members')).status, 403);
    });

    it('lets moderators in', async () => {
      const { status, data } = await moderator.call('GET', '/admin/overview');
      assert.equal(status, 200);
      assert.ok(data.members.total >= 6);
    });

    it('returns each role its permissions in /auth/me', async () => {
      const perms = async (user: TestUser) => (await user.call('GET', '/auth/me')).data.user.permissions;
      assert.deepEqual(await perms(member), []);
      assert.ok((await perms(moderator)).includes('admin.access'));
      assert.ok(!(await perms(moderator)).includes('roles.manage'));
      assert.ok((await perms(admin)).includes('roles.manage'));
      assert.ok(!(await perms(admin)).includes('roles.manage_admins'));
      assert.ok((await perms(superAdmin)).includes('roles.manage_admins'));
    });
  });

  describe('members list', () => {
    it('searches and filters', async () => {
      const username = (await member.call('GET', '/auth/me')).data.user.username;
      const search = await moderator.call('GET', `/admin/members?search=${username}`);
      assert.equal(search.status, 200);
      assert.ok(search.data.members.some((m: { id: string }) => m.id === member.profileId));
      const mods = await moderator.call('GET', '/admin/members?role=MODERATOR&pageSize=100');
      assert.ok(mods.data.members.every((m: { role: string }) => m.role === 'MODERATOR'));
    });

    it('only offers actions the viewer is allowed to take', async () => {
      const onAdmin = await moderator.call('GET', `/admin/members/${admin.profileId}`);
      assert.equal(onAdmin.data.allowedActions.restrict, false);
      const onMember = await moderator.call('GET', `/admin/members/${member.profileId}`);
      assert.equal(onMember.data.allowedActions.restrict, true);
      assert.equal(onMember.data.allowedActions.changeRole, false);
      assert.equal(onMember.data.allowedActions.maxRestrictionDays, 7);
    });
  });

  describe('roles', () => {
    const setRole = (actor: TestUser, target: TestUser, role: string) =>
      actor.call('PATCH', `/admin/members/${target.profileId}/role`, { role });

    it("doesn't let moderators change roles", async () => {
      assert.equal((await setRole(moderator, member, 'INSTRUCTOR')).status, 403);
    });

    it('lets admins assign roles up to Moderator, but not Admin', async () => {
      assert.equal((await setRole(admin, member2, 'MODERATOR')).data.role, 'MODERATOR');
      assert.equal((await setRole(admin, member2, 'ADMIN')).status, 403);
      assert.equal((await setRole(admin, member2, 'MEMBER')).data.role, 'MEMBER');
    });

    it("doesn't let admins manage other admins or themselves", async () => {
      assert.equal((await setRole(admin, superAdmin, 'MEMBER')).status, 403);
      assert.equal((await setRole(admin, admin, 'MEMBER')).status, 403);
    });

    it('lets Super Admins appoint admins but not change their own role', async () => {
      assert.equal((await setRole(superAdmin, member2, 'ADMIN')).data.role, 'ADMIN');
      assert.equal((await setRole(superAdmin, member2, 'MEMBER')).data.role, 'MEMBER');
      assert.equal((await setRole(superAdmin, superAdmin, 'ADMIN')).status, 403);
    });
  });

  describe('restrictions', () => {
    const restrict = (actor: TestUser, target: TestUser, body: object) =>
      actor.call('POST', `/admin/members/${target.profileId}/restriction`, body);

    it('caps what moderators can do', async () => {
      const reason = 'Testing limits';
      assert.equal((await restrict(moderator, member, { status: 'MUTED', reason, durationDays: 30 })).status, 403);
      assert.equal((await restrict(moderator, member, { status: 'MUTED', reason, durationDays: null })).status, 403);
      assert.equal((await restrict(moderator, member, { status: 'BANNED', reason, durationDays: 3 })).status, 403);
      assert.equal((await restrict(moderator, admin, { status: 'MUTED', reason, durationDays: 1 })).status, 403);
    });

    it('muted members can read but not post', async () => {
      const muted = await restrict(moderator, member, { status: 'MUTED', reason: 'Spamming links', durationDays: 3 });
      assert.equal(muted.data.status, 'MUTED');
      const attempt = await post(member);
      assert.equal(attempt.status, 403);
      assert.equal(attempt.data.code, 'MUTED');
      assert.equal((await member.call('GET', '/feed/posts?limit=1')).status, 200);
    });

    it('suspended members are locked out but can see why', async () => {
      await restrict(admin, member2, { status: 'SUSPENDED', reason: 'Harassment', durationDays: 7 });
      const blocked = await member2.call('GET', '/feed/posts');
      assert.equal(blocked.status, 403);
      assert.equal(blocked.data.code, 'ACCOUNT_RESTRICTED');
      const me = await member2.call('GET', '/auth/me');
      assert.equal(me.status, 200);
      assert.equal(me.data.user.status, 'SUSPENDED');
      assert.equal(me.data.user.statusReason, 'Harassment');
    });

    it('only admins lift a ban', async () => {
      await restrict(admin, member2, { status: 'BANNED', reason: 'Repeated harassment', durationDays: null });
      assert.equal((await moderator.call('DELETE', `/admin/members/${member2.profileId}/restriction`)).status, 403);
      const lifted = await admin.call('DELETE', `/admin/members/${member2.profileId}/restriction`);
      assert.equal(lifted.data.status, 'ACTIVE');
      assert.equal((await post(member2)).status, 201);
    });

    it('expired restrictions no longer apply', async () => {
      await prisma.userProfile.update({
        where: { id: member.profileId },
        data: { statusUntil: new Date(Date.now() - 60_000) },
      });
      assert.equal((await post(member)).status, 201);
      const listed = await moderator.call('GET', `/admin/members/${member.profileId}`);
      assert.equal(listed.data.status, 'ACTIVE');
    });
  });

  describe('activity log', () => {
    it('records role changes and restrictions with the actor', async () => {
      const { status, data } = await moderator.call('GET', `/admin/activity?targetId=${member2.profileId}`);
      assert.equal(status, 200);
      const actions = data.entries.map((entry: { action: string }) => entry.action);
      for (const action of ['member.role_changed', 'member.suspended', 'member.banned', 'member.restriction_lifted']) {
        assert.ok(actions.includes(action), `missing ${action}`);
      }
      const roleChange = data.entries.find((entry: { action: string }) => entry.action === 'member.role_changed');
      assert.ok(roleChange.actor?.id);
    });

    it('records staff deleting someone else’s post, but not authors deleting their own', async () => {
      const own = await post(member2);
      await member2.call('DELETE', `/feed/posts/${own.data.id}`);
      const target = await post(member2);
      await moderator.call('DELETE', `/feed/posts/${target.data.id}`);
      const forOwn = await moderator.call('GET', `/admin/activity?targetId=${own.data.id}`);
      const forTarget = await moderator.call('GET', `/admin/activity?targetId=${target.data.id}`);
      assert.equal(forOwn.data.entries.length, 0);
      assert.equal(forTarget.data.entries[0].action, 'post.deleted');
    });

    it('is staff only', async () => {
      assert.equal((await member.call('GET', '/admin/activity')).status, 403);
    });
  });
});
