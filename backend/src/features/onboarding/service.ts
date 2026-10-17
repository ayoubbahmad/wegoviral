import { randomBytes } from 'crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { logActivity } from '../../lib/activity';
import { effectiveStatus } from '../../lib/permissions';
import { getSettings } from '../../lib/settings';
import { ApplicationInput, OnboardingError } from './model';

const CODE_ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789'; // no look-alikes (0/o, 1/l/i)

export function randomCode(length: number) {
  const bytes = randomBytes(length);
  return Array.from(bytes, (byte) => CODE_ALPHABET[byte % CODE_ALPHABET.length]).join('');
}

// ─── Invite & referral codes ─────────────────────────────────────────────────

type ResolvedCode =
  | { type: 'invite'; invite: Prisma.InviteLinkGetPayload<object> }
  | { type: 'referral'; referrer: { id: string; username: string; name: string | null; avatarUrl: string | null } };

/** Finds what a /join code refers to and whether it can still be used. */
async function resolveCode(code: string): Promise<{ resolved: ResolvedCode | null; problem?: string }> {
  const normalized = code.trim().toLowerCase();
  const invite = await prisma.inviteLink.findUnique({ where: { code: normalized } });
  if (invite) {
    if (invite.revokedAt) return { resolved: null, problem: 'This invite link has been turned off.' };
    if (invite.expiresAt && invite.expiresAt.getTime() < Date.now()) {
      return { resolved: null, problem: 'This invite link has expired.' };
    }
    if (invite.maxUses !== null && invite.useCount >= invite.maxUses) {
      return { resolved: null, problem: 'This invite link has reached its limit.' };
    }
    return { resolved: { type: 'invite', invite } };
  }

  const referrer = await prisma.userProfile.findUnique({
    where: { referralCode: normalized },
    select: { id: true, username: true, name: true, avatarUrl: true, joinStatus: true, status: true, statusUntil: true },
  });
  if (referrer) {
    const status = effectiveStatus(referrer.status, referrer.statusUntil);
    if (referrer.joinStatus !== 'APPROVED' || status === 'SUSPENDED' || status === 'BANNED') {
      return { resolved: null, problem: 'This referral link is no longer active.' };
    }
    const { joinStatus, status: _status, statusUntil, ...publicReferrer } = referrer;
    return { resolved: { type: 'referral', referrer: publicReferrer } };
  }
  return { resolved: null, problem: "This link isn't valid." };
}

/** Public preview for the /join page. */
export async function describeCode(code: string) {
  const { resolved, problem } = await resolveCode(code);
  if (!resolved) return { valid: false, reason: problem };
  return resolved.type === 'invite'
    ? { valid: true, type: 'invite' as const, label: resolved.invite.label }
    : { valid: true, type: 'referral' as const, referrer: resolved.referrer };
}

// ─── Application ─────────────────────────────────────────────────────────────

export async function submitApplication(userId: string, input: ApplicationInput) {
  const profile = await prisma.userProfile.findUniqueOrThrow({
    where: { id: userId },
    select: { joinStatus: true, application: { select: { id: true } } },
  });
  if (profile.application) throw new OnboardingError(409, 'You have already applied.');

  const settings = await getSettings();
  const { resolved, problem } = input.code ? await resolveCode(input.code) : { resolved: null, problem: undefined };
  if (input.code && !resolved) throw new OnboardingError(400, problem ?? "This link isn't valid.");
  if (resolved?.type === 'referral' && resolved.referrer.id === userId) {
    throw new OnboardingError(400, "You can't use your own referral link.");
  }

  // Staff invite links and member referrals approve automatically (agreed in the roadmap)
  const invite = resolved?.type === 'invite' ? resolved.invite : null;
  const referrer = resolved?.type === 'referral' ? resolved.referrer : null;
  const autoApproved = !settings.requireApproval || Boolean(invite?.autoApprove) || Boolean(referrer);

  await prisma.$transaction(async (tx) => {
    if (invite) {
      // Re-check the limit inside the transaction so two sign-ups can't both take the last use
      const { count } = await tx.inviteLink.updateMany({
        where: { id: invite.id, ...(invite.maxUses !== null ? { useCount: { lt: invite.maxUses } } : {}) },
        data: { useCount: { increment: 1 } },
      });
      if (!count) throw new OnboardingError(400, 'This invite link has reached its limit.');
    }
    await tx.memberApplication.create({
      data: {
        userId,
        fullName: input.fullName,
        phone: input.phone,
        niche: input.niche,
        platforms: input.platforms,
        followerRange: input.followerRange,
        about: input.about,
        inviteId: invite?.id,
        ...(autoApproved ? { reviewedAt: new Date() } : {}),
      },
    });
    await tx.userProfile.update({
      where: { id: userId },
      data: {
        name: input.fullName,
        phone: input.phone,
        referredById: referrer?.id,
        specialMember: invite?.specialMember || undefined,
        joinStatus: autoApproved ? 'APPROVED' : 'PENDING',
      },
    });
  });

  if (autoApproved) {
    await logActivity({
      actorId: referrer?.id ?? invite?.createdById ?? null,
      action: 'member.approved',
      targetType: 'member',
      targetId: userId,
      targetLabel: input.fullName,
      details: {
        via: invite ? 'invite' : referrer ? 'referral' : 'open_signup',
        ...(invite ? { invite: invite.label, specialMember: invite.specialMember } : {}),
      },
    });
  }
  return { approved: autoApproved };
}

