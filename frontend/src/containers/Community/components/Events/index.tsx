import { Plus } from 'lucide-react';
import { Button } from '@/components/Button';
import { CommunityEvent } from '@/types/communityFeed';
import { EventCard } from './EventCard';
import { CreateEventModal } from './CreateEventModal';

interface EventsTabProps {
  events: CommunityEvent[];
  handleCreateEvent: (data: { title: string; date: string; description?: string }) => void;
  isCreateEventModalOpen: boolean;
  setIsCreateEventModalOpen: (open: boolean) => void;
}

export const EventsTab = ({
  events,
  handleCreateEvent,
  isCreateEventModalOpen,
  setIsCreateEventModalOpen,
}: EventsTabProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button variant="primary" onClick={() => setIsCreateEventModalOpen(true)}>
          <Plus className="w-4 h-4" /> Create Event
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      <CreateEventModal
        isOpen={isCreateEventModalOpen}
        onClose={() => setIsCreateEventModalOpen(false)}
        onSubmit={handleCreateEvent}
      />
    </div>
  );
};
