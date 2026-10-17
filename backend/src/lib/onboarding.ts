import { JoinStatus, UserRole } from '@prisma/client';
import { can } from './permissions';
import { Settings } from './settings';

/**
 * Where a member is in the joining journey (docs/ADMIN_ROADMAP.md, Phase 2a):
 * APPLICATION → PENDING → (approved) → RULES → QUIZ → DONE.
 * Before approval they can't use the community; RULES and QUIZ can read but not interact.
 */
export type OnboardingStep = 'APPLICATION' | 'PENDING' | 'REJECTED' | 'RULES' | 'QUIZ' | 'DONE';

export interface OnboardingProfile {
  role: UserRole;
  joinStatus: JoinStatus;
  specialMember: boolean;
  hasApplication: boolean;
  rulesAcceptedVersion: number | null;
  quizPassedVersion: number | null;
}

export function onboardingStep(profile: OnboardingProfile, settings: Settings): OnboardingStep {
  // Staff and special members skip the whole journey
  if (profile.specialMember || can(profile.role, 'community.moderate')) return 'DONE';

  if (profile.joinStatus === 'REJECTED') return 'REJECTED';
  if (profile.joinStatus === 'PENDING') return profile.hasApplication ? 'PENDING' : 'APPLICATION';

  const guidePublished = settings.guideVersion > 0;
  if (settings.requireRules && guidePublished && (profile.rulesAcceptedVersion ?? 0) < settings.guideVersion) {
    return 'RULES';
  }
  if (
    settings.requireQuiz &&
    guidePublished &&
    settings.quizQuestionCount > 0 &&
    (profile.quizPassedVersion ?? 0) < settings.guideVersion
  ) {
    return 'QUIZ';
  }
  return 'DONE';
}

/** Steps where the member hasn't been let into the community yet. */
export const NOT_JOINED_STEPS: OnboardingStep[] = ['APPLICATION', 'PENDING', 'REJECTED'];
