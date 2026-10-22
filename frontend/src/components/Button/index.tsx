import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { T } from '@/i18n/T';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'pill' | 'outline' | 'ghost' | 'secondary' | 'floating';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  hoverScale?: boolean;
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
  isLoading?: boolean;
}

/**
 * Premium Button component with standardized variants and restrained professional corner radii.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      hoverScale = false,
      isLoading = false,
      children,
      disabled,
      leftSection,
      rightSection,
      ...props
    },
    ref,
  ) => {
    const variants = {
      primary:
        'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20',
      pill: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 font-black uppercase tracking-widest rounded-full',
      outline:
        'border border-border/50 bg-background hover:bg-secondary/50 text-muted-foreground hover:text-foreground',
      ghost:
        'hover:bg-secondary/50 text-muted-foreground hover:text-foreground',
      secondary:
        'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/50 font-bold',
      floating:
        'rounded-full bg-primary text-primary-foreground shadow-2xl shadow-primary/40 p-4',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base font-bold',
      icon: 'p-2',
    };

    const baseStyles =
      'inline-flex items-center justify-center gap-2 rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none';

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          size !== 'icon' && sizes[size as keyof typeof sizes],
          size === 'icon' && sizes.icon,
          hoverScale && 'hover:scale-105',
          className,
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <div className='flex items-center gap-2'>
            <div className='w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin' />
            <span><T k='common.loading' /></span>
          </div>
        ) : (
          <>
            {leftSection}
            {children}
            {rightSection}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
