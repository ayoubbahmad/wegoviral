/**
 * Post review during probation (docs/ADMIN_ROADMAP.md, Phase 2b): new members'
 * first posts wait for review by staff or trusted members.
 */
import { MemberStatus, UserRole } from '@prisma/client';
import { prisma } from './prisma';
import { can } from './permissions';
import { getSettings } from './settings';
import { OnboardingStep } from './onboarding';

/** Members can review others' posts after this long in the community (and their own probation). */
export const REVIEWER_MIN_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;

interface ProbationProfile {
  role: UserRole;
  specialMember: boolean;
  probationCompletedAt: Date | null;
}

export async function isOnProbation(profile: ProbationProfile) {
  if (profile.specialMember || can(profile.role, 'community.moderate')) return false;
  if (profile.probationCompletedAt) return false;
  const { probationPostCount } = await getSettings();
  return probationPostCount > 0;
}

/** Posts of a member that a reviewer approved: these count towards finishing probation. */
export function countApprovedReviewedPosts(authorId: string) {
  return prisma.communityPost.count({
    where: { authorId, deletedAt: null, reviewStatus: 'PUBLISHED', reviewedById: { not: null } },
  });
}

export async function probationSummary(userId: string) {
  const profile = await prisma.userProfile.findUniqueOrThrow({
    where: { id: userId },
    select: { role: true, specialMember: true, probationCompletedAt: true },
  });
  const onProbation = await isOnProbation(profile);
  if (!onProbation) return { onProbation: false as const };
  const [{ probationPostCount }, approvedPosts, pendingPosts] = await Promise.all([
    getSettings(),
    countApprovedReviewedPosts(userId),
    prisma.communityPost.count({ where: { authorId: userId, deletedAt: null, reviewStatus: 'PENDING' } }),
  ]);
  return { onProbation: true as const, approvedPosts, pendingPosts, required: probationPostCount };
}

interface ReviewerContext {
  id: string;
  role: UserRole;
  status: MemberStatus;
  onboarding: OnboardingStep;
}

/** Staff can always review; members once they're trusted. Returns why not, for the UI. */
export async function reviewerEligibility(user: ReviewerContext): Promise<{ canReview: boolean; reason?: string }> {
  if (can(user.role, 'community.moderate')) return { canReview: true };
  if (user.status !== 'ACTIVE' || user.onboarding !== 'DONE') {
    return { canReview: false, reason: 'Only members in good standing can review posts.' };
  }
  const profile = await prisma.userProfile.findUniqueOrThrow({
    where: { id: user.id },
    select: { createdAt: true, probationCompletedAt: true, specialMember: true },
  });
  if (!profile.probationCompletedAt && !profile.specialMember) {
    return { canReview: false, reason: 'You can review posts once your own first posts have been approved.' };
  }
  const days = (Date.now() - profile.createdAt.getTime()) / DAY_MS;
  if (days < REVIEWER_MIN_DAYS) {
    return {
      canReview: false,
      reason: `You can review posts after ${REVIEWER_MIN_DAYS} days in the community (${Math.ceil(REVIEWER_MIN_DAYS - days)} to go).`,
    };
  }
  return { canReview: true };
}
