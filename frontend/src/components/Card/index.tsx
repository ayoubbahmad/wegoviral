import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'secondary' | 'dashed';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  onClick?: () => void;
}

/**
 * Premium Card component with multiple variants and hover effects.
 */
export const Card = ({
  children,
  className,
  variant = 'default',
  padding = 'md',
  hover = false,
  onClick,
}: CardProps) => {
  const paddingMap = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const variantMap = {
    default: 'bg-card border-border',
    glass: 'bg-card/30 backdrop-blur-md border-border/50',
    secondary: 'bg-secondary/20 border-border/50',
    dashed: 'bg-transparent border-dashed border-border/50',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-2xl border transition-all duration-300 relative group',
        variantMap[variant],
        paddingMap[padding],
        hover &&
          'hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 hover:scale-[1.01] cursor-pointer',
        className,
      )}
    >
      {children}
    </div>
  );
};

/**
 * Card Header slot: Icon, Title, and Top Actions
 */
Card.Header = ({
  icon: Icon,
  title,
  subtitle,
  actions,
  children,
  className,
}: {
  icon?: any;
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
}) => (
  <div className={cn('flex items-start justify-between mb-4', className)}>
    <div className='flex items-center gap-3 min-w-0'>
      {children}
      {!children && Icon && (
        <div className='p-2.5 rounded-xl bg-primary/10 text-primary flex-shrink-0'>
          <Icon className='w-5 h-5' />
        </div>
      )}
      {!children && (
        <div className='min-w-0'>
          {title && (
            <h3 className='font-bold text-foreground truncate'>{title}</h3>
          )}
          {subtitle && (
            <p className='text-[10px] uppercase font-black tracking-widest text-muted-foreground/60 truncate'>
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
    {actions && (
      <div className='flex items-center gap-2 flex-shrink-0'>{actions}</div>
    )}
  </div>
);

/**
 * Card Content slot: The main body of the card
 */
Card.Content = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => <div className={cn('flex-1', className)}>{children}</div>;

/**
 * Card Footer slot: Bottom bar for Metadata and Actions
 */
Card.Footer = ({
  metadata,
  actions,
  className,
}: {
  metadata?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      'mt-auto pt-4 border-t border-border/30 flex items-center justify-between',
      className,
    )}
  >
    <div className='flex items-center gap-4 text-[10px] font-bold text-muted-foreground'>
      {metadata}
    </div>
    <div className='flex items-center gap-1'>{actions}</div>
  </div>
);

/**
 * Standardized Card Meta Item for Footers
 */
Card.MetaItem = ({
  icon: Icon,
  label,
  className,
}: {
  icon?: any;
  label: ReactNode;
  className?: string;
}) => (
  <div className={cn('flex items-center gap-1.5', className)}>
    {Icon && <Icon className='w-3 h-3 text-muted-foreground/60' />}
    <span>{label}</span>
  </div>
);
