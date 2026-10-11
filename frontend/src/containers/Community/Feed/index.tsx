'use client';

import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { useCommunityController } from '../controller';
import { FeedTab } from '../components';

export const CommunityFeedContainer = () => {
  const {
    posts,
    spaces,
    activeSpace,
    activeSpaceId,
    postCountBySpace,
    setActiveSpaceId,
    handleCreatePost,
    handleLikePost,
  } = useCommunityController();

  return (
    <PageContainer>
      <PageHeader
        title="Timeline"
        description="Share updates, wins and questions with the community."
      />
      <FeedTab
        posts={posts}
        spaces={spaces}
        activeSpace={activeSpace}
        activeSpaceId={activeSpaceId}
        postCountBySpace={postCountBySpace}
        setActiveSpaceId={setActiveSpaceId}
        handleCreatePost={handleCreatePost}
        handleLikePost={handleLikePost}
      />
    </PageContainer>
  );
};
