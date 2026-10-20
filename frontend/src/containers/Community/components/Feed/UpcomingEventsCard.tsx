import Link from 'next/link';
import { Card } from '@/components/Card';
import { CommunityEvent } from '@/types/communityFeed';
import { useT } from '@/i18n/provider';
import { activeIntl } from '@/i18n/active';

interface UpcomingEventsCardProps {
  events: CommunityEvent[];
}

const formatTime = (date: string) =>
  new Date(date).toLocaleTimeString(activeIntl(), { hour: 'numeric', minute: '2-digit' });

export const UpcomingEventsCard = ({ events }: UpcomingEventsCardProps) => {
  const t = useT();
  return (
    <Card padding="sm" className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-sm">{t('feed.upcoming.title')}</h3>
        <Link
          href="/community/events"
          className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
        >
          {t('feed.upcoming.seeAll')}
        </Link>
      </div>

      {events.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('feed.upcoming.empty')}</p>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => {
            const date = new Date(event.startsAt);
            return (
              <li key={event.id}>
                <Link href={`/community/events?event=${event.id}`} className="group flex items-start gap-3">
                  <div className="flex w-12 shrink-0 flex-col items-center rounded-xl border border-border bg-secondary/30 py-1.5">
                    <span className="text-base font-black leading-none">{date.getDate()}</span>
                    <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {date.toLocaleDateString(activeIntl(), { month: 'short' })}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {event.title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatTime(event.startsAt)} · {t('feed.upcoming.going', { count: event.goingCount })}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
};
