import { intlTag, Locale } from './config';
import type { Plural, Vars } from './types';

const pluralRules = new Map<Locale, Intl.PluralRules>();
const rulesFor = (locale: Locale) => {
  if (!pluralRules.has(locale)) pluralRules.set(locale, new Intl.PluralRules(intlTag(locale)));
  return pluralRules.get(locale)!;
};

const lookup = (tree: unknown, key: string) =>
  key.split('.').reduce<unknown>((node, part) => (node && typeof node === 'object' ? (node as Record<string, unknown>)[part] : undefined), tree);

/** Fills {name} placeholders; numbers are formatted for the language. */
const fill = (text: string, locale: Locale, vars?: Vars) =>
  vars
    ? text.replace(/\{(\w+)\}/g, (match, name) => {
        const value = vars[name];
        if (value === undefined) return match;
        return typeof value === 'number' ? value.toLocaleString(intlTag(locale)) : value;
      })
    : text;

/**
 * Looks a key up in the messages, falling back to English, then to the key.
 * Plural messages pick their form from `count`.
 */
export function translate(messages: unknown, fallback: unknown, locale: Locale, key: string, vars?: Vars): string {
  const entry = lookup(messages, key) ?? lookup(fallback, key);
  if (typeof entry === 'string') return fill(entry, locale, vars);
  if (entry && typeof entry === 'object' && 'other' in entry) {
    const forms = entry as Plural;
    const count = Number(vars?.count ?? 0);
    const form = count === 0 && forms.zero ? 'zero' : rulesFor(locale).select(count);
    return fill(forms[form as keyof Plural] ?? forms.other, locale, vars);
  }
  if (process.env.NODE_ENV !== 'production') console.warn(`Missing message: ${key}`);
  return key;
}
