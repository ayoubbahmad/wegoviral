/** Languages the app speaks (docs/ADMIN_ROADMAP.md, Phase 12). */
export const LOCALES = ['en', 'fr', 'ar'] as const;
export type Locale = (typeof LOCALES)[number];

/** Used when the browser asks for none of our languages. */
export const FALLBACK_LOCALE: Locale = 'fr';
export const LOCALE_COOKIE = 'wgv_locale';

export const LOCALE_NAMES: Record<Locale, string> = { en: 'English', fr: 'Français', ar: 'العربية' };

export const isLocale = (value: unknown): value is Locale => LOCALES.includes(value as Locale);

export const directionOf = (locale: Locale) => (locale === 'ar' ? 'rtl' : 'ltr');

/** The tag for Intl: Arabic keeps Western digits, as used in Morocco. */
export const intlTag = (locale: Locale) => (locale === 'ar' ? 'ar-u-nu-latn' : locale);

/** Picks our best language from an Accept-Language header or navigator.languages. */
export function pickLocale(preferences: readonly string[] | string | null | undefined): Locale {
  const list = typeof preferences === 'string'
    ? preferences.split(',').map((part) => part.split(';')[0].trim())
    : preferences ?? [];
  for (const tag of list) {
    const base = tag.toLowerCase().split('-')[0];
    if (isLocale(base)) return base;
  }
  return FALLBACK_LOCALE;
}
