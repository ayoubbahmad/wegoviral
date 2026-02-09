import { cn } from '@/lib/utils';
import { BadgeProps, BadgeVariant, BadgeShape } from './types';

/**
 * Premium Badge component for status, labels, and feedback.
 */
export const Badge = ({
  children,
  variant = 'primary',
  shape = 'rounded',
  icon: Icon,
  className,
  onClick,
}: BadgeProps) => {
  const variantMap: Record<BadgeVariant, string> = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    secondary: 'bg-secondary text-secondary-foreground border-border',
    success: 'bg-green-500/10 text-green-500 border-green-500/20',
    info: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    warning: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    error: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  const shapeMap: Record<BadgeShape, string> = {
    rounded: 'rounded-md',
    pill: 'rounded-full',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest border transition-all',
        variantMap[variant],
        shapeMap[shape],
        onClick && 'cursor-pointer hover:opacity-80 active:scale-95',
        className,
      )}
    >
      {Icon && <Icon className='w-3 h-3' />}
      {children}
    </div>
  );
};
