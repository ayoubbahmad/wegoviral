import { ReactNode } from 'react';
import Link from 'next/link';
import { LifeBuoy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BackNavigation } from '@/components/BackNavigation';

interface PageHeaderProps {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
  backUrl?: string;
  backLabel?: string;
  onClickBack?: () => void;
  /** Help article for this screen, e.g. "/community/help/events" */
  helpHref?: string;
}

export const PageHeader = ({
  title,
  description,
  actions,
  className,
  backUrl,
  backLabel = 'Back',
  onClickBack,
  helpHref,
}: PageHeaderProps) => {
  return (
    <div className={cn('space-y-6 mb-8', className)}>
      {(backUrl || onClickBack) && (
        <BackNavigation
          href={backUrl}
          onClick={onClickBack}
          label={backLabel}
        />
      )}

      <div className='flex flex-col md:flex-row md:items-end justify-between gap-4'>
        <div className='grow space-y-1'>
          <h1 className='text-3xl font-bold tracking-tight text-foreground'>
            {title}
          </h1>
          {description && (
            <div className='text-muted-foreground font-medium'>
              {description}
            </div>
          )}
          {helpHref && (
            <Link href={helpHref} className='inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline'>
              <LifeBuoy className='w-4 h-4' /> How does this work?
            </Link>
          )}
        </div>
        {actions && <div className='flex items-center gap-3'>{actions}</div>}
      </div>
    </div>
  );
};