// ─── Guide, rules & quiz ─────────────────────────────────────────────────────

export async function getGuide(userId: string) {
  const [settings, sections, questions, profile] = await Promise.all([
    getSettings(),
    prisma.guideSection.findMany({ orderBy: { position: 'asc' } }),
    prisma.quizQuestion.findMany({ orderBy: { position: 'asc' } }),
    prisma.userProfile.findUniqueOrThrow({
      where: { id: userId },
      select: { rulesAcceptedVersion: true, rulesAcceptedAt: true, quizPassedVersion: true },
    }),
  ]);
  return {
    version: settings.guideVersion,
    sections: sections.map(({ id, title, body, mediaUrl }) => ({ id, title, body, mediaUrl })),
    // Correct answers stay on the server
    quiz: settings.requireQuiz
      ? {
          passPercent: settings.quizPassPercent,
          questions: questions.map(({ id, question, options }) => ({ id, question, options })),
        }
      : null,
    acceptedVersion: profile.rulesAcceptedVersion,
    acceptedAt: profile.rulesAcceptedAt,
    quizPassedVersion: profile.quizPassedVersion,
  };
}

export async function acceptRules(userId: string, version: number) {
  const settings = await getSettings();
  if (settings.guideVersion === 0) throw new OnboardingError(400, 'There is no community guide yet.');
  if (version !== settings.guideVersion) {
    throw new OnboardingError(409, 'The guide was just updated. Please read the latest version.');
  }
  const acceptedAt = new Date();
  await prisma.$transaction([
    prisma.userProfile.update({
      where: { id: userId },
      data: { rulesAcceptedVersion: version, rulesAcceptedAt: acceptedAt },
    }),
    prisma.rulesAcceptance.create({ data: { userId, version, acceptedAt } }),
  ]);
  return { acceptedVersion: version, acceptedAt };
}

export async function submitQuiz(userId: string, answers: number[]) {
  const settings = await getSettings();
  const questions = await prisma.quizQuestion.findMany({ orderBy: { position: 'asc' } });
  if (!settings.requireQuiz || !questions.length) throw new OnboardingError(400, 'There is no quiz right now.');
  if (answers.length !== questions.length) throw new OnboardingError(400, 'Answer every question.');

  const results = questions.map((question, index) => answers[index] === question.correctIndex);
  const score = Math.round((results.filter(Boolean).length / questions.length) * 100);
  const passed = score >= settings.quizPassPercent;
  if (passed) {
    await prisma.userProfile.update({ where: { id: userId }, data: { quizPassedVersion: settings.guideVersion } });
  }
  return { score, passed, passPercent: settings.quizPassPercent, results };
}

// ─── Referral link ───────────────────────────────────────────────────────────

/** Each approved member gets a personal referral code, created on first request. */
export async function getReferral(userId: string) {
  const profile = await prisma.userProfile.findUniqueOrThrow({
    where: { id: userId },
    select: { referralCode: true, username: true, _count: { select: { referrals: true } } },
  });
  let code = profile.referralCode;
  if (!code) {
    const base = profile.username.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 12) || 'member';
    for (let attempt = 0; attempt < 5 && !code; attempt++) {
      const candidate = `${base}-${randomCode(4)}`;
      const taken = await prisma.inviteLink.findUnique({ where: { code: candidate } });
      if (taken) continue;
      try {
        await prisma.userProfile.update({ where: { id: userId }, data: { referralCode: candidate } });
        code = candidate;
      } catch (error) {
        if (!(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002')) throw error;
      }
    }
    if (!code) throw new Error('Could not create a referral code');
  }
  return { code, referralCount: profile._count.referrals };
}

