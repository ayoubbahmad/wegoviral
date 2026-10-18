import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CommunityEvent } from '@/types/communityFeed';
import { isPast } from '../utils';

const pill = 'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold';

/** Status pills: draft, cancelled, ended, full, going, locked. */
export const EventBadges = ({ event }: { event: CommunityEvent }) => (
  <div className="flex flex-wrap gap-1.5">
    {event.status === 'DRAFT' && <span className={cn(pill, 'bg-secondary text-muted-foreground')}>Draft</span>}
    {event.status === 'CANCELLED' && <span className={cn(pill, 'bg-red-500/10 text-red-500')}>Cancelled</span>}
    {event.status === 'PUBLISHED' && isPast(event) && <span className={cn(pill, 'bg-secondary text-muted-foreground')}>Ended</span>}
    {event.access.locked && (
      <span className={cn(pill, 'bg-amber-500/10 text-amber-600')}>
        <Lock className="w-3 h-3" /> Locked
      </span>
    )}
    {event.goingByMe && <span className={cn(pill, 'bg-emerald-500/10 text-emerald-600')}>You&apos;re going</span>}
    {!event.goingByMe && event.isFull && event.status === 'PUBLISHED' && !isPast(event) && (
      <span className={cn(pill, 'bg-secondary text-muted-foreground')}>Full</span>
    )}
  </div>
);
