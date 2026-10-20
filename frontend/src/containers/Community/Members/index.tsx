'use client';

import { Users } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { EmptyState } from '@/components/EmptyState';
import { useT } from '@/i18n/provider';

export const CommunityMembersContainer = () => {
  const t = useT();
  return (
    <PageContainer>
      <PageHeader
        title={t('members.title')}
        description={t('members.description')}
      />
      <EmptyState
        icon={Users}
        title={t('members.soonTitle')}
        description={t('members.soonBody')}
      />
    </PageContainer>
  );
};
