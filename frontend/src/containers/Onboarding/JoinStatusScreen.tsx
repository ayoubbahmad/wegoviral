'use client';

import Link from 'next/link';
import { BookOpen, CheckCircle2, Clock, LogOut, XCircle } from 'lucide-react';
import { useAuth } from '@/providers/Auth';
import { useT } from '@/i18n/provider';
import { LanguageSwitcher } from '@/i18n/LanguageSwitcher';

/** Shown to applicants who are waiting for approval, or weren't approved. */
export function JoinStatusScreen() {
  const t = useT();
  const { user, logout } = useAuth();
  if (!user) return null;
  const { step, guideVersion, rulesAcceptedVersion, rejectionNote } = user.onboarding;
  const isRejected = step === 'REJECTED';
  const hasGuide = guideVersion > 0;
  const acceptedRules = hasGuide && (rulesAcceptedVersion ?? 0) >= guideVersion;

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background px-6">
      <LanguageSwitcher className="absolute end-6 top-6" />
      <div className="w-full max-w-md p-8 rounded-[2rem] border border-border bg-card shadow-2xl text-center space-y-6">
        <div className={`inline-flex p-4 rounded-2xl ${isRejected ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'}`}>
          {isRejected ? <XCircle className="w-8 h-8" /> : <Clock className="w-8 h-8" />}
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">
            {isRejected ? t('onboarding.status.rejectedTitle') : t('onboarding.status.pendingTitle')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isRejected ? t('onboarding.status.rejectedBody') : t('onboarding.status.pendingBody')}
          </p>
        </div>

        {isRejected && rejectionNote && (
          <p className="rounded-xl bg-secondary/40 p-3 text-sm text-start">
            <span className="font-semibold">{t('onboarding.status.teamMessage')}</span> {rejectionNote}
          </p>
        )}

        {!isRejected && hasGuide && (
          <div className="rounded-xl border border-border p-4 text-start text-sm space-y-3">
            {acceptedRules ? (
              <p className="flex items-center gap-2 font-semibold text-emerald-500">
                <CheckCircle2 className="w-4 h-4" /> {t('onboarding.status.accepted')}
              </p>
            ) : (
              <>
                <p className="font-semibold">{t('onboarding.status.whileYouWait')}</p>
                <p className="text-muted-foreground">{t('onboarding.status.readGuideBody')}</p>
                <Link
                  href="/community/guide"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 font-semibold text-primary-foreground hover:opacity-90"
                >
                  <BookOpen className="w-4 h-4" /> {t('onboarding.status.readGuide')}
                </Link>
              </>
            )}
          </div>
        )}

        <button onClick={logout} className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
          <LogOut className="w-4 h-4" /> {t('onboarding.status.signOut')}
        </button>
      </div>
    </div>
  );
}
