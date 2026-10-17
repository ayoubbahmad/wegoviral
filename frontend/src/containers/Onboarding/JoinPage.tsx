'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, Loader2, Ticket, Zap } from 'lucide-react';
import { avatarFor } from '@/lib/utils';
import { saveJoinCode } from '@/lib/joinCode';
import { useAuth } from '@/providers/Auth';
import { useCodePreview } from './api';

/** Landing page for invite and referral links: remembers the code, then sends people to sign up. */
export function JoinPage({ code }: { code: string }) {
  const { user } = useAuth();
  const { data, isPending } = useCodePreview(code);

  useEffect(() => {
    if (data?.valid) saveJoinCode(code);
  }, [data?.valid, code]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="w-full max-w-md p-8 rounded-[2rem] border border-border bg-card shadow-2xl text-center space-y-6">
        <div className="inline-flex p-3 rounded-2xl bg-primary shadow-xl shadow-primary/20">
          <Zap className="w-7 h-7 text-primary-foreground" />
        </div>

        {isPending ? (
          <Loader2 className="mx-auto w-6 h-6 animate-spin text-muted-foreground" />
        ) : !data?.valid ? (
          <div className="space-y-3">
            <AlertCircle className="mx-auto w-8 h-8 text-red-500" />
            <h1 className="text-2xl font-bold">This link doesn&apos;t work</h1>
            <p className="text-sm text-muted-foreground">{data?.reason ?? "This link isn't valid."} You can still apply to join.</p>
            <Link href="/login?tab=signup" className="inline-block text-sm font-bold text-primary hover:underline">
              Apply to join WeGoViral
            </Link>
          </div>
        ) : (
          <>
            {data.type === 'referral' && data.referrer ? (
              <div className="space-y-3">
                <img src={avatarFor(data.referrer)} alt="" className="mx-auto w-16 h-16 rounded-full border border-border" />
                <h1 className="text-2xl font-bold">
                  {data.referrer.name || `@${data.referrer.username}`} invited you to WeGoViral
                </h1>
              </div>
            ) : (
              <div className="space-y-3">
                <Ticket className="mx-auto w-8 h-8 text-primary" />
                <h1 className="text-2xl font-bold">You&apos;re invited to WeGoViral</h1>
                <p className="text-sm text-muted-foreground">{data.label}</p>
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              Join the community of creators sharing wins, feedback and collabs.
            </p>
            <Link
              href={user ? '/community/feed' : '/login?tab=signup'}
              className="block w-full rounded-2xl bg-primary py-4 font-black text-primary-foreground shadow-xl shadow-primary/25 hover:opacity-90"
            >
              {user ? 'Continue' : 'Join WeGoViral'}
            </Link>
            {!user && (
              <p className="text-xs text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="font-semibold text-primary hover:underline">
                  Log in
                </Link>
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
