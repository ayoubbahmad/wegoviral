'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Card } from '@/components/Card';
import { cn } from '@/lib/utils';
import { useT } from '@/i18n/provider';

/** Heading of a settings panel, with a way back to the menu on phones. */
export function PanelHeader({ title, description }: { title: string; description: string }) {
  const t = useT();
  return (
    <div className='space-y-3'>
      <Link href='/settings' className='inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground md:hidden'>
        <ChevronLeft className='h-4 w-4 rtl:rotate-180' aria-hidden /> {t('settings.back')}
      </Link>
      <div>
        <h2 className='text-xl font-bold tracking-tight'>{title}</h2>
        <p className='mt-1 text-sm text-muted-foreground'>{description}</p>
      </div>
    </div>
  );
}

/** One group of settings: a card with a title, an optional hint and the controls. */
export function SettingsCard({ title, description, children, footer, tone = 'default' }: {
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  tone?: 'default' | 'danger';
}) {
  return (
    <Card padding='none' className={cn(tone === 'danger' && 'border-red-500/30')}>
      <div className='space-y-4 p-6'>
        {(title || description) && (
          <div>
            {title && <h3 className={cn('font-semibold', tone === 'danger' && 'text-red-600 dark:text-red-400')}>{title}</h3>}
            {description && <p className='mt-1 text-sm text-muted-foreground'>{description}</p>}
          </div>
        )}
        {children}
      </div>
      {footer && <div className='flex flex-wrap items-center justify-end gap-3 border-t border-border px-6 py-4'>{footer}</div>}
    </Card>
  );
}

/** A labelled form field with an optional hint or error under it. */
export function Field({ label, htmlFor, hint, error, children }: { label: string; htmlFor?: string; hint?: ReactNode; error?: string | null; children: ReactNode }) {
  return (
    <div className='space-y-1.5'>
      <label htmlFor={htmlFor} className='block text-sm font-medium'>{label}</label>
      {children}
      {error ? <p className='text-xs text-red-600 dark:text-red-400'>{error}</p> : hint ? <p className='text-xs text-muted-foreground'>{hint}</p> : null}
    </div>
  );
}
