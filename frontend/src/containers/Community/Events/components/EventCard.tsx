'use client';

import { MapPin, Users, Video } from 'lucide-react';
import { Card } from '@/components/Card';
import { cn } from '@/lib/utils';
import { CommunityEvent } from '@/types/communityFeed';
import { formatEventWhen, isPast } from '../utils';
import { EventBadges } from './EventBadges';
import { useT } from '@/i18n/provider';
import { activeIntl } from '@/i18n/active';

export const EventCard = ({ event, onOpen }: { event: CommunityEvent; onOpen: () => void }) => {
  const start = new Date(event.startsAt);
  const t = useT();
  const faded = isPast(event) || event.status === 'CANCELLED';

  return (
    <Card padding="none" hover onClick={onOpen} className={cn('overflow-hidden flex flex-col', faded && 'opacity-70')}>
      {event.coverUrl ? (
        <img src={event.coverUrl} alt="" className="h-36 w-full object-cover border-b border-border" />
      ) : (
        <div className="h-2 bg-primary/80" />
      )}
      <div className="flex flex-1 gap-4 p-5">
        <div className="flex h-14 w-12 shrink-0 flex-col items-center justify-center rounded-xl border border-border bg-secondary/30">
          <span className="text-lg font-black leading-none">{start.getDate()}</span>
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {start.toLocaleDateString(activeIntl(), { month: 'short' })}
          </span>
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <EventBadges event={event} />
          <h3 className="font-bold leading-snug line-clamp-2">{event.title}</h3>
          <p className="text-xs text-muted-foreground">{formatEventWhen(event)}</p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              {event.locationType === 'ONLINE' ? <Video className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
              {event.locationType === 'ONLINE' ? t('events.online') : event.location || t('events.inPerson')}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {event.capacity
                ? t('events.goingOf', { count: event.goingCount, capacity: event.capacity })
                : t('events.going', { count: event.goingCount })}
            </span>
            {event.category && <span className="rounded-full bg-secondary/60 px-2 py-0.5">{event.category}</span>}
          </div>
        </div>
      </div>
    </Card>
  );
};
