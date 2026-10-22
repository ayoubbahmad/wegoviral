'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useT } from '@/i18n/provider';
import { SECTION_ICONS, SETTINGS_SECTIONS } from './sections';

/** The settings menu: a side column on wide screens, a full list to tap into on phones. */
export function SettingsNav({ variant = 'side', className }: { variant?: 'side' | 'list'; className?: string }) {
  const t = useT();
  const pathname = usePathname();
  const active = SETTINGS_SECTIONS.find((section) => pathname === `/settings/${section}`) ?? (pathname === '/settings' ? 'profile' : null);

  return (
    <nav aria-label={t('settings.title')} className={className}>
      <ul className={cn(variant === 'list' ? 'divide-y divide-border rounded-2xl border border-border bg-card' : 'space-y-1')}>
        {SETTINGS_SECTIONS.map((section) => {
          const Icon = SECTION_ICONS[section];
          const isActive = variant === 'side' && active === section;
          return (
            <li key={section}>
              <Link
                href={`/settings/${section}`}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors',
                  variant === 'list' && 'rounded-none px-4 py-4',
                  isActive ? 'bg-secondary font-semibold text-foreground' : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground',
                )}
              >
                <Icon className='h-4 w-4 shrink-0' aria-hidden />
                <span className='min-w-0 flex-1'>
                  <span className='block'>{t(`settings.sections.${section}.label`)}</span>
                  {variant === 'list' && <span className='block text-xs text-muted-foreground'>{t(`settings.sections.${section}.hint`)}</span>}
                </span>
                {variant === 'list' && <ChevronRight className='h-4 w-4 text-muted-foreground rtl:rotate-180' aria-hidden />}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
