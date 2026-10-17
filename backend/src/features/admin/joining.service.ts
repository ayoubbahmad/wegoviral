/** Admin tools for joining: approval queue, special members, settings, guide, quiz and invite links. */
import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { logActivity } from '../../lib/activity';
import { can } from '../../lib/permissions';
import { getSettings, invalidateSettings } from '../../lib/settings';
import { randomCode } from '../onboarding/service';
import {
  AdminError,
  CreateInviteInput,
  GuideSectionsInput,
  ListApplicationsQuery,
  QuizInput,
  UpdateSettingsInput,
} from './model';
import type { Actor } from './service';

const DAY_MS = 24 * 60 * 60 * 1000;

const applicantSelect = {
  id: true,
  username: true,
  name: true,
  email: true,
  avatarUrl: true,
  createdAt: true,
  joinStatus: true,
  referredBy: { select: { id: true, username: true, name: true } },
} satisfies Prisma.UserProfileSelect;

// ─── Approval queue ──────────────────────────────────────────────────────────

export async function listApplications(query: ListApplicationsQuery) {
  const where: Prisma.MemberApplicationWhereInput = { user: { joinStatus: query.status } };
  const [applications, total] = await Promise.all([
    prisma.memberApplication.findMany({
      where,
      // Oldest first for the queue, newest first for history
      orderBy: { submittedAt: query.status === 'PENDING' ? 'asc' : 'desc' },
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      include: {
        user: { select: applicantSelect },
        invite: { select: { id: true, label: true } },
        reviewedBy: { select: { id: true, username: true } },
      },
    }),
    prisma.memberApplication.count({ where }),
  ]);
  return { applications, total, page: query.page, pageSize: query.pageSize };
}

async function getPendingApplication(userId: string) {
  const application = await prisma.memberApplication.findUnique({
    where: { userId },
    include: { user: { select: { joinStatus: true, username: true } } },
  });
  if (!application) throw new AdminError(404, 'Application not found');
  if (application.user.joinStatus !== 'PENDING') {
    throw new AdminError(409, 'This application has already been reviewed');
  }
  return application;
}

export async function reviewApplication(actor: Actor, userId: string, decision: 'APPROVED' | 'REJECTED', note?: string) {
  const application = await getPendingApplication(userId);
  await prisma.$transaction([
    prisma.memberApplication.update({
      where: { userId },
      data: { reviewedById: actor.id, reviewedAt: new Date(), reviewNote: note || null },
    }),
    prisma.userProfile.update({ where: { id: userId }, data: { joinStatus: decision } }),
  ]);
  await logActivity({
    actorId: actor.id,
    action: decision === 'APPROVED' ? 'member.approved' : 'member.rejected',
    targetType: 'member',
    targetId: userId,
    targetLabel: `${application.fullName} (@${application.user.username})`,
    details: note ? { note } : undefined,
  });
  return { joinStatus: decision };
}

// ─── Special members ─────────────────────────────────────────────────────────

export async function setSpecialMember(actor: Actor, userId: string, specialMember: boolean) {
  if (actor.id === userId) throw new AdminError(403, "You can't change your own account");
  const member = await prisma.userProfile.findUnique({
    where: { id: userId },
    select: { username: true, name: true, joinStatus: true },
  });
  if (!member) throw new AdminError(404, 'Member not found');

  await prisma.userProfile.update({
    where: { id: userId },
    // Making someone special also lets them in if they were waiting
    data: { specialMember, ...(specialMember && member.joinStatus === 'PENDING' ? { joinStatus: 'APPROVED' } : {}) },
  });
  await logActivity({
    actorId: actor.id,
    action: specialMember ? 'member.special_granted' : 'member.special_removed',
    targetType: 'member',
    targetId: userId,
    targetLabel: member.name ? `${member.name} (@${member.username})` : `@${member.username}`,
  });
  return { specialMember };
}

// ─── Settings ────────────────────────────────────────────────────────────────

export async function getCommunitySettings() {
  return prisma.communitySettings.upsert({ where: { id: 'default' }, create: { id: 'default' }, update: {} });
}

export async function updateCommunitySettings(actor: Actor, input: UpdateSettingsInput) {
  const before = await getCommunitySettings();
  const updated = await prisma.communitySettings.update({ where: { id: 'default' }, data: input });
  invalidateSettings();
  const changes = Object.fromEntries(
    Object.entries(input).filter(([key, value]) => before[key as keyof typeof before] !== value),
  );
  if (Object.keys(changes).length) {
    await logActivity({
      actorId: actor.id,
      action: 'settings.updated',
      targetType: 'settings',
      targetLabel: 'Joining rules',
      details: changes,
    });
  }
  return updated;
}

