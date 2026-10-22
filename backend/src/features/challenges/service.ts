/**
 * Challenges (docs/ADMIN_ROADMAP.md, Phase 8): members join, check in daily or
 * once, build streaks and climb the challenge leaderboard; the team picks
 * winners by hand or takes the top of the board. Days and streaks are counted
 * in the challenge's time zone.
 */
import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { logActivity } from '../../lib/activity';
import { can } from '../../lib/permissions';
import { AccessResult, AccessViewer, accessByResource, describeLock, getRule } from '../../lib/access';
import { awardPoints, badgesSelect, flattenBadges, revokePoints } from '../../lib/gamification';
import {
  ChallengeError,
  CheckInInput,
  CreateChallengeInput,
  UpdateChallengeInput,
  WinnersInput,
} from './model';

const OPEN: AccessResult = { locked: false, reasons: [] };
const DAY_MS = 24 * 60 * 60 * 1000;
const ONCE = 'once';

const personSelect = { id: true, username: true, name: true, avatarUrl: true, role: true } satisfies Prisma.UserProfileSelect;
const memberSelect = { ...personSelect, ...badgesSelect } satisfies Prisma.UserProfileSelect;

const flatten = flattenBadges;

const challengeInclude = {
  createdBy: { select: personSelect },
  completionBadge: { select: { id: true, name: true, emoji: true, color: true, translations: true } },
  winnerBadge: { select: { id: true, name: true, emoji: true, color: true, translations: true } },
  _count: { select: { participants: true } },
} satisfies Prisma.ChallengeInclude;

type ChallengeRow = Prisma.ChallengeGetPayload<{ include: typeof challengeInclude }>;
type Participant = Prisma.ChallengeParticipantGetPayload<object>;
type ChallengeTiming = Pick<ChallengeRow, 'startsAt' | 'endsAt' | 'timezone' | 'checkInType' | 'requiredCheckIns'>;

// ─── Days, streaks and completion ────────────────────────────────────────────

/** The calendar day (YYYY-MM-DD) of a moment in a time zone. */
export const dayKey = (date: Date, timezone: string) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);

const dayNumber = (key: string) => Date.UTC(Number(key.slice(0, 4)), Number(key.slice(5, 7)) - 1, Number(key.slice(8, 10))) / DAY_MS;

export const totalDays = (challenge: ChallengeTiming) =>
  challenge.checkInType === 'ONE_TIME'
    ? 1
    : dayNumber(dayKey(new Date(challenge.endsAt.getTime() - 1), challenge.timezone)) - dayNumber(dayKey(challenge.startsAt, challenge.timezone)) + 1;

/** Check-ins needed to finish: one for one-time challenges, otherwise the set number (or every day). */
export const requiredCheckIns = (challenge: ChallengeTiming) =>
  challenge.checkInType === 'ONE_TIME' ? 1 : Math.min(challenge.requiredCheckIns ?? totalDays(challenge), totalDays(challenge));

const phaseOf = (challenge: Pick<ChallengeRow, 'startsAt' | 'endsAt'>, now = Date.now()) =>
  challenge.startsAt.getTime() > now ? 'upcoming' : challenge.endsAt.getTime() <= now ? 'ended' : 'active';

/** Longest run of consecutive days, and the run ending on the last check-in. */
function streaks(days: string[]) {
  const sorted = [...new Set(days)].map(dayNumber).sort((a, b) => a - b);
  let best = 0;
  let run = 0;
  for (const [index, day] of sorted.entries()) {
    run = index > 0 && day === sorted[index - 1] + 1 ? run + 1 : 1;
    best = Math.max(best, run);
  }
  return { best, last: run };
}

/** A streak only counts while it's alive: checked in today or yesterday (or when the challenge ended). */
function liveStreak(participant: Participant, challenge: ChallengeTiming) {
  if (challenge.checkInType === 'ONE_TIME' || !participant.lastCheckInAt) return 0;
  const reference = Math.min(Date.now(), challenge.endsAt.getTime() - 1);
  const gap = dayNumber(dayKey(new Date(reference), challenge.timezone)) - dayNumber(dayKey(participant.lastCheckInAt, challenge.timezone));
  return gap <= 1 ? participant.currentStreak : 0;
}

