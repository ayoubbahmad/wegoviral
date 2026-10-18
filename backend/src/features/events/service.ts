import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { logActivity } from '../../lib/activity';
import { can } from '../../lib/permissions';
import { AccessResult, AccessViewer, accessByResource, describeLock, evaluateRule, getRule } from '../../lib/access';
import { CreateEventInput, EventError, ListEventsQuery, UpdateEventInput } from './model';

const OPEN: AccessResult = { locked: false, reasons: [] };

const eventInclude = {
  host: { select: { id: true, username: true, name: true, avatarUrl: true, role: true } },
  _count: { select: { rsvps: true } },
} satisfies Prisma.CommunityEventInclude;

type EventRow = Prisma.CommunityEventGetPayload<{ include: typeof eventInclude }>;

/** Staff manage every event; instructors manage the ones they host. */
const canManage = (viewer: AccessViewer, event: { hostId: string }) =>
  can(viewer.role, 'events.manage') || (event.hostId === viewer.id && can(viewer.role, 'events.create'));

/** Shapes an event for one viewer: locked events only show the basics, the live link only to people going. */
function toEventDto(event: EventRow, viewer: AccessViewer, access: AccessResult, goingByMe: boolean) {
  const manage = canManage(viewer, event);
  const base = {
    id: event.id,
    title: event.title,
    coverUrl: event.coverUrl,
    startsAt: event.startsAt,
    endsAt: event.endsAt,
    timezone: event.timezone,
    locationType: event.locationType,
    category: event.category,
    capacity: event.capacity,
    status: event.status,
    host: event.host,
    goingCount: event._count.rsvps,
    isFull: event.capacity !== null && event._count.rsvps >= event.capacity,
    goingByMe,
    canManage: manage,
    access,
  };
  if (access.locked && !manage) return base;
  return {
    ...base,
    description: event.description,
    location: event.location,
    link: goingByMe || manage ? event.link : null,
    hasLink: Boolean(event.link),
    recordingUrl: event.recordingUrl,
  };
}

async function shapeEvents(events: EventRow[], viewer: AccessViewer) {
  const [access, going] = await Promise.all([
    accessByResource('event', viewer),
    prisma.eventRsvp.findMany({
      where: { userId: viewer.id, eventId: { in: events.map((event) => event.id) } },
      select: { eventId: true },
    }),
  ]);
  const goingIds = new Set(going.map((rsvp) => rsvp.eventId));
  return events.map((event) => toEventDto(event, viewer, access.get(event.id) ?? OPEN, goingIds.has(event.id)));
}

/** Drafts are visible to their host and to staff only. */
const visibilityFilter = (viewer: AccessViewer): Prisma.CommunityEventWhereInput =>
  can(viewer.role, 'events.manage')
    ? { deletedAt: null }
    : { deletedAt: null, OR: [{ status: { not: 'DRAFT' } }, { hostId: viewer.id }] };

export async function listEvents(viewer: AccessViewer, query: ListEventsQuery) {
  const now = new Date();
  const where: Prisma.CommunityEventWhereInput = {
    AND: [
      visibilityFilter(viewer),
      query.category ? { category: query.category } : {},
      query.scope === 'upcoming'
        ? { endsAt: { gte: now } }
        : query.scope === 'past'
          ? { endsAt: { lt: now } }
          : {
              // Anything overlapping the range, for the calendar
              ...(query.from ? { endsAt: { gte: query.from } } : {}),
              ...(query.to ? { startsAt: { lt: query.to } } : {}),
            },
    ],
  };
  const events = await prisma.communityEvent.findMany({
    where,
    orderBy: { startsAt: query.scope === 'past' ? 'desc' : 'asc' },
    take: query.limit,
    include: eventInclude,
  });
  return shapeEvents(events, viewer);
}

export async function listCategories() {
  const rows = await prisma.communityEvent.findMany({
    where: { deletedAt: null, status: { not: 'DRAFT' }, category: { not: null } },
    distinct: ['category'],
    select: { category: true },
    orderBy: { category: 'asc' },
  });
  return rows.map((row) => row.category as string);
}

async function getVisibleEvent(viewer: AccessViewer, id: string) {
  const event = await prisma.communityEvent.findFirst({
    where: { id, ...visibilityFilter(viewer) },
    include: eventInclude,
  });
  if (!event) throw new EventError(404, 'Event not found');
  return event;
}

