import { AsyncLocalStorage } from 'node:async_hooks';
import { z } from 'zod';
import type { Locale } from './i18n';

/**
 * Team-written content (spaces, badges, levels, the guide, the quiz, help articles) keeps its main
 * version in the regular fields (English) and the other languages in a `translations` column:
 * { fr: { name: '…' }, ar: { name: '…' } }. Empty or missing translations fall back to the main text.
 */
export type Translations = Partial<Record<Locale, Record<string, string | string[]>>>;

const requestLocale = new AsyncLocalStorage<Locale>();

export const runWithLocale = <T>(locale: Locale, fn: () => T) => requestLocale.run(locale, fn);

/** The language of the request being handled ('en' outside a request). */
export const currentLocale = (): Locale => requestLocale.getStore() ?? 'en';

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (!value || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
};

const pick = (base: unknown, translated: unknown): unknown => {
  if (typeof translated === 'string') return translated.trim() ? translated : base;
  if (Array.isArray(base) && Array.isArray(translated)) {
    return base.map((item, index) => pick(item, translated[index]));
  }
  return base;
};

/** One record in the given language, without its `translations` field. */
export function localizeRecord<T extends Record<string, unknown>>(record: T, locale: Locale = currentLocale()): T {
  const { translations, ...rest } = record as T & { translations?: unknown };
  const result: Record<string, unknown> = rest;
  const own = isPlainObject(translations) ? translations[locale] : undefined;
  if (isPlainObject(own)) {
    for (const [field, value] of Object.entries(own)) {
      if (field in result) result[field] = pick(result[field], value);
    }
  }
  return result as T;
}

/** Walks a response body and puts every record that has `translations` in the given language. */
export function localizeTree(value: unknown, locale: Locale): unknown {
  if (Array.isArray(value)) return value.map((item) => localizeTree(item, locale));
  if (!isPlainObject(value)) return value;
  const record = 'translations' in value ? localizeRecord(value, locale) : value;
  const result: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(record)) result[key] = localizeTree(item, locale);
  return result;
}

/** Validates the `translations` field the team sends with a space, badge, level, guide, quiz or article. */
export const translationsSchema = (fields: Record<string, z.ZodType<string | string[]>>) =>
  z.object({
    fr: z.object(fields).partial().optional(),
    ar: z.object(fields).partial().optional(),
  });
