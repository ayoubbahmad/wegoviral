import type { ChangeEvent } from 'react';

/**
 * Team-written content (spaces, badges, levels, the guide, the quiz, help articles) keeps its main
 * version (English) in the regular fields and the other languages in `translations`. The API puts it
 * in the reader's language; editors get every language and switch between them with LanguageTabs.
 */
export type ContentLanguage = 'en' | 'fr' | 'ar';
export type TranslatedLanguage = Exclude<ContentLanguage, 'en'>;
export type Translations = Partial<Record<TranslatedLanguage, Record<string, string | string[] | undefined>>>;

export const CONTENT_LANGUAGES: ContentLanguage[] = ['en', 'fr', 'ar'];
export const TRANSLATED_LANGUAGES: TranslatedLanguage[] = ['fr', 'ar'];

type Translatable = { translations?: Translations };

/** The text of one field in a language ('en' is the main version). */
export function readField<T extends Translatable>(item: T, field: keyof T & string, language: ContentLanguage): string {
  if (language === 'en') return String(item[field] ?? '');
  const value = item.translations?.[language]?.[field];
  return typeof value === 'string' ? value : '';
}

export function writeField<T extends Translatable>(item: T, field: keyof T & string, language: ContentLanguage, value: string): T {
  if (language === 'en') return { ...item, [field]: value };
  return { ...item, translations: { ...item.translations, [language]: { ...item.translations?.[language], [field]: value } } };
}

/** One entry of a list field (quiz options), with the same fallback rules. */
export function readListItem<T extends Translatable>(item: T, field: keyof T & string, index: number, language: ContentLanguage): string {
  if (language === 'en') return String((item[field] as string[] | undefined)?.[index] ?? '');
  const list = item.translations?.[language]?.[field];
  return Array.isArray(list) ? (list[index] ?? '') : '';
}

export function writeListItem<T extends Translatable>(item: T, field: keyof T & string, index: number, language: ContentLanguage, value: string): T {
  if (language === 'en') {
    const list = [...((item[field] as string[] | undefined) ?? [])];
    list[index] = value;
    return { ...item, [field]: list };
  }
  const current = item.translations?.[language]?.[field];
  const list = Array.isArray(current) ? [...current] : [];
  for (let i = 0; i < index; i++) list[i] ??= '';
  list[index] = value;
  return { ...item, translations: { ...item.translations, [language]: { ...item.translations?.[language], [field]: list } } };
}

/** Removes one entry of a list field in every language (a deleted quiz option). */
export function removeListItem<T extends Translatable>(item: T, field: keyof T & string, index: number): T {
  const translations: Translations = { ...item.translations };
  for (const language of TRANSLATED_LANGUAGES) {
    const list = translations[language]?.[field];
    if (Array.isArray(list)) translations[language] = { ...translations[language], [field]: list.filter((_, i) => i !== index) };
  }
  return { ...item, [field]: ((item[field] as string[] | undefined) ?? []).filter((_, i) => i !== index), translations };
}

/** True when every listed field has text in that language (used to flag missing translations). */
export function isTranslated<T extends Translatable>(item: T, fields: (keyof T & string)[], language: TranslatedLanguage) {
  return fields.every((field) => {
    const main = item[field];
    if (Array.isArray(main)) return main.every((_, index) => !String(main[index] ?? '').trim() || readListItem(item, field, index, language).trim());
    return !String(main ?? '').trim() || readField(item, field, language).trim();
  });
}

/**
 * Props for a text input bound to one field in the language being edited. While translating, the
 * main text shows as the placeholder so the team sees what to translate (and what shows if left empty).
 */
export function bindField<T extends Translatable>(item: T, setItem: (next: T) => void, language: ContentLanguage) {
  return (field: keyof T & string, placeholder?: string) => ({
    value: readField(item, field, language),
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setItem(writeField(item, field, language, event.target.value)),
    placeholder: language === 'en' ? placeholder : String(item[field] ?? ''),
    dir: language === 'ar' ? ('rtl' as const) : ('ltr' as const),
    lang: language,
  });
}

/** Drops empty translations before saving, so nothing blank is stored. */
export function cleanTranslations(translations: Translations | undefined): Translations {
  const result: Translations = {};
  for (const language of TRANSLATED_LANGUAGES) {
    const fields = Object.entries(translations?.[language] ?? {}).filter(([, value]) =>
      Array.isArray(value) ? value.some((entry) => entry.trim()) : Boolean(value?.trim()),
    );
    if (fields.length) result[language] = Object.fromEntries(fields);
  }
  return result;
}
