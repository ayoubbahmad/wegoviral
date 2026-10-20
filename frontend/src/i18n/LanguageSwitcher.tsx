'use client';

import { Languages } from 'lucide-react';
import { useAuth } from '@/providers/Auth';
import { authApi } from '@/providers/Auth/api';
import { cn } from '@/lib/utils';
import { LOCALE_NAMES, LOCALES, Locale } from './config';
import { useLocale, useT } from './provider';

/** Picks the app language; saved on the profile when signed in. */
export function LanguageSwitcher({ compact = false, className }: { compact?: boolean; className?: string }) {
  const t = useT();
  const { user } = useAuth();
  const { locale, setLocale } = useLocale();

  const change = (next: Locale) => {
    setLocale(next);
    if (user) authApi.setLocale(next).catch(() => undefined);
  };

  return (
    <label className={cn('flex items-center gap-2 text-sm text-muted-foreground', className)} title={t('common.language')}>
      <Languages className="h-4 w-4 shrink-0" aria-hidden />
      <span className="sr-only">{t('common.language')}</span>
      <select
        value={locale}
        onChange={(event) => change(event.target.value as Locale)}
        className={cn(
          'cursor-pointer rounded-lg border border-border bg-background py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20',
          compact ? 'w-14 px-1' : 'px-2',
        )}
      >
        {LOCALES.map((option) => (
          <option key={option} value={option}>
            {compact ? option.toUpperCase() : LOCALE_NAMES[option]}
          </option>
        ))}
      </select>
    </label>
  );
}
