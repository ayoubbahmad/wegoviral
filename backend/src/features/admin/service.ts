import { MemberStatus, Prisma, UserRole } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { probationSummary } from '../../lib/review';
import { logActivity } from '../../lib/activity';
import {
  assignableRoles,
  can,
  canManageMember,
  effectiveStatus,
  MODERATOR_MAX_RESTRICTION_DAYS,
} from '../../lib/permissions';
import {
  AdminError,
  ListActivityQuery,
  ListMembersQuery,
  RestrictMemberInput,
} from './model';

export interface Actor {
  id: string;
  role: UserRole;
}

const DAY_MS = 24 * 60 * 60 * 1000;
const daysAgo = (days: number) => new Date(Date.now() - days * DAY_MS);

const memberSelect = {
  id: true,
  username: true,
  name: true,
  email: true,
  avatarUrl: true,
  role: true,
  status: true,
  statusReason: true,
  statusUntil: true,
  createdAt: true,
  joinStatus: true,
  specialMember: true,
  _count: { select: { communityPosts: { where: { deletedAt: null } }, communityComments: { where: { deletedAt: null } } } },
} satisfies Prisma.UserProfileSelect;

type MemberRow = Prisma.UserProfileGetPayload<{ select: typeof memberSelect }>;

/** Shapes a member for the admin UI, with the restriction as it applies right now. */
const toMemberDto = (member: MemberRow) => {
  const status = effectiveStatus(member.status, member.statusUntil);
  return {
    id: member.id,
    username: member.username,
    name: member.name,
    email: member.email,
    avatarUrl: member.avatarUrl,
    role: member.role,
    status,
    statusReason: status === 'ACTIVE' ? null : member.statusReason,
    statusUntil: status === 'ACTIVE' ? null : member.statusUntil,
    createdAt: member.createdAt,
    joinStatus: member.joinStatus,
    specialMember: member.specialMember,
    postCount: member._count.communityPosts,
    commentCount: member._count.communityComments,
  };
};

/** Prisma filter for members whose *effective* status matches (expired restrictions count as ACTIVE). */
function statusFilter(status: MemberStatus): Prisma.UserProfileWhereInput {
  const now = new Date();
  if (status === 'ACTIVE') {
    return { OR: [{ status: 'ACTIVE' }, { statusUntil: { lte: now } }] };
  }
  return { status, OR: [{ statusUntil: null }, { statusUntil: { gt: now } }] };
}

async function getMemberOrThrow(id: string) {
  const member = await prisma.userProfile.findUnique({ where: { id }, select: memberSelect });
  if (!member) throw new AdminError(404, 'Member not found');
  return member;
}

const memberLabel = (member: { username: string; name: string | null }) =>
  member.name ? `${member.name} (@${member.username})` : `@${member.username}`;

// ─── Overview ────────────────────────────────────────────────────────────────

export async function getOverview() {
  const weekAgo = daysAgo(7);
  const [
    totalMembers,
    newMembers,
    postsThisWeek,
    commentsThisWeek,
    roleCounts,
    activePosters,
    activeCommenters,
    activeLikers,
    restricted,
    recentMembers,
    pendingApprovals,
    pendingReviews,
    openReports,
    heldContent,
  ] = await Promise.all([
    prisma.userProfile.count(),
    prisma.userProfile.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.communityPost.count({ where: { deletedAt: null, createdAt: { gte: weekAgo } } }),
    prisma.communityComment.count({ where: { deletedAt: null, createdAt: { gte: weekAgo } } }),
    prisma.userProfile.groupBy({ by: ['role'], _count: { _all: true } }),
    prisma.communityPost.findMany({ where: { createdAt: { gte: weekAgo } }, select: { authorId: true }, distinct: ['authorId'] }),
    prisma.communityComment.findMany({ where: { createdAt: { gte: weekAgo } }, select: { authorId: true }, distinct: ['authorId'] }),
    prisma.communityPostLike.findMany({ where: { createdAt: { gte: weekAgo } }, select: { userId: true }, distinct: ['userId'] }),
    prisma.userProfile.findMany({
      where: { status: { not: 'ACTIVE' }, OR: [{ statusUntil: null }, { statusUntil: { gt: new Date() } }] },
      select: { status: true },
    }),
    prisma.userProfile.findMany({ orderBy: { createdAt: 'desc' }, take: 5, select: memberSelect }),
    prisma.userProfile.count({ where: { joinStatus: 'PENDING', application: { isNot: null } } }),
    prisma.communityPost.count({ where: { deletedAt: null, reviewStatus: 'PENDING' } }),
    prisma.contentReport.count({ where: { status: 'OPEN' } }),
    Promise.all([
      prisma.communityPost.count({ where: { deletedAt: null, reviewStatus: 'PENDING', heldReason: { not: null } } }),
      prisma.communityComment.count({ where: { deletedAt: null, heldReason: { not: null } } }),
    ]).then(([posts, comments]) => posts + comments),
  ]);

  // Active = posted, commented or liked in the last 7 days
  const activeIds = new Set([
    ...activePosters.map((row) => row.authorId),
    ...activeCommenters.map((row) => row.authorId),
    ...activeLikers.map((row) => row.userId),
  ]);

  return {
    members: {
      total: totalMembers,
      newThisWeek: newMembers,
      activeThisWeek: activeIds.size,
      byRole: Object.fromEntries(roleCounts.map((row) => [row.role, row._count._all])),
      restricted: {
        MUTED: restricted.filter((row) => row.status === 'MUTED').length,
        SUSPENDED: restricted.filter((row) => row.status === 'SUSPENDED').length,
        BANNED: restricted.filter((row) => row.status === 'BANNED').length,
      },
    },
    content: { postsThisWeek, commentsThisWeek },
    pendingApprovals,
    pendingReviews,
    openReports,
    heldContent,
    recentMembers: recentMembers.map(toMemberDto),
  };
}