/** Recounts a participant from their check-ins; gives or takes back the completion points. */
async function recompute(challenge: ChallengeTiming & { id: string }, userId: string) {
  const checkIns = await prisma.challengeCheckIn.findMany({
    where: { challengeId: challenge.id, userId, deletedAt: null },
    select: { day: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  });
  const participant = await prisma.challengeParticipant.findUnique({ where: { challengeId_userId: { challengeId: challenge.id, userId } } });
  if (!participant) return;
  const { best, last } = challenge.checkInType === 'DAILY' ? streaks(checkIns.map((c) => c.day)) : { best: 0, last: 0 };
  const done = checkIns.length >= requiredCheckIns(challenge);
  await prisma.challengeParticipant.update({
    where: { challengeId_userId: { challengeId: challenge.id, userId } },
    data: {
      checkInCount: checkIns.length,
      bestStreak: best,
      currentStreak: last,
      lastCheckInAt: checkIns.at(-1)?.createdAt ?? null,
      completedAt: done ? participant.completedAt ?? new Date() : null,
    },
  });
  if (done && !participant.completedAt) {
    await awardPoints({ userId, action: 'CHALLENGE_COMPLETED', sourceType: 'challenge', sourceId: challenge.id });
    const badgeId = (await prisma.challenge.findUnique({ where: { id: challenge.id }, select: { completionBadgeId: true } }))?.completionBadgeId;
    if (badgeId) await giveBadge(badgeId, userId, 'Finished a challenge');
  } else if (!done && participant.completedAt) {
    await revokePoints({ userId, action: 'CHALLENGE_COMPLETED', sourceId: challenge.id });
  }
}

async function giveBadge(badgeId: string, userId: string, note: string) {
  if (await prisma.badge.findFirst({ where: { id: badgeId, archivedAt: null } })) {
    await prisma.memberBadge.createMany({ data: [{ badgeId, userId, note }], skipDuplicates: true });
  }
}

// ─── Reading ─────────────────────────────────────────────────────────────────

const canManage = (viewer: AccessViewer) => can(viewer.role, 'challenges.manage');

/** Drafts are for the team only. */
const visibilityFilter = (viewer: AccessViewer): Prisma.ChallengeWhereInput =>
  canManage(viewer) ? { deletedAt: null } : { deletedAt: null, status: { not: 'DRAFT' } };

function myState(participant: Participant | undefined, challenge: ChallengeRow) {
  if (!participant) return null;
  const today = challenge.checkInType === 'ONE_TIME' ? ONCE : dayKey(new Date(), challenge.timezone);
  return {
    joinedAt: participant.joinedAt,
    checkInCount: participant.checkInCount,
    currentStreak: liveStreak(participant, challenge),
    bestStreak: participant.bestStreak,
    completedAt: participant.completedAt,
    winnerRank: participant.winnerRank,
    checkedInToday:
      challenge.checkInType === 'ONE_TIME'
        ? participant.checkInCount > 0
        : Boolean(participant.lastCheckInAt && dayKey(participant.lastCheckInAt, challenge.timezone) === today),
  };
}

function toSummary(challenge: ChallengeRow, viewer: AccessViewer, access: AccessResult, participant: Participant | undefined) {
  return {
    id: challenge.id,
    title: challenge.title,
    description: challenge.description,
    prizes: challenge.prizes,
    coverUrl: challenge.coverUrl,
    startsAt: challenge.startsAt,
    endsAt: challenge.endsAt,
    timezone: challenge.timezone,
    checkInType: challenge.checkInType,
    requiredCheckIns: requiredCheckIns(challenge),
    totalDays: totalDays(challenge),
    status: challenge.status,
    phase: phaseOf(challenge),
    participantCount: challenge._count.participants,
    createdBy: challenge.createdBy,
    completionBadge: challenge.completionBadge,
    winnerBadge: challenge.winnerBadge,
    winnersPickedAt: challenge.winnersPickedAt,
    canManage: canManage(viewer),
    access,
    me: myState(participant, challenge),
  };
}

async function shape(challenges: ChallengeRow[], viewer: AccessViewer) {
  const [access, participants] = await Promise.all([
    accessByResource('challenge', viewer),
    prisma.challengeParticipant.findMany({ where: { userId: viewer.id, challengeId: { in: challenges.map((c) => c.id) } } }),
  ]);
  const mine = new Map(participants.map((p) => [p.challengeId, p]));
  return challenges.map((challenge) =>
    toSummary(challenge, viewer, canManage(viewer) ? OPEN : access.get(challenge.id) ?? OPEN, mine.get(challenge.id)),
  );
}

export async function listChallenges(viewer: AccessViewer, scope: 'active' | 'upcoming' | 'past') {
  const now = new Date();
  const timing: Prisma.ChallengeWhereInput =
    scope === 'upcoming' ? { startsAt: { gt: now } } : scope === 'past' ? { endsAt: { lte: now } } : { startsAt: { lte: now }, endsAt: { gt: now } };
  const challenges = await prisma.challenge.findMany({
    where: { ...visibilityFilter(viewer), ...timing },
    orderBy: scope === 'past' ? { endsAt: 'desc' } : scope === 'upcoming' ? { startsAt: 'asc' } : { endsAt: 'asc' },
    take: 100,
    include: challengeInclude,
  });
  return shape(challenges, viewer);
}

async function getVisible(viewer: AccessViewer, id: string) {
  const challenge = await prisma.challenge.findFirst({ where: { id, ...visibilityFilter(viewer) }, include: challengeInclude });
  if (!challenge) throw new ChallengeError(404, 'Challenge not found');
  return challenge;
}

export async function getChallenge(viewer: AccessViewer, id: string) {
  const challenge = await getVisible(viewer, id);
  const [summary] = await shape([challenge], viewer);
  const locked = summary.access.locked;
  const [myDays, winners] = await Promise.all([
    summary.me
      ? prisma.challengeCheckIn.findMany({ where: { challengeId: id, userId: viewer.id, deletedAt: null }, select: { day: true }, orderBy: { day: 'asc' } })
      : [],
    prisma.challengeParticipant.findMany({
      where: { challengeId: id, winnerRank: { not: null } },
      orderBy: { winnerRank: 'asc' },
      include: { user: { select: memberSelect } },
    }),
  ]);
  return {
    ...summary,
    rules: locked ? '' : challenge.rules,
    startDay: dayKey(challenge.startsAt, challenge.timezone),
    today: dayKey(new Date(), challenge.timezone),
    myDays: myDays.map((row) => row.day),
    winners: winners.map((w) => ({ rank: w.winnerRank!, member: flatten(w.user), checkInCount: w.checkInCount })),
  };
}

// ─── Managing ────────────────────────────────────────────────────────────────

function assertManager(viewer: AccessViewer) {
  if (!canManage(viewer)) throw new ChallengeError(403, 'Only the team can manage challenges');
}

async function assertBadges(...ids: (string | null | undefined)[]) {
  for (const id of ids) {
    if (id && !(await prisma.badge.findFirst({ where: { id, archivedAt: null } }))) throw new ChallengeError(400, 'Unknown badge');
  }
}

export async function createChallenge(viewer: AccessViewer, input: CreateChallengeInput) {
  assertManager(viewer);
  await assertBadges(input.completionBadgeId, input.winnerBadgeId);
  const challenge = await prisma.challenge.create({ data: { ...input, createdById: viewer.id } });
  await logActivity({ actorId: viewer.id, action: 'challenge.created', targetType: 'challenge', targetId: challenge.id, targetLabel: challenge.title });
  return getChallenge(viewer, challenge.id);
}

export async function updateChallenge(viewer: AccessViewer, id: string, input: UpdateChallengeInput) {
  assertManager(viewer);
  const challenge = await getVisible(viewer, id);
  const startsAt = input.startsAt ?? challenge.startsAt;
  const endsAt = input.endsAt ?? challenge.endsAt;
  if (endsAt <= startsAt) throw new ChallengeError(400, 'The challenge must end after it starts');
  await assertBadges(input.completionBadgeId, input.winnerBadgeId);
  const updated = await prisma.challenge.update({ where: { id }, data: input });

  // New dates or a new target can change who has finished
  if (input.requiredCheckIns !== undefined || input.startsAt || input.endsAt || input.checkInType || input.timezone) {
    const participants = await prisma.challengeParticipant.findMany({ where: { challengeId: id }, select: { userId: true } });
    for (const participant of participants) await recompute(updated, participant.userId);
  }
  const action =
    input.status === 'PUBLISHED' && challenge.status === 'DRAFT'
      ? 'challenge.published'
      : input.status === 'CANCELLED' && challenge.status !== 'CANCELLED'
        ? 'challenge.cancelled'
        : 'challenge.updated';
  await logActivity({ actorId: viewer.id, action, targetType: 'challenge', targetId: id, targetLabel: updated.title, details: { changed: Object.keys(input) } });
  return getChallenge(viewer, id);
}

export async function deleteChallenge(viewer: AccessViewer, id: string) {
  assertManager(viewer);
  const challenge = await getVisible(viewer, id);
  await prisma.challenge.update({ where: { id }, data: { deletedAt: new Date() } });
  await logActivity({ actorId: viewer.id, action: 'challenge.deleted', targetType: 'challenge', targetId: id, targetLabel: challenge.title });
}

// ─── Taking part ─────────────────────────────────────────────────────────────

async function assertCanTakePart(viewer: AccessViewer, challenge: ChallengeRow) {
  if (challenge.status !== 'PUBLISHED') {
    throw new ChallengeError(400, challenge.status === 'CANCELLED' ? 'This challenge was cancelled' : "This challenge isn't published yet");
  }
  if (phaseOf(challenge) === 'ended') throw new ChallengeError(400, 'This challenge has ended');
  if (!canManage(viewer)) {
    const access = (await accessByResource('challenge', viewer)).get(challenge.id);
    if (access?.locked) throw new ChallengeError(403, describeLock(access));
  }
}

const joinRow = (challengeId: string, userId: string) =>
  prisma.challengeParticipant.upsert({
    where: { challengeId_userId: { challengeId, userId } },
    create: { challengeId, userId },
    update: {},
  });

export async function join(viewer: AccessViewer, id: string) {
  const challenge = await getVisible(viewer, id);
  await assertCanTakePart(viewer, challenge);
  await joinRow(id, viewer.id);
  return getChallenge(viewer, id);
}

/** Leaving is only possible before the first check-in (check-ins and their points stay otherwise). */
export async function leave(viewer: AccessViewer, id: string) {
  await getVisible(viewer, id);
  const participant = await prisma.challengeParticipant.findUnique({ where: { challengeId_userId: { challengeId: id, userId: viewer.id } } });
  if (participant && participant.checkInCount > 0) throw new ChallengeError(400, "You've already checked in, so you're part of this one");
  await prisma.challengeParticipant.deleteMany({ where: { challengeId: id, userId: viewer.id } });
  return getChallenge(viewer, id);
}

export async function checkIn(viewer: AccessViewer, id: string, input: CheckInInput) {
  const challenge = await getVisible(viewer, id);
  await assertCanTakePart(viewer, challenge);
  if (phaseOf(challenge) === 'upcoming') throw new ChallengeError(400, `Check-ins open on ${challenge.startsAt.toLocaleDateString('en-GB')}`);
  await joinRow(id, viewer.id);
  const day = challenge.checkInType === 'ONE_TIME' ? ONCE : dayKey(new Date(), challenge.timezone);
  let checkInId: string;
  try {
    checkInId = (await prisma.challengeCheckIn.create({ data: { challengeId: id, userId: viewer.id, day, ...input } })).id;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new ChallengeError(409, challenge.checkInType === 'ONE_TIME' ? "You've already submitted" : "You've already checked in today. Come back tomorrow!");
    }
    throw error;
  }
  await awardPoints({ userId: viewer.id, action: 'CHALLENGE_CHECKIN', sourceType: 'challenge_check_in', sourceId: checkInId });
  await recompute(challenge, viewer.id);
  return getChallenge(viewer, id);
}

