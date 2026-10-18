import { Response, NextFunction } from 'express';
import { MemberStatus, UserRole } from '@prisma/client';
import { verifySupabaseToken } from '../lib/supabase-auth';
import { prisma } from '../lib/prisma';
import { can, effectiveStatus, Permission } from '../lib/permissions';
import { getSettings } from '../lib/settings';
import { NOT_JOINED_STEPS, onboardingStep, OnboardingStep } from '../lib/onboarding';
import { authService } from '../features/auth/service';

export interface AuthenticatedUser {
  id: string;
  authUserId: string;
  role: UserRole;
  status: MemberStatus;
  statusReason: string | null;
  statusUntil: Date | null;
  onboarding: OnboardingStep;
  /** For access rules (Phase 4) */
  tierId: string | null;
  joinedAt: Date;
}

const restrictionError = (user: AuthenticatedUser) => ({
  status: user.status,
  reason: user.statusReason,
  until: user.statusUntil,
});

/**
 * Verifies the Supabase token and loads role and status fresh on every request,
 * so role changes and restrictions apply immediately.
 */
const authenticate =
  ({ allowRestricted, allowNotJoined }: { allowRestricted: boolean; allowNotJoined: boolean }) =>
  async (req: any, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;

    if (!token) {
      return res.status(401).json({ error: 'You are not logged in. Please log in to get access.' });
    }

    let claims;
    try {
      claims = await verifySupabaseToken(token);
    } catch {
      return res.status(401).json({ error: 'Invalid token or token expired.' });
    }

    let user: AuthenticatedUser;
    try {
      // Every route keeps using our own profile id, not the Supabase user id
      const profileId = await authService.resolveProfileId(claims);
      const [profile, settings] = await Promise.all([
        prisma.userProfile.findUniqueOrThrow({
          where: { id: profileId },
          select: {
            role: true,
            status: true,
            statusReason: true,
            statusUntil: true,
            joinStatus: true,
            specialMember: true,
            rulesAcceptedVersion: true,
            quizPassedVersion: true,
            tierId: true,
            createdAt: true,
            application: { select: { id: true } },
          },
        }),
        getSettings(),
      ]);
      const status = effectiveStatus(profile.status, profile.statusUntil);
      user = {
        id: profileId,
        authUserId: claims.sub,
        role: profile.role,
        status,
        statusReason: status === 'ACTIVE' ? null : profile.statusReason,
        statusUntil: status === 'ACTIVE' ? null : profile.statusUntil,
        onboarding: onboardingStep({ ...profile, hasApplication: Boolean(profile.application) }, settings),
        tierId: profile.tierId,
        joinedAt: profile.createdAt,
      };
    } catch (error) {
      req.log?.error({ err: error }, 'Failed to resolve user profile');
      return res.status(500).json({ error: 'Failed to load your profile.' });
    }

    if (!allowRestricted && (user.status === 'SUSPENDED' || user.status === 'BANNED')) {
      return res.status(403).json({
        error:
          user.status === 'BANNED'
            ? 'Your account has been banned from the community.'
            : 'Your account is suspended.',
        code: 'ACCOUNT_RESTRICTED',
        restriction: restrictionError(user),
      });
    }

    if (!allowNotJoined && NOT_JOINED_STEPS.includes(user.onboarding)) {
      return res.status(403).json({
        error:
          user.onboarding === 'APPLICATION'
            ? 'Please complete your application first.'
            : user.onboarding === 'PENDING'
              ? 'Your application is waiting for approval.'
              : 'Your application was not approved.',
        code: 'NOT_JOINED',
        onboarding: user.onboarding,
      });
    }

    req.user = user;
    next();
  };

export const protect = authenticate({ allowRestricted: false, allowNotJoined: false });

/** For /auth/me: restricted or not-yet-approved members can still load their profile. */
export const protectAllowRestricted = authenticate({ allowRestricted: true, allowNotJoined: true });

/** For the joining flow (application, guide): signed in, not restricted, not necessarily approved. */
export const protectJoining = authenticate({ allowRestricted: false, allowNotJoined: true });

/** Blocks muted members, and members who still have to accept the rules or pass the quiz. */
export const requireCanInteract = (req: any, res: Response, next: NextFunction) => {
  const user: AuthenticatedUser = req.user;
  if (user.onboarding === 'RULES' || user.onboarding === 'QUIZ') {
    return res.status(403).json({
      error:
        user.onboarding === 'RULES'
          ? 'Please read and accept the community guide first.'
          : 'Please pass the community quiz first.',
      code: 'ONBOARDING_REQUIRED',
      onboarding: user.onboarding,
    });
  }
  if (user.status === 'MUTED') {
    return res.status(403).json({
      error: 'You are muted and can only read the community for now.',
      code: 'MUTED',
      restriction: restrictionError(user),
    });
  }
  next();
};

export const requirePermission =
  (permission: Permission) => (req: any, res: Response, next: NextFunction) => {
    if (!can(req.user.role, permission)) {
      return res.status(403).json({ error: "You don't have permission to do this." });
    }
    next();
  };
