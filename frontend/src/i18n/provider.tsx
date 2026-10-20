'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { directionOf, intlTag, Locale, LOCALE_COOKIE } from './config';
import { setActiveLocale } from './active';
import { translate } from './translate';
import { messages, type MessageKey } from './messages';
import type { Vars } from './types';

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: MessageKey, vars?: Vars) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const saveCookie = (locale: Locale) => {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
};

/**
 * The language comes from the server (cookie, else the browser's
 * Accept-Language), so the first paint is already in the right language and
 * direction. Changing it updates the page in place.
 */
export function I18nProvider({ initialLocale, children }: { initialLocale: Locale; children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [locale, setLocaleState] = useState(initialLocale);
  setActiveLocale(locale);

  const setLocale = useCallback(
    (next: Locale) => {
      setActiveLocale(next);
      saveCookie(next);
      document.documentElement.lang = next;
      document.documentElement.dir = directionOf(next);
      setLocaleState(next);
      // Content from the server (spaces, badges, help, errors) is in the old language
      queryClient.invalidateQueries();
    },
    [queryClient],
  );

  const value = useMemo<I18nContextValue>(
    () => ({ locale, setLocale, t: (key, vars) => translate(messages[locale], messages.en, locale, key, vars) }),
    [locale, setLocale],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used inside I18nProvider');
  return context;
};

/** `const t = useT(); t('feed.createPost')` */
export const useT = () => useI18n().t;

export const useLocale = () => {
  const { locale, setLocale } = useI18n();
  return { locale, setLocale, dir: directionOf(locale), intl: intlTag(locale) };
};
