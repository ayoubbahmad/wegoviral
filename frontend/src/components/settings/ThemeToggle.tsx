'use client';

import { useTheme, type Theme } from '@/lib/theme-context';
import { useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <label className='block text-sm font-medium text-foreground mb-3'>
          Appearance
        </label>
        <div className='flex gap-2'>
          {(['light', 'dark', 'system'] as const).map((t: Theme) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`px-4 py-2 rounded-md font-medium transition-colors capitalize ${
                theme === t
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {t === 'light' && '☀️ Light'}
              {t === 'dark' && '🌙 Dark'}
              {t === 'system' && '🖥️ System'}
            </button>
          ))}
        </div>
      </div>
      <p className='text-xs text-muted-foreground'>
        {theme === 'system'
          ? 'Using your system preference'
          : `Using ${theme} mode`}
      </p>
    </div>
  );
}