export async function getEvent(viewer: AccessViewer, id: string) {
  const [shaped] = await shapeEvents([await getVisibleEvent(viewer, id)], viewer);
  return shaped;
}

function assertTimes(startsAt: Date, endsAt: Date) {
  if (endsAt <= startsAt) throw new EventError(400, 'The event must end after it starts');
}

export async function createEvent(viewer: AccessViewer, input: CreateEventInput) {
  if (!can(viewer.role, 'events.create')) throw new EventError(403, "You can't create events");
  const event = await prisma.communityEvent.create({ data: { ...input, hostId: viewer.id } });
  await logActivity({ actorId: viewer.id, action: 'event.created', targetType: 'event', targetId: event.id, targetLabel: event.title });
  return getEvent(viewer, event.id);
}

export async function updateEvent(viewer: AccessViewer, id: string, input: UpdateEventInput) {
  const event = await getVisibleEvent(viewer, id);
  if (!canManage(viewer, event)) throw new EventError(403, 'Only the host and the team can edit this event');
  assertTimes(input.startsAt ?? event.startsAt, input.endsAt ?? event.endsAt);
  await prisma.communityEvent.update({ where: { id }, data: input });
  const action = input.status === 'CANCELLED' && event.status !== 'CANCELLED'
    ? 'event.cancelled'
    : input.status === 'PUBLISHED' && event.status === 'DRAFT'
      ? 'event.published'
      : 'event.updated';
  await logActivity({
    actorId: viewer.id,
    action,
    targetType: 'event',
    targetId: id,
    targetLabel: input.title ?? event.title,
    details: { changed: Object.keys(input), hostId: event.hostId },
  });
  return getEvent(viewer, id);
}

export async function deleteEvent(viewer: AccessViewer, id: string) {
  const event = await getVisibleEvent(viewer, id);
  if (!canManage(viewer, event)) throw new EventError(403, 'Only the host and the team can delete this event');
  await prisma.communityEvent.update({ where: { id }, data: { deletedAt: new Date() } });
  await logActivity({ actorId: viewer.id, action: 'event.deleted', targetType: 'event', targetId: id, targetLabel: event.title });
}

export async function setGoing(viewer: AccessViewer, id: string, going: boolean) {
  const event = await getVisibleEvent(viewer, id);
  if (going) {
    if (event.status !== 'PUBLISHED') throw new EventError(400, event.status === 'CANCELLED' ? 'This event was cancelled' : "This event isn't published yet");
    if (event.endsAt.getTime() < Date.now()) throw new EventError(400, 'This event has already ended');
    const access = await evaluateRule(await getRule('event', id), viewer);
    if (access.locked) throw new EventError(403, describeLock(access));
    await prisma.$transaction(async (tx) => {
      if (await tx.eventRsvp.findUnique({ where: { eventId_userId: { eventId: id, userId: viewer.id } } })) return;
      if (event.capacity !== null) {
        const taken = await tx.eventRsvp.count({ where: { eventId: id } });
        if (taken >= event.capacity) throw new EventError(409, 'This event is full');
      }
      await tx.eventRsvp.create({ data: { eventId: id, userId: viewer.id } });
    });
  } else {
    await prisma.eventRsvp.deleteMany({ where: { eventId: id, userId: viewer.id } });
  }
  return getEvent(viewer, id);
}

export async function listAttendees(viewer: AccessViewer, id: string) {
  const event = await getVisibleEvent(viewer, id);
  if (!canManage(viewer, event)) throw new EventError(403, 'Only the host and the team can see the attendee list');
  const rsvps = await prisma.eventRsvp.findMany({
    where: { eventId: id },
    orderBy: { createdAt: 'asc' },
    select: {
      createdAt: true,
      user: { select: { id: true, username: true, name: true, email: true, avatarUrl: true } },
    },
  });
  return { event: { id: event.id, title: event.title }, attendees: rsvps.map(({ createdAt, user }) => ({ ...user, rsvpAt: createdAt })) };
}

export async function getEventAccess(viewer: AccessViewer, id: string) {
  const event = await getVisibleEvent(viewer, id);
  if (!canManage(viewer, event)) throw new EventError(403, 'Only the host and the team can change who can attend');
  return getRule('event', id);
}

export async function assertCanManage(viewer: AccessViewer, id: string) {
  const event = await getVisibleEvent(viewer, id);
  if (!canManage(viewer, event)) throw new EventError(403, 'Only the host and the team can change who can attend');
}
