'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/providers/Auth';
import { authApi } from '@/providers/Auth/api';
import { useLocale } from './provider';

/**
 * Keeps the language and the profile in step: a member's saved language wins
 * when they sign in (e.g. on a new device); members without one get the
 * language they're using now saved.
 */
export function LocaleSync() {
  const { user } = useAuth();
  const { locale, setLocale } = useLocale();
  const syncedFor = useRef<string | null>(null);

  useEffect(() => {
    if (!user || syncedFor.current === user.id) return;
    syncedFor.current = user.id;
    if (user.locale && user.locale !== locale) setLocale(user.locale);
    else if (!user.locale) authApi.setLocale(locale).catch(() => undefined);
  }, [user, locale, setLocale]);

  return null;
}
