'use client';

import { cn } from '@/lib/utils';
import { useT } from '@/i18n/provider';
import { CONTENT_LANGUAGES, ContentLanguage, TranslatedLanguage } from '@/lib/translations';

/** Written in their own language, like the app's language switcher. */
const NAMES: Record<ContentLanguage, string> = { en: 'English', fr: 'Français', ar: 'العربية' };

interface LanguageTabsProps {
  value: ContentLanguage;
  onChange: (language: ContentLanguage) => void;
  /** Languages with missing text get a dot */
  isMissing?: (language: TranslatedLanguage) => boolean;
  className?: string;
}

/** Switches a content editor between the main (English) text and its translations. */
export const LanguageTabs = ({ value, onChange, isMissing, className }: LanguageTabsProps) => {
  const t = useT();
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold text-muted-foreground">{t('contentLanguage.label')}</span>
        <div role="tablist" className="inline-flex rounded-lg border border-border bg-secondary/40 p-0.5">
          {CONTENT_LANGUAGES.map((language) => {
            const missing = language !== 'en' && isMissing?.(language);
            return (
              <button
                key={language}
                type="button"
                role="tab"
                aria-selected={value === language}
                onClick={() => onChange(language)}
                title={missing ? t('contentLanguage.missing') : undefined}
                className={cn(
                  'relative rounded-md px-3 py-1 text-xs font-semibold transition-colors',
                  value === language ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <span lang={language}>{NAMES[language]}</span>
                {language === 'en' && <span className="ms-1 font-normal text-muted-foreground">· {t('contentLanguage.main')}</span>}
                {missing && <span aria-label={t('contentLanguage.missing')} className="absolute -top-0.5 -end-0.5 h-2 w-2 rounded-full bg-amber-500" />}
              </button>
            );
          })}
        </div>
      </div>
      {value !== 'en' && (
        <p className="text-xs text-muted-foreground">{t('contentLanguage.hint', { language: t(`contentLanguage.names.${value}`) })}</p>
      )}
    </div>
  );
};
