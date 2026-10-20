import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { cleanupTestData, createTestUser, prisma, TestUser } from './support';

const TEST_SLUG = 'test-help-article';

describe('help center', () => {
  let admin: TestUser;
  let moderator: TestUser;
  let instructor: TestUser;
  let member: TestUser;
  let pending: TestUser;

  const slugs = async (user: TestUser, space: string, q?: string) =>
    (await user.call('GET', `/help/articles?space=${space}${q ? `&q=${encodeURIComponent(q)}` : ''}`)).data.map((a: { slug: string }) => a.slug);

  const removeTestData = () => prisma.helpArticle.deleteMany({ where: { slug: { startsWith: 'test-' } } });

  before(async () => {
    await removeTestData();
    [admin, moderator, instructor, member, pending] = await Promise.all([
      createTestUser('helpadmin', { role: 'ADMIN' }),
      createTestUser('helpmod', { role: 'MODERATOR' }),
      createTestUser('helpinstr', { role: 'INSTRUCTOR' }),
      createTestUser('helpmember'),
      createTestUser('helppending', { joined: false }),
    ]);
  });

  after(async () => {
    await removeTestData();
    await cleanupTestData();
  });

  it('shows each space its own articles, filtered by role', async () => {
    const community = await slugs(member, 'community');
    assert.ok(community.includes('joining-wegoviral'));
    assert.ok(!community.includes('creating-a-course'), 'instructor guides are hidden from members');
    assert.ok(!community.includes('creator-space'), 'Creator Space articles stay in the Creator Space');
    assert.ok((await slugs(instructor, 'community')).includes('creating-a-course'));
    assert.ok((await slugs(member, 'creator')).includes('creator-space'));

    assert.deepEqual(await slugs(member, 'admin'), []);
    const asModerator = await slugs(moderator, 'admin');
    assert.ok(asModerator.includes('handling-reports'));
    assert.ok(!asModerator.includes('spaces'), 'admin guides are hidden from moderators');
    assert.ok(!asModerator.includes('tiers-and-access'));
    const asAdmin = await slugs(admin, 'admin');
    assert.ok(asAdmin.includes('spaces') && !asAdmin.includes('tiers-and-access'));
  });

  it("doesn't open articles meant for someone else", async () => {
    assert.equal((await member.call('GET', '/help/articles/handling-reports')).status, 404);
    const article = await moderator.call('GET', '/help/articles/handling-reports');
    assert.equal(article.status, 200);
    assert.match(article.data.body, /Dismiss/);
    assert.ok(Array.isArray(article.data.related));
  });

  it('searches the articles you can see', async () => {
    assert.ok((await slugs(member, 'community', 'streak')).includes('challenges'));
    assert.deepEqual(await slugs(member, 'admin', 'reports'), []);
  });

  it('is readable while waiting for approval', async () => {
    assert.ok((await slugs(pending, 'community')).includes('joining-wegoviral'));
  });

  it('lets admins write, publish and remove articles', async () => {
    const input = { slug: TEST_SLUG, space: 'COMMUNITY', category: 'Testing', title: 'A test article', summary: 'Testing', body: '## Hello\n- one' };
    assert.equal((await moderator.call('POST', '/help/manage', input)).status, 403);
    assert.equal((await admin.call('POST', '/help/manage', { ...input, slug: 'Not A Slug' })).status, 400);
    const created = await admin.call('POST', '/help/manage', input);
    assert.equal(created.status, 201);
    assert.equal(created.data.published, false);
    assert.equal((await admin.call('POST', '/help/manage', input)).status, 409);

    assert.ok(!(await slugs(member, 'community')).includes(TEST_SLUG), 'drafts stay hidden');
    assert.equal((await admin.call('GET', `/help/articles/${TEST_SLUG}`)).status, 200, 'admins preview drafts');
    await admin.call('PATCH', `/help/manage/${created.data.id}`, { published: true });
    assert.ok((await slugs(member, 'community')).includes(TEST_SLUG));

    const all = (await admin.call('GET', '/help/manage?space=community')).data;
    assert.ok(all.some((a: { slug: string; published: boolean }) => a.slug === TEST_SLUG && a.published));
    assert.equal((await admin.call('DELETE', `/help/manage/${created.data.id}`)).status, 204);
    assert.equal((await member.call('GET', `/help/articles/${TEST_SLUG}`)).status, 404);
  });
});
