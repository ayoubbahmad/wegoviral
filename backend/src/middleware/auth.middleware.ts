import { Response, NextFunction } from 'express';
import { MemberStatus, UserRole } from '@prisma/client';
import { verifySupabaseToken } from '../lib/supabase-auth';
import { prisma } from '../lib/prisma';
import { can, effectiveStatus, Permission } from '../lib/permissions';
import { authService } from '../features/auth/service';

export interface AuthenticatedUser {
  id: string;
  authUserId: string;
  role: UserRole;
  status: MemberStatus;
  statusReason: string | null;
  statusUntil: Date | null;
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
  ({ allowRestricted }: { allowRestricted: boolean }) =>
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
      const profile = await prisma.userProfile.findUniqueOrThrow({
        where: { id: profileId },
        select: { role: true, status: true, statusReason: true, statusUntil: true },
      });
      const status = effectiveStatus(profile.status, profile.statusUntil);
      user = {
        id: profileId,
        authUserId: claims.sub,
        role: profile.role,
        status,
        statusReason: status === 'ACTIVE' ? null : profile.statusReason,
        statusUntil: status === 'ACTIVE' ? null : profile.statusUntil,
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

    req.user = user;
    next();
  };

export const protect = authenticate({ allowRestricted: false });

/** For /auth/me: restricted members can still load their profile to see why. */
export const protectAllowRestricted = authenticate({ allowRestricted: true });

/** Blocks muted members from posting, commenting, reacting and voting. */
export const requireCanInteract = (req: any, res: Response, next: NextFunction) => {
  const user: AuthenticatedUser = req.user;
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
