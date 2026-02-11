import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackNavigationProps {
  href: string;
  label: string;
  className?: string;
}

export const BackNavigation = ({
  href,
  label,
  className,
}: BackNavigationProps) => {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all group',
        className,
      )}
    >
      <ChevronLeft className='w-4 h-4 group-hover:-translate-x-1 transition-transform' />
      {label}
    </Link>
  );
};