// ─── Members ─────────────────────────────────────────────────────────────────

export async function listMembers(query: ListMembersQuery) {
  const where: Prisma.UserProfileWhereInput = {
    AND: [
      query.search
        ? {
            OR: [
              { username: { contains: query.search, mode: 'insensitive' } },
              { name: { contains: query.search, mode: 'insensitive' } },
              { email: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : {},
      query.role ? { role: query.role } : {},
      query.status ? statusFilter(query.status) : {},
    ],
  };
  const orderBy: Prisma.UserProfileOrderByWithRelationInput[] =
    query.sort === 'oldest'
      ? [{ createdAt: 'asc' }]
      : query.sort === 'name'
        ? [{ username: 'asc' }]
        : [{ createdAt: 'desc' }];

  const [members, total] = await Promise.all([
    prisma.userProfile.findMany({
      where,
      orderBy: [...orderBy, { id: 'asc' }],
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      select: memberSelect,
    }),
    prisma.userProfile.count({ where }),
  ]);

  return { members: members.map(toMemberDto), total, page: query.page, pageSize: query.pageSize };
}

export async function getMember(actor: Actor, id: string) {
  const member = await getMemberOrThrow(id);
  const [likesGiven, likesReceived, history, joining, probation] = await Promise.all([
    prisma.communityPostLike.count({ where: { userId: id } }),
    prisma.communityPostLike.count({ where: { post: { authorId: id } } }),
    prisma.adminActivity.findMany({
      where: { targetType: 'member', targetId: id },
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: { actor: { select: { id: true, username: true, avatarUrl: true } } },
    }),
    prisma.userProfile.findUniqueOrThrow({
      where: { id },
      select: {
        phone: true,
        rulesAcceptedVersion: true,
        rulesAcceptedAt: true,
        quizPassedVersion: true,
        referredBy: { select: { id: true, username: true, name: true } },
        _count: { select: { referrals: true } },
        application: { include: { invite: { select: { label: true } }, reviewedBy: { select: { username: true } } } },
        rulesAcceptances: { orderBy: { acceptedAt: 'desc' }, take: 10, select: { version: true, acceptedAt: true } },
      },
    }),
    probationSummary(id),
  ]);

  const isSelf = actor.id === id;
  const manageable = !isSelf && canManageMember(actor.role, member.role);
  return {
    ...toMemberDto(member),
    likesGiven,
    likesReceived,
    history,
    joining: {
      phone: joining.phone,
      application: joining.application,
      referredBy: joining.referredBy,
      referralCount: joining._count.referrals,
      rulesAcceptedVersion: joining.rulesAcceptedVersion,
      rulesAcceptedAt: joining.rulesAcceptedAt,
      quizPassedVersion: joining.quizPassedVersion,
      rulesAcceptances: joining.rulesAcceptances,
      probation,
    },
    // What the current staff member may do here, so the UI only offers allowed actions
    allowedActions: {
      changeRole: manageable && can(actor.role, 'roles.manage'),
      assignableRoles: manageable ? assignableRoles(actor.role) : [],
      restrict: manageable && can(actor.role, 'members.restrict'),
      ban: manageable && can(actor.role, 'members.ban'),
      indefinite: manageable && can(actor.role, 'members.ban'),
      maxRestrictionDays: can(actor.role, 'members.ban') ? null : MODERATOR_MAX_RESTRICTION_DAYS,
      setSpecial: !isSelf && can(actor.role, 'members.exempt'),
      reviewApplication: member.joinStatus === 'PENDING' && can(actor.role, 'members.approve'),
    },
  };
}

function assertCanManage(actor: Actor, target: { id: string; role: UserRole }) {
  if (actor.id === target.id) throw new AdminError(403, "You can't change your own account");
  if (!canManageMember(actor.role, target.role)) {
    throw new AdminError(403, "You can't manage someone with the same or a higher role");
  }
}

export async function changeRole(actor: Actor, id: string, role: UserRole) {
  if (!can(actor.role, 'roles.manage')) throw new AdminError(403, "You can't change roles");
  const member = await getMemberOrThrow(id);
  assertCanManage(actor, member);
  if (!assignableRoles(actor.role).includes(role)) {
    throw new AdminError(403, "You can't give that role");
  }
  if (member.role === role) return toMemberDto(member);

  if (member.role === 'SUPER_ADMIN' && role !== 'SUPER_ADMIN') {
    const superAdmins = await prisma.userProfile.count({ where: { role: 'SUPER_ADMIN' } });
    if (superAdmins <= 1) throw new AdminError(409, "The last Super Admin can't be demoted");
  }

  const updated = await prisma.userProfile.update({ where: { id }, data: { role }, select: memberSelect });
  await logActivity({
    actorId: actor.id,
    action: 'member.role_changed',
    targetType: 'member',
    targetId: id,
    targetLabel: memberLabel(member),
    details: { from: member.role, to: role },
  });
  return toMemberDto(updated);
}

export async function restrictMember(actor: Actor, id: string, input: RestrictMemberInput) {
  if (!can(actor.role, 'members.restrict')) throw new AdminError(403, "You can't restrict members");
  const member = await getMemberOrThrow(id);
  assertCanManage(actor, member);

  const canBan = can(actor.role, 'members.ban');
  if (input.status === 'BANNED' && !canBan) throw new AdminError(403, 'Only admins can ban members');
  if (!canBan) {
    if (input.durationDays === null) {
      throw new AdminError(403, 'Moderators can only restrict members for a limited time');
    }
    if (input.durationDays > MODERATOR_MAX_RESTRICTION_DAYS) {
      throw new AdminError(403, `Moderators can restrict members for up to ${MODERATOR_MAX_RESTRICTION_DAYS} days`);
    }
  }

  const statusUntil = input.durationDays ? new Date(Date.now() + input.durationDays * DAY_MS) : null;
  const updated = await prisma.userProfile.update({
    where: { id },
    data: { status: input.status, statusReason: input.reason, statusUntil },
    select: memberSelect,
  });
  await logActivity({
    actorId: actor.id,
    action: `member.${input.status.toLowerCase()}`,
    targetType: 'member',
    targetId: id,
    targetLabel: memberLabel(member),
    details: { reason: input.reason, until: statusUntil?.toISOString() ?? null },
  });
  // Responsibility trail: the member who referred them vouched for them
  const { referredById } = await prisma.userProfile.findUniqueOrThrow({ where: { id }, select: { referredById: true } });
  if (referredById && referredById !== actor.id) {
    await logActivity({
      actorId: actor.id,
      action: 'member.referral_restricted',
      targetType: 'member',
      targetId: referredById,
      targetLabel: memberLabel(member),
      details: { memberId: id, status: input.status },
    });
  }
  return toMemberDto(updated);
}

export async function liftRestriction(actor: Actor, id: string) {
  if (!can(actor.role, 'members.restrict')) throw new AdminError(403, "You can't restrict members");
  const member = await getMemberOrThrow(id);
  assertCanManage(actor, member);
  const current = effectiveStatus(member.status, member.statusUntil);
  if (current === 'ACTIVE') return toMemberDto(member);
  if (current === 'BANNED' && !can(actor.role, 'members.ban')) {
    throw new AdminError(403, 'Only admins can lift a ban');
  }

  const updated = await prisma.userProfile.update({
    where: { id },
    data: { status: 'ACTIVE', statusReason: null, statusUntil: null },
    select: memberSelect,
  });
  await logActivity({
    actorId: actor.id,
    action: 'member.restriction_lifted',
    targetType: 'member',
    targetId: id,
    targetLabel: memberLabel(member),
    details: { previous: current },
  });
  return toMemberDto(updated);
}

// ─── Activity log ────────────────────────────────────────────────────────────

export async function listActivity(query: ListActivityQuery) {
  const entries = await prisma.adminActivity.findMany({
    where: {
      ...(query.targetType ? { targetType: query.targetType } : {}),
      ...(query.targetId ? { targetId: query.targetId } : {}),
      ...(query.actorId ? { actorId: query.actorId } : {}),
    },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    take: query.limit + 1,
    ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
    include: { actor: { select: { id: true, username: true, name: true, avatarUrl: true } } },
  });
  const hasMore = entries.length > query.limit;
  const page = hasMore ? entries.slice(0, query.limit) : entries;
  return { entries: page, nextCursor: hasMore ? page[page.length - 1].id : null };
}
