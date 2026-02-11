import { ReactNode } from 'react';
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
}

export const PageHeader = ({
  title,
  description,
  actions,
  className,
  backUrl,
  backLabel = 'Back',
  onClickBack,
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
        </div>
        {actions && <div className='flex items-center gap-3'>{actions}</div>}
      </div>
    </div>
  );
};
