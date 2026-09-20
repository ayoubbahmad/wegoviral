'use client';

import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { Tabs } from '@/components/Tabs';
import { useCommunityController } from './controller';
import { FeedTab, EventsTab, LeaderBoardTab } from './components';
import { COMMUNITY_TABS, CommunityTabId } from './constants';

export const CommunityContainer = () => {
  const {
    activeTab,
    setActiveTab,
    posts,
    handleCreatePost,
    handleLikePost,
    events,
    handleCreateEvent,
    isCreateEventModalOpen,
    setIsCreateEventModalOpen,
    leaderboard,
  } = useCommunityController();

  return (
    <PageContainer>
      <PageHeader
        title="Community"
        description="Connect with other creators — share updates, host events, and climb the leaderboard."
      />

      <Tabs
        activeId={activeTab}
        onChange={(id) => setActiveTab(id as CommunityTabId)}
        items={[...COMMUNITY_TABS]}
        containerClassName="!justify-start"
      />

      {activeTab === 'Feed' && (
        <FeedTab
          posts={posts}
          handleCreatePost={handleCreatePost}
          handleLikePost={handleLikePost}
        />
      )}
      {activeTab === 'Events' && (
        <EventsTab
          events={events}
          handleCreateEvent={handleCreateEvent}
          isCreateEventModalOpen={isCreateEventModalOpen}
          setIsCreateEventModalOpen={setIsCreateEventModalOpen}
        />
      )}
      {activeTab === 'LeaderBoard' && <LeaderBoardTab leaderboard={leaderboard} />}
    </PageContainer>
  );
};