export async function listCheckIns(viewer: AccessViewer, id: string, cursor?: string) {
  const challenge = await getVisible(viewer, id);
  if (!canManage(viewer) && (await accessByResource('challenge', viewer)).get(id)?.locked) {
    throw new ChallengeError(403, 'This challenge is locked');
  }
  const rows = await prisma.challengeCheckIn.findMany({
    where: { challengeId: id, deletedAt: null },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    take: 31,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    include: { user: { select: memberSelect } },
  });
  const page = rows.slice(0, 30);
  return {
    checkIns: page.map((row) => ({
      id: row.id,
      day: row.day,
      content: row.content,
      imageUrl: row.imageUrl,
      link: row.link,
      createdAt: row.createdAt,
      author: flatten(row.user),
      canDelete: row.userId === viewer.id || canManage(viewer) || can(viewer.role, 'community.moderate'),
    })),
    nextCursor: rows.length > 30 ? page.at(-1)!.id : null,
    checkInType: challenge.checkInType,
  };
}

/** Members remove their own check-ins; the team removes any (kept, hidden, and logged). */
export async function deleteCheckIn(viewer: AccessViewer, id: string, checkInId: string) {
  const challenge = await getVisible(viewer, id);
  const checkIn = await prisma.challengeCheckIn.findFirst({ where: { id: checkInId, challengeId: id, deletedAt: null } });
  if (!checkIn) throw new ChallengeError(404, 'Check-in not found');
  const isOwn = checkIn.userId === viewer.id;
  if (!isOwn && !canManage(viewer) && !can(viewer.role, 'community.moderate')) throw new ChallengeError(403, "You can't remove this check-in");
  if (isOwn) {
    await prisma.challengeCheckIn.delete({ where: { id: checkInId } });
  } else {
    await prisma.challengeCheckIn.update({ where: { id: checkInId }, data: { deletedAt: new Date(), deletedById: viewer.id } });
    await logActivity({
      actorId: viewer.id,
      action: 'challenge.check_in_removed',
      targetType: 'challenge',
      targetId: id,
      targetLabel: challenge.title,
      details: { authorId: checkIn.userId, content: checkIn.content.slice(0, 120) },
    });
  }
  await revokePoints({ userId: checkIn.userId, action: 'CHALLENGE_CHECKIN', sourceId: checkInId });
  await recompute(challenge, checkIn.userId);
}

