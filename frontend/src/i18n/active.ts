import { FALLBACK_LOCALE, intlTag, Locale } from './config';

/**
 * The language in use, for plain helpers outside React (date formatting, the
 * API client). The provider keeps it up to date.
 */
let active: Locale = FALLBACK_LOCALE;

export const setActiveLocale = (locale: Locale) => {
  active = locale;
};
export const activeLocale = () => active;
export const activeIntl = () => intlTag(active);
