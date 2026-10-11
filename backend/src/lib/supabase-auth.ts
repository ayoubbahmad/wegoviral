import { createRemoteJWKSet, jwtVerify, JWTPayload } from 'jose';

const SUPABASE_URL = process.env.SUPABASE_URL;

if (!SUPABASE_URL) {
  throw new Error('SUPABASE_URL is not set');
}

// Supabase signs access tokens with asymmetric keys published at this endpoint
const jwks = createRemoteJWKSet(
  new URL(
    process.env.SUPABASE_JWKS_URL || `${SUPABASE_URL}/auth/v1/.well-known/jwks.json`,
  ),
);

export interface SupabaseClaims extends JWTPayload {
  sub: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    name?: string;
    username?: string;
    avatar_url?: string;
    picture?: string;
    email_verified?: boolean;
  };
}

export async function verifySupabaseToken(token: string): Promise<SupabaseClaims> {
  const { payload } = await jwtVerify(token, jwks, {
    issuer: `${SUPABASE_URL}/auth/v1`,
    audience: 'authenticated',
  });
  if (!payload.sub) throw new Error('Token has no subject');
  return payload as SupabaseClaims;
}