// ─── Leaderboard and winners ─────────────────────────────────────────────────

/** Ranked by check-ins, then best streak, then who joined first. */
async function ranked(challengeId: string) {
  return prisma.challengeParticipant.findMany({
    where: { challengeId, user: { status: { not: 'BANNED' } } },
    orderBy: [{ checkInCount: 'desc' }, { bestStreak: 'desc' }, { joinedAt: 'asc' }],
    include: { user: { select: memberSelect } },
  });
}

export async function getLeaderboard(viewer: AccessViewer, id: string) {
  const challenge = await getVisible(viewer, id);
  const rows = await ranked(id);
  let rank = 0;
  let previous = '';
  const entries = rows.map((row, index) => {
    const key = `${row.checkInCount}:${row.bestStreak}`;
    if (key !== previous) rank = index + 1;
    previous = key;
    return {
      rank,
      member: flatten(row.user),
      checkInCount: row.checkInCount,
      currentStreak: liveStreak(row, challenge),
      bestStreak: row.bestStreak,
      completed: Boolean(row.completedAt),
      winnerRank: row.winnerRank,
    };
  });
  return { entries: entries.slice(0, 100), me: entries.find((entry) => entry.member.id === viewer.id) ?? null, required: requiredCheckIns(challenge) };
}

/** Picks winners once the challenge has ended: by hand, or the top of the board. Picking again replaces them. */
export async function setWinners(viewer: AccessViewer, id: string, input: WinnersInput) {
  assertManager(viewer);
  const challenge = await getVisible(viewer, id);
  if (input.mode !== 'clear' && phaseOf(challenge) !== 'ended') throw new ChallengeError(400, 'Pick winners once the challenge has ended');

  let winners: string[] = [];
  if (input.mode === 'manual') {
    winners = [...new Set(input.userIds)];
    const found = await prisma.challengeParticipant.count({ where: { challengeId: id, userId: { in: winners } } });
    if (found !== winners.length) throw new ChallengeError(400, 'Winners must have taken part');
  } else if (input.mode === 'top') {
    winners = (await ranked(id)).filter((row) => row.checkInCount > 0).slice(0, input.count).map((row) => row.userId);
    if (!winners.length) throw new ChallengeError(400, 'Nobody has checked in yet');
  }

  // Replace any previous winners
  await prisma.challengeParticipant.updateMany({ where: { challengeId: id }, data: { winnerRank: null } });
  await revokePoints({ action: 'CHALLENGE_WON', sourceId: id });
  for (const [index, userId] of winners.entries()) {
    await prisma.challengeParticipant.update({ where: { challengeId_userId: { challengeId: id, userId } }, data: { winnerRank: index + 1 } });
    await awardPoints({ userId, action: 'CHALLENGE_WON', sourceType: 'challenge', sourceId: id });
    if (challenge.winnerBadgeId) await giveBadge(challenge.winnerBadgeId, userId, `Won ${challenge.title}`);
  }
  await prisma.challenge.update({ where: { id }, data: { winnersPickedAt: winners.length ? new Date() : null } });
  await logActivity({
    actorId: viewer.id,
    action: winners.length ? 'challenge.winners_picked' : 'challenge.winners_cleared',
    targetType: 'challenge',
    targetId: id,
    targetLabel: challenge.title,
    details: { mode: input.mode, winners: winners.length },
  });
  return getChallenge(viewer, id);
}

// ─── Access ──────────────────────────────────────────────────────────────────

export async function getChallengeAccess(viewer: AccessViewer, id: string) {
  assertManager(viewer);
  await getVisible(viewer, id);
  return getRule('challenge', id);
}

export async function assertCanManage(viewer: AccessViewer, id: string) {
  assertManager(viewer);
  await getVisible(viewer, id);
}
