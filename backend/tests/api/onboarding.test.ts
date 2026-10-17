import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { CommunitySettings, GuideSection, QuizQuestion } from '@prisma/client';
import { callApi, cleanupTestData, createTestUser, prisma, TestUser } from './support';

const application = (overrides: Record<string, unknown> = {}) => ({
  fullName: 'Test Applicant',
  phone: '+212 612 345 678',
  niche: 'Cooking shorts',
  platforms: [{ platform: 'tiktok', handle: '@testcooks' }],
  followerRange: '1k-10k',
  ...overrides,
});

const TEST_MARK = '[test]';

const step = async (user: TestUser) => (await user.call('GET', '/auth/me')).data.user.onboarding.step;
const tryPost = (user: TestUser) => user.call('POST', '/feed/posts', { spaceId: 'questions', content: 'hello' });

describe('onboarding', () => {
  let admin: TestUser;
  let moderator: TestUser;

  // This suite edits the real guide, quiz and settings (shared database), so restore them afterwards
  let savedSettings: CommunitySettings;
  let savedSections: GuideSection[];
  let savedQuestions: QuizQuestion[];

  before(async () => {
    savedSettings = (await prisma.communitySettings.findUnique({ where: { id: 'default' } }))!;
    savedSections = await prisma.guideSection.findMany({ orderBy: { position: 'asc' } });
    savedQuestions = await prisma.quizQuestion.findMany({ orderBy: { position: 'asc' } });
    // An interrupted earlier run can leave its own content behind: that's not the real guide
    const leftover =
      savedSections.some((section) => section.title.startsWith(TEST_MARK)) ||
      savedQuestions.some((question) => question.question.startsWith(TEST_MARK));
    if (leftover) {
      savedSections = [];
      savedQuestions = [];
      savedSettings = { ...savedSettings, guideVersion: 0, requireQuiz: false, quizPassPercent: 80 };
    }
    // Start every run from "no guide published, quiz off"
    await prisma.communitySettings.update({ where: { id: 'default' }, data: { guideVersion: 0 } });
    [admin, moderator] = await Promise.all([
      createTestUser('obadmin', { role: 'ADMIN' }),
      createTestUser('obmod', { role: 'MODERATOR' }),
    ]);
    // Through the API so the server's settings cache is refreshed too
    await admin.call('PATCH', '/admin/settings', { requireApproval: true, requireRules: true, requireQuiz: false });
  });

  after(async () => {
    await prisma.$transaction([
      prisma.guideSection.deleteMany(),
      prisma.guideSection.createMany({ data: savedSections }),
      prisma.quizQuestion.deleteMany(),
      prisma.quizQuestion.createMany({ data: savedQuestions }),
    ]);
    const { id, updatedAt, ...settings } = savedSettings;
    // Through the API so the server's settings cache is refreshed
    await admin.call('PATCH', '/admin/settings', {
      requireApproval: settings.requireApproval,
      requireRules: settings.requireRules,
      requireQuiz: settings.requireQuiz,
      quizPassPercent: settings.quizPassPercent,
      probationPostCount: settings.probationPostCount,
    });
    await prisma.communitySettings.update({ where: { id }, data: { guideVersion: settings.guideVersion } });
    await admin.call('PATCH', '/admin/settings', { requireRules: settings.requireRules });
    await cleanupTestData();
  });

  describe('applying and approval', () => {
    let applicant: TestUser;

    before(async () => {
      applicant = await createTestUser('applicant', { joined: false });
    });

    it('new members must apply before using the community', async () => {
      assert.equal(await step(applicant), 'APPLICATION');
      const feed = await applicant.call('GET', '/feed/posts');
      assert.equal(feed.status, 403);
      assert.equal(feed.data.code, 'NOT_JOINED');
      assert.equal((await applicant.call('GET', '/onboarding/guide')).status, 200);
    });

    it('requires a phone number and at least one platform', async () => {
      assert.equal((await applicant.call('POST', '/onboarding/application', application({ phone: '' }))).status, 400);
      assert.equal((await applicant.call('POST', '/onboarding/application', application({ platforms: [] }))).status, 400);
    });

    it('waits for approval after applying', async () => {
      const { status, data } = await applicant.call('POST', '/onboarding/application', application());
      assert.equal(status, 201);
      assert.equal(data.approved, false);
      assert.equal(await step(applicant), 'PENDING');
      assert.equal((await applicant.call('GET', '/feed/posts')).status, 403);
      assert.equal((await applicant.call('POST', '/onboarding/application', application())).status, 409);
    });

    it('shows up in the approval queue for staff only', async () => {
      const queue = await moderator.call('GET', '/admin/applications?pageSize=100');
      const entry = queue.data.applications.find((a: { userId: string }) => a.userId === applicant.profileId);
      assert.equal(entry?.phone, '+212 612 345 678');
      assert.deepEqual(entry.platforms, [{ platform: 'tiktok', handle: '@testcooks' }]);
      const member = await createTestUser('obmember');
      assert.equal((await member.call('GET', '/admin/applications')).status, 403);
    });

    it('lets staff approve, after which the member can post', async () => {
      const approved = await moderator.call('POST', `/admin/applications/${applicant.profileId}/approve`);
      assert.equal(approved.data.joinStatus, 'APPROVED');
      assert.equal((await moderator.call('POST', `/admin/applications/${applicant.profileId}/approve`)).status, 409);
      assert.equal(await step(applicant), 'DONE');
      assert.equal((await tryPost(applicant)).status, 201);
    });

    it('lets staff reject with a note the applicant can see', async () => {
      const rejected = await createTestUser('rejected', { joined: false });
      await rejected.call('POST', '/onboarding/application', application({ fullName: 'Rejected Applicant' }));
      await moderator.call('POST', `/admin/applications/${rejected.profileId}/reject`, { note: 'Not a content creator yet' });
      const me = (await rejected.call('GET', '/auth/me')).data.user;
      assert.equal(me.onboarding.step, 'REJECTED');
      assert.equal(me.onboarding.rejectionNote, 'Not a content creator yet');
      assert.equal((await rejected.call('GET', '/feed/posts')).status, 403);
    });
  });

  describe('community guide and quiz', () => {
    let member: TestUser;
    let version: number;

    before(async () => {
      member = await createTestUser('guidemember');
    });

    it('only admins edit the guide and settings', async () => {
      assert.equal((await moderator.call('PUT', '/admin/guide/sections', { sections: [] })).status, 403);
      assert.equal((await moderator.call('PATCH', '/admin/settings', { requireQuiz: true })).status, 403);
    });

    it('publishing a guide asks members to accept it before interacting', async () => {
      await admin.call('PUT', '/admin/guide/sections', {
        sections: [
          { title: `${TEST_MARK} Be kind`, body: 'No harassment.' },
          { title: `${TEST_MARK} No spam`, body: 'No unsolicited promotion.' },
        ],
      });
      version = (await admin.call('POST', '/admin/guide/publish')).data.version;
      assert.equal(await step(member), 'RULES');
      const blocked = await tryPost(member);
      assert.equal(blocked.status, 403);
      assert.equal(blocked.data.code, 'ONBOARDING_REQUIRED');
      assert.equal((await member.call('GET', '/feed/posts?limit=1')).status, 200);
    });

    it('records acceptance of the current version', async () => {
      assert.equal((await member.call('POST', '/onboarding/guide/accept', { version: version - 1 || 99 })).status, 409);
      const accepted = await member.call('POST', '/onboarding/guide/accept', { version });
      assert.equal(accepted.data.acceptedVersion, version);
      assert.equal(await step(member), 'DONE');
      assert.equal((await tryPost(member)).status, 201);
      const detail = await admin.call('GET', `/admin/members/${member.profileId}`);
      assert.equal(detail.data.joining.rulesAcceptedVersion, version);
      assert.equal(detail.data.joining.rulesAcceptances[0].version, version);
    });

    it('requires passing the quiz when it is turned on, without leaking answers', async () => {
      await admin.call('PUT', '/admin/guide/quiz', {
        questions: [
          { question: `${TEST_MARK} Can you spam?`, options: ['Yes', 'No'], correctIndex: 1 },
          { question: `${TEST_MARK} Be kind?`, options: ['Always', 'Sometimes'], correctIndex: 0 },
        ],
      });
      await admin.call('PATCH', '/admin/settings', { requireQuiz: true, quizPassPercent: 100 });
      assert.equal(await step(member), 'QUIZ');
      const guide = await member.call('GET', '/onboarding/guide');
      assert.equal(guide.data.quiz.questions.length, 2);
      assert.ok(!('correctIndex' in guide.data.quiz.questions[0]));
      const failed = await member.call('POST', '/onboarding/quiz', { answers: [0, 0] });
      assert.equal(failed.data.passed, false);
      const passed = await member.call('POST', '/onboarding/quiz', { answers: [1, 0] });
      assert.equal(passed.data.passed, true);
      assert.equal(await step(member), 'DONE');
      await admin.call('PATCH', '/admin/settings', { requireQuiz: false });
    });
  });

  describe('invite and referral links', () => {
    it('invite links auto-approve, can make special members, and respect their limit', async () => {
      assert.equal(
        (await moderator.call('POST', '/admin/invites', { label: 'Test', specialMember: false })).status,
        403,
      );
      const invite = await admin.call('POST', '/admin/invites', { label: 'Guest experts', specialMember: true, maxUses: 1 });
      assert.equal(invite.status, 201);
      const preview = await callApi('GET', `/onboarding/codes/${invite.data.code}`);
      assert.deepEqual(preview.data, { valid: true, type: 'invite', label: 'Guest experts' });

      const guest = await createTestUser('guest', { joined: false });
      const joined = await guest.call('POST', '/onboarding/application', application({ code: invite.data.code }));
      assert.equal(joined.data.approved, true);
      const me = (await guest.call('GET', '/auth/me')).data.user;
      assert.equal(me.onboarding.specialMember, true);
      assert.equal(me.onboarding.step, 'DONE');

      const late = await createTestUser('late', { joined: false });
      assert.equal((await late.call('POST', '/onboarding/application', application({ code: invite.data.code }))).status, 400);
    });

    it('revoked invites stop working', async () => {
      const invite = await admin.call('POST', '/admin/invites', { label: 'Old campaign' });
      await admin.call('DELETE', `/admin/invites/${invite.data.id}`);
      assert.equal((await callApi('GET', `/onboarding/codes/${invite.data.code}`)).data.valid, false);
    });

    it('referral links auto-approve and record who referred the member', async () => {
      const referrer = await createTestUser('referrer');
      const { data: referral } = await referrer.call('GET', '/onboarding/referral');
      assert.match(referral.code, /^[a-z0-9]+-[a-z0-9]{4}$/);
      const preview = await callApi('GET', `/onboarding/codes/${referral.code}`);
      assert.equal(preview.data.type, 'referral');

      const friend = await createTestUser('friend', { joined: false });
      const joined = await friend.call('POST', '/onboarding/application', application({ code: referral.code }));
      assert.equal(joined.data.approved, true);
      const detail = await admin.call('GET', `/admin/members/${friend.profileId}`);
      assert.equal(detail.data.joining.referredBy.id, referrer.profileId);
      assert.equal((await referrer.call('GET', '/onboarding/referral')).data.referralCount, 1);
    });
  });

  describe('special members and staff', () => {
    it('marking someone special lets them in and skips the guide', async () => {
      const waiting = await createTestUser('special', { joined: false });
      await waiting.call('POST', '/onboarding/application', application());
      const special = await moderator.call('PATCH', `/admin/members/${waiting.profileId}/special`, { specialMember: true });
      assert.equal(special.data.specialMember, true);
      assert.equal(await step(waiting), 'DONE');
    });

    it('staff skip onboarding entirely', async () => {
      const newModerator = await createTestUser('newmod', { role: 'MODERATOR', joined: false });
      assert.equal(await step(newModerator), 'DONE');
    });
  });
});