// ─── Guide & quiz ────────────────────────────────────────────────────────────

export async function getGuideForAdmin() {
  const [settings, sections, questions, acceptedCurrent, approvedMembers] = await Promise.all([
    getSettings(),
    prisma.guideSection.findMany({ orderBy: { position: 'asc' } }),
    prisma.quizQuestion.findMany({ orderBy: { position: 'asc' } }),
    prisma.userProfile.count({ where: { rulesAcceptedVersion: { gte: 1 } } }),
    prisma.userProfile.count({ where: { joinStatus: 'APPROVED' } }),
  ]);
  const acceptedLatest =
    settings.guideVersion > 0
      ? await prisma.userProfile.count({ where: { rulesAcceptedVersion: settings.guideVersion } })
      : 0;
  return {
    version: settings.guideVersion,
    sections,
    questions,
    stats: { approvedMembers, acceptedAnyVersion: acceptedCurrent, acceptedLatest },
  };
}

/** Replaces all sections (the editor saves the whole guide at once). Doesn't publish. */
export async function saveGuideSections(_actor: Actor, input: GuideSectionsInput) {
  await prisma.$transaction([
    prisma.guideSection.deleteMany(),
    prisma.guideSection.createMany({
      data: input.sections.map((section, position) => ({ ...section, position })),
    }),
  ]);
  return prisma.guideSection.findMany({ orderBy: { position: 'asc' } });
}

export async function saveQuiz(actor: Actor, input: QuizInput) {
  await prisma.$transaction([
    prisma.quizQuestion.deleteMany(),
    prisma.quizQuestion.createMany({
      data: input.questions.map((question, position) => ({ ...question, position })),
    }),
  ]);
  invalidateSettings();
  await logActivity({
    actorId: actor.id,
    action: 'quiz.updated',
    targetType: 'guide',
    targetLabel: 'Community quiz',
    details: { questions: input.questions.length },
  });
  return prisma.quizQuestion.findMany({ orderBy: { position: 'asc' } });
}

/** Publishing a new version asks every member to accept the guide again. */
export async function publishGuide(actor: Actor) {
  const sections = await prisma.guideSection.count();
  if (!sections) throw new AdminError(400, 'Add at least one section before publishing');
  const settings = await prisma.communitySettings.update({
    where: { id: 'default' },
    data: { guideVersion: { increment: 1 } },
  });
  invalidateSettings();
  await logActivity({
    actorId: actor.id,
    action: 'guide.published',
    targetType: 'guide',
    targetLabel: `Community guide v${settings.guideVersion}`,
    details: { version: settings.guideVersion },
  });
  return { version: settings.guideVersion };
}

// ─── Invite links ────────────────────────────────────────────────────────────

export async function listInvites() {
  return prisma.inviteLink.findMany({
    orderBy: { createdAt: 'desc' },
    include: { createdBy: { select: { id: true, username: true } } },
  });
}

export async function createInvite(actor: Actor, input: CreateInviteInput) {
  if (input.specialMember && !can(actor.role, 'members.exempt')) {
    throw new AdminError(403, "You can't create special-member invites");
  }
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = randomCode(8);
    const referralTaken = await prisma.userProfile.findUnique({ where: { referralCode: code } });
    if (referralTaken) continue;
    try {
      const invite = await prisma.inviteLink.create({
        data: {
          code,
          label: input.label,
          // A special-member invite always lets people in directly
          autoApprove: input.autoApprove || input.specialMember,
          specialMember: input.specialMember,
          expiresAt: input.expiresInDays ? new Date(Date.now() + input.expiresInDays * DAY_MS) : null,
          maxUses: input.maxUses,
          createdById: actor.id,
        },
      });
      await logActivity({
        actorId: actor.id,
        action: 'invite.created',
        targetType: 'invite',
        targetId: invite.id,
        targetLabel: invite.label,
        details: { autoApprove: invite.autoApprove, specialMember: invite.specialMember },
      });
      return invite;
    } catch (error) {
      if (!(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002')) throw error;
    }
  }
  throw new Error('Could not create an invite code');
}

export async function revokeInvite(actor: Actor, id: string) {
  const invite = await prisma.inviteLink.findUnique({ where: { id } });
  if (!invite) throw new AdminError(404, 'Invite link not found');
  if (invite.revokedAt) return invite;
  const revoked = await prisma.inviteLink.update({ where: { id }, data: { revokedAt: new Date() } });
  await logActivity({
    actorId: actor.id,
    action: 'invite.revoked',
    targetType: 'invite',
    targetId: id,
    targetLabel: invite.label,
  });
  return revoked;
}
