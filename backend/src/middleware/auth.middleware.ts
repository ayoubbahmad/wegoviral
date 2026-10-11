import { Response, NextFunction } from 'express';
import { verifySupabaseToken } from '../lib/supabase-auth';
import { authService } from '../features/auth/service';

export const protect = async (req: any, res: Response, next: NextFunction) => {
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

  try {
    // Every route keeps using our own profile id, not the Supabase user id
    const profileId = await authService.resolveProfileId(claims);
    req.user = { id: profileId, authUserId: claims.sub };
    next();
  } catch (error) {
    req.log?.error({ err: error }, 'Failed to resolve user profile');
    return res.status(500).json({ error: 'Failed to load your profile.' });
  }
};
