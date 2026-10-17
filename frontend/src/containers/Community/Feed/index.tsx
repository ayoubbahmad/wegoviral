'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/Button';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { FeedTab } from '../components';
import { useFeedController } from './controller';

export const CommunityFeedContainer = () => {
  const feed = useFeedController();
  const canPostHere = (!feed.activeSpace?.adminOnly || feed.isStaff) && !feed.isMuted;

  return (
    <PageContainer>
      <PageHeader
        title="Timeline"
        description="Share updates, wins and questions with the community."
        actions={
          canPostHere && (
            <Button variant="primary" onClick={() => feed.setIsCreatePostOpen(true)}>
              <Plus className="w-4 h-4" /> New post
            </Button>
          )
        }
      />
      <FeedTab feed={feed} />
    </PageContainer>
  );
};
