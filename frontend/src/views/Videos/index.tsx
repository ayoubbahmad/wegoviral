'use client';

import { VideosContainer } from '@/containers/Videos';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';

export const VideosView = () => {
  return (
    <PageContainer>
      <PageHeader
        title='Videos'
        description="Discover what's gone viral in your niche, and why it worked."
      />
      <VideosContainer />
    </PageContainer>
  );
};
