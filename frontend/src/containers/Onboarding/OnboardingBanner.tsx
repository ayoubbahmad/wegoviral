'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen } from 'lucide-react';
import { useAuth } from '@/providers/Auth';

/** Reminder for approved members who still have to accept the guide or pass the quiz. */
export function OnboardingBanner() {
  const { user } = useAuth();
  const pathname = usePathname();
  const step = user?.onboarding.step;
  if ((step !== 'RULES' && step !== 'QUIZ') || pathname === '/community/guide') return null;

  return (
    <div role="status" className="mb-8 flex flex-col gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-4 sm:flex-row sm:items-center">
      <BookOpen className="w-5 h-5 shrink-0 text-primary" />
      <div className="flex-1 text-sm">
        <p className="font-semibold">
          {step === 'RULES' ? 'One last step: accept the community guide' : 'One last step: pass the community quiz'}
        </p>
        <p className="text-muted-foreground">
          You can read everything, but posting, commenting and reacting unlock once you&apos;re done.
        </p>
      </div>
      <Link href="/community/guide" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
        {step === 'RULES' ? 'Read the guide' : 'Take the quiz'}
      </Link>
    </div>
  );
}
