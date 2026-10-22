'use client';

import { useTheme, type Theme } from '@/providers/Theme';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useT } from '@/i18n/provider';

export function ThemeToggle() {
  const t = useT();
  const { theme, setTheme } = useTheme();

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <label className='block text-sm font-medium text-foreground mb-3'>
          {t('settings.appearance')}
        </label>
        <div className='flex gap-2'>
          {(['light', 'dark', 'system'] as const).map((option: Theme) => (
            <button
              key={option}
              onClick={() => setTheme(option)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                theme === option
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {option === 'light' ? <Sun className='w-4 h-4' /> : option === 'dark' ? <Moon className='w-4 h-4' /> : <Monitor className='w-4 h-4' />}
              {t(`settings.${option}`)}
            </button>
          ))}
        </div>
      </div>
      <p className='text-xs text-muted-foreground'>
        {theme === 'system' ? t('settings.usingSystem') : theme === 'light' ? t('settings.usingLight') : t('settings.usingDark')}
      </p>
    </div>
  );
}
