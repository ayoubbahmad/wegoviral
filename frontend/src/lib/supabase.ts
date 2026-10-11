import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY must be set',
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    // PKCE: OAuth and email links return a ?code= that the client exchanges itself
    flowType: 'pkce',
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/** Where Supabase sends users back to after Google sign-in or email links. */
export const authRedirectUrl = (path: string) =>
  typeof window === 'undefined' ? path : `${window.location.origin}${path}`;
