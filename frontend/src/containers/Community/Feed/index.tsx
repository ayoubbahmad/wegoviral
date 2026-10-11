'use client';

import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { useCommunityController } from '../controller';
import { FeedTab } from '../components';

export const CommunityFeedContainer = () => {
  const { posts, handleCreatePost, handleLikePost } = useCommunityController();

  return (
    <PageContainer>
      <PageHeader
        title="Timeline"
        description="Share updates, wins and questions with the community."
      />
      <FeedTab
        posts={posts}
        handleCreatePost={handleCreatePost}
        handleLikePost={handleLikePost}
      />
    </PageContainer>
  );
};
