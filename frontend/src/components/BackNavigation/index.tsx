import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { T } from '@/i18n/T';

interface BackNavigationProps {
  href?: string;
  /** Defaults to "Back" in the app's language */
  label?: string;
  className?: string;
  onClick?: () => void;
}

export const BackNavigation = ({
  href,
  label,
  className,
  onClick,
}: BackNavigationProps) => {
  const content = (
    <>
      <ChevronLeft className='w-4 h-4 group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1 transition-transform' />
      {label ?? <T k='common.back' />}
    </>
  );

  const classes = cn(
    'inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all group',
    className,
  );

  if (onClick) {
    return (
      <button onClick={onClick} className={classes}>
        {content}
      </button>
    );
  }

  return (
    <Link href={href || '#'} className={classes}>
      {content}
    </Link>
  );
};
