import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CommunityEvent } from '@/types/communityFeed';
import { isPast } from '../utils';
import { useT } from '@/i18n/provider';

const pill = 'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold';

/** Status pills: draft, cancelled, ended, full, going, locked. */
export const EventBadges = ({ event }: { event: CommunityEvent }) => {
  const t = useT();
  return (
  <div className="flex flex-wrap gap-1.5">
    {event.status === 'DRAFT' && <span className={cn(pill, 'bg-secondary text-muted-foreground')}>{t('common.draft')}</span>}
    {event.status === 'CANCELLED' && <span className={cn(pill, 'bg-red-500/10 text-red-500')}>{t('common.cancelled')}</span>}
    {event.status === 'PUBLISHED' && isPast(event) && <span className={cn(pill, 'bg-secondary text-muted-foreground')}>{t('events.ended')}</span>}
    {event.access.locked && (
      <span className={cn(pill, 'bg-amber-500/10 text-amber-600')}>
        <Lock className="w-3 h-3" /> {t('common.locked')}
      </span>
    )}
    {event.goingByMe && <span className={cn(pill, 'bg-emerald-500/10 text-emerald-600')}>{t('events.youreGoing')}</span>}
    {!event.goingByMe && event.isFull && event.status === 'PUBLISHED' && !isPast(event) && (
      <span className={cn(pill, 'bg-secondary text-muted-foreground')}>{t('events.full')}</span>
    )}
  </div>
  );
};
