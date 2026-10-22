'use client';

import { useEffect, useState } from 'react';
import { Check, KeyRound, Loader2, LogOut, Mail } from 'lucide-react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/providers/Toast';
import { useT } from '@/i18n/provider';
import { activeIntl } from '@/i18n/active';
import { SettingsData, useDeletionRequest } from '../api';
import { Field, PanelHeader, SettingsCard } from '../components';

type Method = 'email' | 'google';

export function AccountPanel({ data }: { data: SettingsData }) {
  const t = useT();
  const { showToast } = useToast();
  const deletion = useDeletionRequest();
  const [methods, setMethods] = useState<Method[] | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  // Which ways the member can sign in, from Supabase Auth
  useEffect(() => {
    supabase.auth.getUser().then(({ data: auth }) => {
      const providers = new Set((auth.user?.identities ?? []).map((identity) => identity.provider));
      setMethods((['email', 'google'] as const).filter((method) => providers.has(method)));
    });
  }, []);

  const signOutOthers = async () => {
    setSigningOut(true);
    const { error } = await supabase.auth.signOut({ scope: 'others' });
    setSigningOut(false);
    showToast(error ? error.message : t('settings.account.signedOutOthers'), error ? 'error' : 'success');
  };

  const toggleDeletion = (requested: boolean) => {
    if (requested && !window.confirm(t('settings.account.confirmDeletion'))) return;
    deletion.mutate(requested, {
      onSuccess: () => showToast(requested ? t('settings.account.deletionSent') : t('settings.account.deletionCancelled')),
      onError: (error) => showToast(error.message, 'error'),
    });
  };

  return (
    <div className='space-y-6'>
      <PanelHeader title={t('settings.account.title')} description={t('settings.account.description')} />

      <SettingsCard title={t('settings.account.email')} description={t('settings.account.emailHint')}>
        <div className='flex items-center gap-3 rounded-lg border border-border bg-secondary/30 px-4 py-3 text-sm'>
          <Mail className='h-4 w-4 text-muted-foreground' aria-hidden />
          <span dir='ltr' className='font-medium'>{data.email}</span>
        </div>
      </SettingsCard>

      <SettingsCard title={t('settings.account.signIn')}>
        <ul className='divide-y divide-border rounded-lg border border-border'>
          {(['email', 'google'] as const).map((method) => {
            const connected = methods?.includes(method);
            return (
              <li key={method} className='flex items-center justify-between gap-3 px-4 py-3 text-sm'>
                <span className='flex items-center gap-3'>
                  {method === 'email' ? <KeyRound className='h-4 w-4 text-muted-foreground' aria-hidden /> : <GoogleMark />}
                  {t(`settings.account.methods.${method}`)}
                </span>
                {methods === null ? (
                  <Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />
                ) : connected ? (
                  <span className='inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400'>
                    <Check className='h-3.5 w-3.5' /> {t('settings.account.connected')}
                  </span>
                ) : null}
              </li>
            );
          })}
        </ul>
      </SettingsCard>

      {methods !== null && <PasswordCard email={data.email} hasPassword={methods.includes('email')} />}

      <SettingsCard title={t('settings.account.sessions')} description={t('settings.account.sessionsHint')}>
        <Button variant='outline' onClick={signOutOthers} disabled={signingOut}>
          {signingOut ? <Loader2 className='h-4 w-4 animate-spin' /> : <LogOut className='h-4 w-4 rtl:rotate-180' />}
          {t('settings.account.signOutOthers')}
        </Button>
      </SettingsCard>

      <SettingsCard title={t('settings.account.danger')} description={t('settings.account.dangerHint')} tone='danger'>
        {data.deletionRequestedAt ? (
          <div className='space-y-3'>
            <p className='rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300'>
              {t('settings.account.deletionRequested', { date: new Date(data.deletionRequestedAt).toLocaleDateString(activeIntl(), { dateStyle: 'long' }) })}
            </p>
            <Button variant='outline' onClick={() => toggleDeletion(false)} disabled={deletion.isPending}>
              {t('settings.account.cancelDeletion')}
            </Button>
          </div>
        ) : (
          <Button
            variant='outline'
            className='border-red-500/40 text-red-600 hover:bg-red-500/10 hover:text-red-600 dark:text-red-400'
            onClick={() => toggleDeletion(true)}
            disabled={deletion.isPending}
          >
            {t('settings.account.requestDeletion')}
          </Button>
        )}
      </SettingsCard>
    </div>
  );
}

/** Change (or, for Google-only members, set) the password. */
function PasswordCard({ email, hasPassword }: { email: string; hasPassword: boolean }) {
  const t = useT();
  const { showToast } = useToast();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const tooShort = next.length > 0 && next.length < 8;
  const mismatch = confirm.length > 0 && confirm !== next;
  const canSave = (!hasPassword || current.length > 0) && next.length >= 8 && confirm === next && !saving;

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSaving(true);
    try {
      if (hasPassword) {
        // Supabase doesn't check the old password, so confirm it by signing in with it
        const { error: wrong } = await supabase.auth.signInWithPassword({ email, password: current });
        if (wrong) {
          setError(t('settings.account.wrongPassword'));
          return;
        }
      }
      const { error: failed } = await supabase.auth.updateUser({ password: next });
      if (failed) {
        setError(failed.message);
        return;
      }
      setCurrent('');
      setNext('');
      setConfirm('');
      showToast(t('settings.account.passwordChanged'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave}>
      <SettingsCard
        title={hasPassword ? t('settings.account.changePassword') : t('settings.account.setPassword')}
        description={hasPassword ? undefined : t('settings.account.setPasswordHint')}
        footer={
          <Button type='submit' variant='primary' disabled={!canSave}>
            {saving && <Loader2 className='h-4 w-4 animate-spin' />}
            {t('settings.account.updatePassword')}
          </Button>
        }
      >
        <div className='grid gap-4 sm:grid-cols-2'>
          {hasPassword && (
            <div className='sm:col-span-2 sm:max-w-[calc(50%-0.5rem)]'>
              <Field label={t('settings.account.currentPassword')} htmlFor='password-current' error={error}>
                <Input id='password-current' type='password' dir='ltr' autoComplete='current-password' value={current} onChange={(event) => setCurrent(event.target.value)} />
              </Field>
            </div>
          )}
          <Field label={t('settings.account.newPassword')} htmlFor='password-new' error={tooShort ? t('settings.account.passwordTooShort') : !hasPassword ? error : null}>
            <Input id='password-new' type='password' dir='ltr' autoComplete='new-password' value={next} onChange={(event) => setNext(event.target.value)} />
          </Field>
          <Field label={t('settings.account.confirmPassword')} htmlFor='password-confirm' error={mismatch ? t('settings.account.passwordMismatch') : null}>
            <Input id='password-confirm' type='password' dir='ltr' autoComplete='new-password' value={confirm} onChange={(event) => setConfirm(event.target.value)} />
          </Field>
        </div>
      </SettingsCard>
    </form>
  );
}

const GoogleMark = () => (
  <svg viewBox='0 0 24 24' className='h-4 w-4' aria-hidden>
    <path fill='#4285F4' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z' />
    <path fill='#34A853' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z' />
    <path fill='#FBBC05' d='M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.94l3.66-2.84z' />
    <path fill='#EA4335' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z' />
  </svg>
);
