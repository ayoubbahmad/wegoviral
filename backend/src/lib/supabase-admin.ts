import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  throw new Error('SUPABASE_URL and SUPABASE_SECRET_KEY must be set');
}

// Server-only client with full access: never expose this key to the browser
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export const COMMUNITY_BUCKET = 'community';

/** Prefix every uploaded community image URL starts with. */
export const communityPublicUrlPrefix = `${SUPABASE_URL}/storage/v1/object/public/${COMMUNITY_BUCKET}/`;
