'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/Button';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { FeedTab } from '../components';
import { useFeedController } from './controller';
import { useT } from '@/i18n/provider';

export const CommunityFeedContainer = () => {
  const t = useT();
  const feed = useFeedController();
  const canPostHere =
    (!feed.activeSpace?.adminOnly || feed.isStaff) && feed.canInteract && !feed.activeSpace?.access.locked;

  return (
    <PageContainer>
      <PageHeader
        title={t('feed.title')}
        description={t('feed.description')}
        actions={
          canPostHere && (
            <Button variant="primary" onClick={() => feed.setIsCreatePostOpen(true)}>
              <Plus className="w-4 h-4" /> {t('feed.newPost')}
            </Button>
          )
        }
      />
      <FeedTab feed={feed} />
    </PageContainer>
  );
};
