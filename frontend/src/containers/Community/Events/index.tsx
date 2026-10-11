'use client';

import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { useCommunityController } from '../controller';
import { EventsTab } from '../components';

export const CommunityEventsContainer = () => {
  const {
    events,
    handleCreateEvent,
    isCreateEventModalOpen,
    setIsCreateEventModalOpen,
  } = useCommunityController();

  return (
    <PageContainer>
      <PageHeader
        title="Events"
        description="Live sessions, meetups and workshops hosted by the community."
      />
      <EventsTab
        events={events}
        handleCreateEvent={handleCreateEvent}
        isCreateEventModalOpen={isCreateEventModalOpen}
        setIsCreateEventModalOpen={setIsCreateEventModalOpen}
      />
    </PageContainer>
  );
};
