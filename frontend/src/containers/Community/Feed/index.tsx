'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/Button';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { useCommunityController } from '../controller';
import { FeedTab } from '../components';

export const CommunityFeedContainer = () => {
  const {
    posts,
    topPosts,
    upcomingEvents,
    spaces,
    activeSpace,
    activeSpaceId,
    postCountBySpace,
    setActiveSpaceId,
    currentUser,
    isCreatePostOpen,
    setIsCreatePostOpen,
    handleCreatePost,
    handleDeletePost,
    handleCopyPostLink,
    handleLikePost,
    handleBookmarkPost,
    handleVotePoll,
  } = useCommunityController();

  return (
    <PageContainer>
      <PageHeader
        title="Timeline"
        description="Share updates, wins and questions with the community."
        actions={
          <Button variant="primary" onClick={() => setIsCreatePostOpen(true)}>
            <Plus className="w-4 h-4" /> New post
          </Button>
        }
      />
      <FeedTab
        posts={posts}
        topPosts={topPosts}
        upcomingEvents={upcomingEvents}
        spaces={spaces}
        activeSpace={activeSpace}
        activeSpaceId={activeSpaceId}
        postCountBySpace={postCountBySpace}
        setActiveSpaceId={setActiveSpaceId}
        currentUser={currentUser}
        isCreatePostOpen={isCreatePostOpen}
        setIsCreatePostOpen={setIsCreatePostOpen}
        handleCreatePost={handleCreatePost}
        handleDeletePost={handleDeletePost}
        handleCopyPostLink={handleCopyPostLink}
        handleLikePost={handleLikePost}
        handleBookmarkPost={handleBookmarkPost}
        handleVotePoll={handleVotePoll}
      />
    </PageContainer>
  );
};
