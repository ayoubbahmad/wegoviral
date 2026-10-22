'use client';

import { VideosContainer } from '@/containers/Videos';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { useT } from '@/i18n/provider';

export const VideosView = () => {
  const t = useT();
  return (
    <PageContainer>
      <PageHeader
        title={t('creator.videos.title')}
        description={t('creator.videos.description')}
      />
      <VideosContainer />
    </PageContainer>
  );
};
