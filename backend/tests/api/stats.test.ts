import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { cleanupTestData, createTestUser, TestUser } from './support';

const TIMEZONE = 'Africa/Casablanca';
const today = new Intl.DateTimeFormat('en-CA', { timeZone: TIMEZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());

describe('stats dashboard', () => {
  let moderator: TestUser;
  let member: TestUser;

  before(async () => {
    [moderator, member] = await Promise.all([createTestUser('statsmod', { role: 'MODERATOR' }), createTestUser('statsmember')]);
    await member.call('POST', '/feed/posts', { spaceId: 'wins', content: 'Stats test post' });
  });

  after(cleanupTestData);

  it('is for staff who can see stats', async () => {
    assert.equal((await member.call('GET', '/admin/stats/members')).status, 403);
    assert.equal((await moderator.call('GET', `/admin/stats/members?timezone=${TIMEZONE}`)).status, 200);
    assert.equal((await moderator.call('GET', '/admin/stats/members?timezone=Mars/Olympus')).status, 400);
  });

  it('counts sign-ups and active members per day, with today included', async () => {
    const { data } = await moderator.call('GET', `/admin/stats/members?range=30d&timezone=${TIMEZONE}`);
    assert.equal(data.bucket, 'day');
    assert.ok(data.signups.length >= 30 && data.signups.length <= 32);
    assert.equal(data.signups.at(-1).bucket, today);
    assert.ok(data.signups.at(-1).value >= 2, 'the two test members signed up today');
    assert.ok(data.active.at(-1).value >= 1, 'the member who posted is active today');
    assert.ok(data.current.day >= 1 && data.current.week >= data.current.day && data.current.month >= data.current.week);
  });

  it('shows retention by sign-up month and the joining funnel', async () => {
    const { data } = await moderator.call('GET', `/admin/stats/members?timezone=${TIMEZONE}`);
    const thisMonth = data.retention.find((row: { cohort: string }) => row.cohort === today.slice(0, 7));
    assert.ok(thisMonth.size >= 2);
    assert.equal(thisMonth.months.length, 6);
    assert.ok(thisMonth.months[0].users >= 1);
    assert.equal(data.funnel[0].step, 'Signed up');
    assert.ok(data.funnel[0].count >= data.funnel[2].count);
  });

  it('groups weeks and months for longer ranges', async () => {
    const weeks = (await moderator.call('GET', `/admin/stats/members?range=90d&timezone=${TIMEZONE}`)).data;
    assert.equal(weeks.bucket, 'week');
    assert.ok(weeks.signups.every((row: { bucket: string }) => new Date(`${row.bucket}T00:00:00Z`).getUTCDay() === 1), 'weeks start on Monday');
    const months = (await moderator.call('GET', `/admin/stats/members?range=12m&timezone=${TIMEZONE}`)).data;
    assert.equal(months.bucket, 'month');
    assert.ok(months.signups.every((row: { bucket: string }) => row.bucket.endsWith('-01')));
    assert.ok(months.signups.length >= 12 && months.signups.length <= 13);
  });

  it('shows engagement per day, per space, top contributors and posting times', async () => {
    const { status, data } = await moderator.call('GET', `/admin/stats/engagement?range=30d&timezone=${TIMEZONE}`);
    assert.equal(status, 200);
    assert.ok(data.series.at(-1).posts >= 1);
    assert.ok(data.totals.posts >= 1);
    assert.ok(data.bySpace.some((space: { spaceId: string }) => space.spaceId === 'wins'));
    assert.ok(data.topContributors.some((row: { member: { id: string } }) => row.member.id === member.profileId));
    assert.equal(data.bestTimes.length, 7);
    assert.equal(data.bestTimes[0].hours.length, 24);
    const total = data.bestTimes.flatMap((day: { hours: { posts: number }[] }) => day.hours).reduce((sum: number, cell: { posts: number }) => sum + cell.posts, 0);
    assert.equal(total, data.totals.posts);
  });

  it('shows course, event and challenge performance', async () => {
    const { status, data } = await moderator.call('GET', `/admin/stats/content?range=90d&timezone=${TIMEZONE}`);
    assert.equal(status, 200);
    assert.ok(Array.isArray(data.courses) && Array.isArray(data.events) && Array.isArray(data.challenges));
    for (const course of data.courses) assert.ok(course.completionRate >= 0 && course.completionRate <= 1);
  });
});
