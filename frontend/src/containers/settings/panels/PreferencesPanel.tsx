'use client';

import { Check, Globe2, Monitor, Moon, Sun } from 'lucide-react';
import { Switch } from '@/components/Switch';
import { cn } from '@/lib/utils';
import { useTheme } from '@/providers/Theme';
import { useToast } from '@/providers/Toast';
import { authApi } from '@/providers/Auth/api';
import { useLocale, useT } from '@/i18n/provider';
import { LOCALE_NAMES, LOCALES, Locale } from '@/i18n/config';
import { SettingsData, ThemePreference, useUpdatePreferences } from '../api';
import { PanelHeader, SettingsCard } from '../components';

const THEMES = [
  { id: 'light', icon: Sun },
  { id: 'dark', icon: Moon },
  { id: 'system', icon: Monitor },
] as const;

/** A row of choice cards (language, theme) */
function ChoiceGrid({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div role='radiogroup' aria-label={label} className='grid gap-3 sm:grid-cols-3'>
      {children}
    </div>
  );
}

function Choice({ selected, onSelect, children }: { selected: boolean; onSelect: () => void; children: React.ReactNode }) {
  return (
    <button
      type='button'
      role='radio'
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        'relative flex items-center gap-3 rounded-xl border p-4 text-start transition-colors',
        selected ? 'border-primary bg-primary/5' : 'border-border hover:bg-secondary/50',
      )}
    >
      {children}
      {selected && <Check className='absolute end-3 top-3 h-4 w-4 text-primary' aria-hidden />}
    </button>
  );
}

export function PreferencesPanel({ data }: { data: SettingsData }) {
  const t = useT();
  const { showToast } = useToast();
  const { locale, setLocale } = useLocale();
  const { theme, setTheme } = useTheme();
  const save = useUpdatePreferences();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const onError = (error: Error) => showToast(error.message, 'error');

  const chooseLanguage = (next: Locale) => {
    setLocale(next);
    authApi.setLocale(next).catch(() => undefined);
  };

  const chooseTheme = (next: ThemePreference) => {
    setTheme(next);
    save.mutate({ theme: next }, { onError });
  };

  return (
    <div className='space-y-6'>
      <PanelHeader title={t('settings.preferences.title')} description={t('settings.preferences.description')} />

      <SettingsCard title={t('settings.preferences.language')} description={t('settings.preferences.languageHint')}>
        <ChoiceGrid label={t('settings.preferences.language')}>
          {LOCALES.map((option) => (
            <Choice key={option} selected={locale === option} onSelect={() => chooseLanguage(option)}>
              <span lang={option} className='font-semibold'>{LOCALE_NAMES[option]}</span>
            </Choice>
          ))}
        </ChoiceGrid>
      </SettingsCard>

      <SettingsCard title={t('settings.preferences.theme')}>
        <ChoiceGrid label={t('settings.preferences.theme')}>
          {THEMES.map(({ id, icon: Icon }) => (
            <Choice key={id} selected={theme === id} onSelect={() => chooseTheme(id)}>
              <span className='rounded-lg bg-secondary p-2'>
                <Icon className='h-4 w-4' aria-hidden />
              </span>
              <span>
                <span className='block text-sm font-semibold'>{t(`settings.preferences.themes.${id}`)}</span>
                <span className='block text-xs text-muted-foreground'>{t(`settings.preferences.themeHints.${id}`)}</span>
              </span>
            </Choice>
          ))}
        </ChoiceGrid>
      </SettingsCard>

      <SettingsCard title={t('settings.preferences.motion')}>
        <Switch
          checked={Boolean(data.preferences.reducedMotion)}
          onChange={(reducedMotion) => save.mutate({ reducedMotion }, { onError })}
          label={t('settings.preferences.motion')}
          description={t('settings.preferences.motionHint')}
          disabled={save.isPending}
        />
      </SettingsCard>

      <SettingsCard title={t('settings.preferences.timeZone')}>
        <p className='flex items-start gap-3 text-sm text-muted-foreground'>
          <Globe2 className='mt-0.5 h-4 w-4 shrink-0' aria-hidden />
          <span>{t('settings.preferences.timeZoneHint', { zone: timeZone })}</span>
        </p>
      </SettingsCard>
    </div>
  );
}
