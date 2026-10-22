'use client';

import { useId } from 'react';
import { cn } from '@/lib/utils';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

/** An on/off setting: label and hint on one side, the switch on the other. */
export const Switch = ({ checked, onChange, label, description, disabled, className }: SwitchProps) => {
  const id = useId();
  return (
    <div className={cn('flex items-start justify-between gap-4', className)}>
      <label htmlFor={id} className='cursor-pointer'>
        <span className='block text-sm font-semibold'>{label}</span>
        {description && <span className='mt-0.5 block text-xs text-muted-foreground'>{description}</span>}
      </label>
      <button
        id={id}
        type='button'
        role='switch'
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-50',
          checked ? 'bg-primary' : 'bg-secondary',
        )}
      >
        <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-background shadow transition-all', checked ? 'start-[22px]' : 'start-0.5')} />
      </button>
    </div>
  );
};
