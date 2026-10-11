'use client';

import { Users } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { EmptyState } from '@/components/EmptyState';

export const CommunityMembersContainer = () => {
  return (
    <PageContainer>
      <PageHeader
        title="Members"
        description="Find and connect with other creators in the community."
      />
      <EmptyState
        icon={Users}
        title="Member directory is coming soon"
        description="Browse members, see what they create and connect with them."
      />
    </PageContainer>
  );
};
