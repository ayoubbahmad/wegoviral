'use client';

import { useState } from 'react';
import { AlertCircle, Loader2, LogOut, Plus, Ticket, X, Zap } from 'lucide-react';
import { Button } from '@/components/Button';
import { Select } from '@/components/Select';
import { Textarea } from '@/components/Textarea';
import { useAuth, useRefreshUser } from '@/providers/Auth';
import { clearJoinCode, readJoinCode } from '@/lib/joinCode';
import { FOLLOWER_RANGES, Platform, PLATFORMS, useCodePreview, useSubmitApplication } from './api';
import { useT } from '@/i18n/provider';
import { LanguageSwitcher } from '@/i18n/LanguageSwitcher';

const inputClass =
  'w-full h-11 rounded-xl border border-input bg-muted/30 px-4 text-sm outline-none transition-all focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20';

const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <label className="block space-y-1.5">
    <span className="text-sm font-semibold">{label}</span>
    {children}
    {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
  </label>
);

/** First step after signing up: tell us who you are and what you create. */
export function ApplicationForm() {
  const t = useT();
  const { user, logout } = useAuth();
  const refreshUser = useRefreshUser();
  const submit = useSubmitApplication();
  const [code] = useState(() => readJoinCode());
  const { data: codePreview } = useCodePreview(code);

  const [fullName, setFullName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState('');
  const [niche, setNiche] = useState('');
  const [platforms, setPlatforms] = useState<{ platform: Platform; handle: string }[]>([
    { platform: 'instagram', handle: '' },
  ]);
  const [followerRange, setFollowerRange] = useState('');
  const [about, setAbout] = useState('');
  const [error, setError] = useState<string | null>(null);

  const updatePlatform = (index: number, change: Partial<{ platform: Platform; handle: string }>) =>
    setPlatforms((rows) => rows.map((row, i) => (i === index ? { ...row, ...change } : row)));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      await submit.mutateAsync({
        fullName: fullName.trim(),
        phone: phone.trim(),
        niche: niche.trim(),
        platforms: platforms.filter((row) => row.handle.trim()),
        followerRange: followerRange || undefined,
        about: about.trim() || undefined,
        code: codePreview?.valid ? code ?? undefined : undefined,
      });
      clearJoinCode();
      await refreshUser();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('onboarding.application.failed'));
    }
  };

  return (
    <div className="relative min-h-screen bg-background px-6 py-12">
      <LanguageSwitcher className="absolute end-6 top-6" />
      <form onSubmit={handleSubmit} className="mx-auto w-full max-w-xl space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex p-3 rounded-2xl bg-primary shadow-xl shadow-primary/20">
            <Zap className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{t('onboarding.application.title')}</h1>
          <p className="text-muted-foreground">{t('onboarding.application.intro')}</p>
        </div>

        {codePreview?.valid && (
          <div className="flex items-center gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-4 text-sm">
            <Ticket className="w-5 h-5 text-primary shrink-0" />
            {codePreview.type === 'invite' ? (
              <span>{t('onboarding.application.withInvite', { label: codePreview.label ?? '' })}</span>
            ) : (
              <span>{t('onboarding.application.invitedBy', { username: codePreview.referrer?.username ?? '' })}</span>
            )}
          </div>
        )}

        <div className="space-y-5 rounded-[2rem] border border-border bg-card p-6 md:p-8">
          <Field label={t('onboarding.application.fullName')}>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} required autoComplete="name" className={inputClass} />
          </Field>
          <Field label={t('onboarding.application.phone')} hint={t('onboarding.application.phoneHint')}>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              type="tel"
              autoComplete="tel"
              placeholder="+212 6 12 34 56 78"
              dir="ltr"
              className={inputClass}
            />
          </Field>
          <Field label={t('onboarding.application.niche')} hint={t('onboarding.application.nicheHint')}>
            <input value={niche} onChange={(e) => setNiche(e.target.value)} required className={inputClass} />
          </Field>

          <div className="space-y-2">
            <span className="text-sm font-semibold">{t('onboarding.application.where')}</span>
            {platforms.map((row, index) => (
              <div key={index} className="flex gap-2">
                <div className="w-40 shrink-0">
                  <Select
                    aria-label={t('onboarding.application.platform')}
                    value={row.platform}
                    onChange={(e) => updatePlatform(index, { platform: e.target.value as Platform })}
                    options={PLATFORMS.map((p) => ({ value: p.value, label: p.value === 'other' ? t('onboarding.application.otherPlatform') : p.label }))}
                  />
                </div>
                <input
                  value={row.handle}
                  onChange={(e) => updatePlatform(index, { handle: e.target.value })}
                  placeholder={t('onboarding.application.handlePlaceholder')}
                  aria-label={t('onboarding.application.handle')}
                  className={inputClass}
                />
                {platforms.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setPlatforms((rows) => rows.filter((_, i) => i !== index))}
                    aria-label={t('onboarding.application.removePlatform')}
                    className="p-2 rounded-lg text-muted-foreground hover:bg-secondary/50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            {platforms.length < 10 && (
              <button
                type="button"
                onClick={() => setPlatforms((rows) => [...rows, { platform: 'tiktok', handle: '' }])}
                className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> {t('onboarding.application.addPlatform')}
              </button>
            )}
          </div>

          <Field label={t('onboarding.application.followers')}>
            <Select
              aria-label={t('onboarding.application.followersLabel')}
              value={followerRange}
              onChange={(e) => setFollowerRange(e.target.value)}
              options={[{ value: '', label: t('onboarding.application.chooseRange') }, ...FOLLOWER_RANGES.map((range) => ({ value: range, label: range }))]}
            />
          </Field>
          <Field label={t('onboarding.application.about')} hint={t('onboarding.application.aboutHint')}>
            <Textarea value={about} onChange={(e) => setAbout(e.target.value)} maxLength={1000} className="min-h-[90px]" />
          </Field>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 p-3.5 text-sm font-medium text-destructive">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        <div className="flex items-center justify-between">
          <button type="button" onClick={logout} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <LogOut className="w-4 h-4" /> {t('onboarding.status.signOut')}
          </button>
          <Button type="submit" variant="primary" size="lg" disabled={submit.isPending}>
            {submit.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : t('onboarding.application.submit')}
          </Button>
        </div>
      </form>
    </div>
  );
}
