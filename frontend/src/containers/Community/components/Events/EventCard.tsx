import { avatarFor } from '@/lib/utils';
import { CalendarDays, Users as UsersIcon } from 'lucide-react';
import { Card } from '@/components/Card';
import { CommunityEvent } from '@/types/communityFeed';

interface EventCardProps {
  event: CommunityEvent;
}

const formatEventDate = (date: string) =>
  new Date(date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

export const EventCard = ({ event }: EventCardProps) => {
  return (
    <Card>
      <Card.Header
        icon={CalendarDays}
        title={event.title}
        subtitle={formatEventDate(event.date)}
      />
      {event.description && (
        <Card.Content>
          <p className="text-sm text-muted-foreground">{event.description}</p>
        </Card.Content>
      )}
      <Card.Footer
        metadata={
          <Card.MetaItem
            icon={UsersIcon}
            label={`${event.attendeeCount} attending`}
          />
        }
        actions={
          <div className="flex items-center gap-2">
            <img
              src={avatarFor(event.createdBy)}
              alt={event.createdBy.username}
              className="w-5 h-5 rounded-full border border-border"
            />
            <span className="text-[10px] text-muted-foreground">
              @{event.createdBy.username}
            </span>
          </div>
        }
      />
    </Card>
  );
};
