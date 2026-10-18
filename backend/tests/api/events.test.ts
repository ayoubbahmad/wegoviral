import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { cleanupTestData, createTestUser, prisma, TestUser } from './support';

const DAY_MS = 24 * 60 * 60 * 1000;
const CATEGORY = 'Test Workshops';

const inDays = (days: number, hours = 0) => new Date(Date.now() + days * DAY_MS + hours * 60 * 60 * 1000).toISOString();

const eventInput = (overrides: Record<string, unknown> = {}) => ({
  title: 'Hook writing workshop',
  description: 'Live session on hooks',
  startsAt: inDays(5),
  endsAt: inDays(5, 2),
  timezone: 'Africa/Casablanca',
  locationType: 'ONLINE',
  link: 'https://meet.example.com/hooks',
  category: CATEGORY,
  status: 'DRAFT',
  ...overrides,
});

describe('events', () => {
  let moderator: TestUser;
  let instructor: TestUser;
  let instructor2: TestUser;
  let member: TestUser;
  let member2: TestUser;
  let newMember: TestUser;
  const eventIds: string[] = [];

  const create = async (user: TestUser, overrides: Record<string, unknown> = {}) => {
    const response = await user.call('POST', '/events', eventInput(overrides));
    if (response.status === 201) eventIds.push(response.data.id);
    return response;
  };
  const listed = async (user: TestUser, id: string, scope = 'upcoming') =>
    (await user.call('GET', `/events?scope=${scope}&limit=200`)).data.find((e: { id: string }) => e.id === id);

  before(async () => {
    [moderator, instructor, instructor2, member, member2, newMember] = await Promise.all([
      createTestUser('evmod', { role: 'MODERATOR' }),
      createTestUser('evinstr', { role: 'INSTRUCTOR' }),
      createTestUser('evinstr2', { role: 'INSTRUCTOR' }),
      createTestUser('evmember'),
      createTestUser('evmember2'),
      createTestUser('evnew'),
    ]);
    await prisma.userProfile.update({ where: { id: newMember.profileId }, data: { createdAt: new Date(Date.now() - 10 * DAY_MS) } });
    await prisma.userProfile.update({ where: { id: member.profileId }, data: { createdAt: new Date(Date.now() - 40 * DAY_MS) } });
  });

  after(async () => {
    await prisma.accessRule.deleteMany({ where: { resourceType: 'event', resourceId: { in: eventIds } } });
    await cleanupTestData();
  });

  describe('creating and publishing', () => {
    let eventId: string;

    it('only instructors and staff create events, with valid times and time zone', async () => {
      assert.equal((await create(member)).status, 403);
      assert.equal((await create(instructor, { endsAt: inDays(4) })).status, 400);
      assert.equal((await create(instructor, { timezone: 'Mars/Olympus' })).status, 400);
      const created = await create(instructor);
      assert.equal(created.status, 201);
      assert.equal(created.data.status, 'DRAFT');
      assert.equal(created.data.canManage, true);
      eventId = created.data.id;
    });

    it('keeps drafts visible to the host and staff only', async () => {
      assert.equal(await listed(member, eventId), undefined);
      assert.equal((await member.call('GET', `/events/${eventId}`)).status, 404);
      assert.ok(await listed(moderator, eventId));
      await instructor.call('PATCH', `/events/${eventId}`, { status: 'PUBLISHED' });
      assert.ok(await listed(member, eventId));
    });

    it('lets only the host and staff edit', async () => {
      assert.equal((await instructor2.call('PATCH', `/events/${eventId}`, { title: 'Hijacked' })).status, 403);
      assert.equal((await member.call('PATCH', `/events/${eventId}`, { title: 'Hijacked' })).status, 403);
      const byStaff = await moderator.call('PATCH', `/events/${eventId}`, { title: 'Hook writing workshop (updated)' });
      assert.equal(byStaff.data.title, 'Hook writing workshop (updated)');
      assert.equal((await instructor.call('PATCH', `/events/${eventId}`, { endsAt: inDays(1) })).status, 400);
    });

    it('lists categories of published events', async () => {
      const { data } = await member.call('GET', '/events/categories');
      assert.ok(data.includes(CATEGORY));
    });
  });

  describe('RSVP', () => {
    let eventId: string;

    before(async () => {
      eventId = (await create(instructor, { status: 'PUBLISHED', capacity: 1 })).data.id;
    });

    it('shows the live link only to people going', async () => {
      const before = await member.call('GET', `/events/${eventId}`);
      assert.equal(before.data.link, null);
      assert.equal(before.data.hasLink, true);
      const going = await member.call('PUT', `/events/${eventId}/rsvp`);
      assert.equal(going.data.goingByMe, true);
      assert.equal(going.data.goingCount, 1);
      assert.equal(going.data.link, 'https://meet.example.com/hooks');
      assert.equal((await member2.call('GET', `/events/${eventId}`)).data.link, null);
    });

    it('respects capacity and frees the spot when someone cancels', async () => {
      const full = await member2.call('PUT', `/events/${eventId}/rsvp`);
      assert.equal(full.status, 409);
      await member.call('DELETE', `/events/${eventId}/rsvp`);
      assert.equal((await member2.call('PUT', `/events/${eventId}/rsvp`)).status, 200);
    });

    it("doesn't take RSVPs for drafts or past events", async () => {
      const draft = await create(instructor);
      assert.equal((await moderator.call('PUT', `/events/${draft.data.id}/rsvp`)).status, 400);
      const past = await create(instructor, { status: 'PUBLISHED', startsAt: inDays(-3), endsAt: inDays(-3, 1) });
      assert.equal((await member.call('PUT', `/events/${past.data.id}/rsvp`)).status, 400);
      assert.ok(await listed(member, past.data.id, 'past'));
      assert.equal(await listed(member, past.data.id, 'upcoming'), undefined);
    });

    it('gives the host the attendee list, also as CSV', async () => {
      assert.equal((await member.call('GET', `/events/${eventId}/attendees`)).status, 403);
      const list = await instructor.call('GET', `/events/${eventId}/attendees`);
      assert.equal(list.data.attendees[0].id, member2.profileId);
      const csv = await instructor.call('GET', `/events/${eventId}/attendees?format=csv`);
      assert.match(csv.data, /^Name,Username,Email,RSVP date/);
      assert.match(csv.data, /@t_evmember2/);
    });
  });

  describe('access rules', () => {
    let eventId: string;

    before(async () => {
      eventId = (await create(instructor, { status: 'PUBLISHED' })).data.id;
    });

    it('hosts set role and time conditions, but not tiers', async () => {
      assert.equal((await instructor.call('PUT', `/events/${eventId}/access`, { tierIds: ['free'] })).status, 403);
      assert.equal((await member.call('PUT', `/events/${eventId}/access`, { minDays: 30 })).status, 403);
      assert.equal((await instructor.call('PUT', `/events/${eventId}/access`, { minDays: 30 })).status, 200);
    });

    it('locked events show only the basics and refuse RSVPs', async () => {
      const locked = await newMember.call('GET', `/events/${eventId}`);
      assert.equal(locked.data.access.locked, true);
      assert.equal(locked.data.description, undefined);
      const rsvp = await newMember.call('PUT', `/events/${eventId}/rsvp`);
      assert.equal(rsvp.status, 403);
      assert.match(rsvp.data.error, /Unlocks in/);
      assert.equal((await member.call('PUT', `/events/${eventId}/rsvp`)).status, 200);
    });
  });

  describe('calendar and deletion', () => {
    it('returns events overlapping a date range', async () => {
      const event = await create(instructor, { status: 'PUBLISHED', startsAt: inDays(20), endsAt: inDays(20, 1) });
      const inRange = await member.call('GET', `/events?scope=range&from=${inDays(19)}&to=${inDays(21)}`);
      assert.ok(inRange.data.some((e: { id: string }) => e.id === event.data.id));
      const outside = await member.call('GET', `/events?scope=range&from=${inDays(22)}&to=${inDays(30)}`);
      assert.ok(!outside.data.some((e: { id: string }) => e.id === event.data.id));
    });

    it('deleting removes the event for everyone and is logged', async () => {
      const event = await create(instructor, { status: 'PUBLISHED' });
      assert.equal((await instructor.call('DELETE', `/events/${event.data.id}`)).status, 204);
      assert.equal(await listed(moderator, event.data.id), undefined);
      const log = await moderator.call('GET', `/admin/activity?targetId=${event.data.id}`);
      assert.ok(log.data.entries.some((e: { action: string }) => e.action === 'event.deleted'));
    });
  });
});
