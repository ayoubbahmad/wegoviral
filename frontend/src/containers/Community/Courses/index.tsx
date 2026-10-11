'use client';

import { GraduationCap } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { EmptyState } from '@/components/EmptyState';

export const CommunityCoursesContainer = () => {
  return (
    <PageContainer>
      <PageHeader
        title="Courses"
        description="Learn from the community's playbooks, trainings and replays."
      />
      <EmptyState
        icon={GraduationCap}
        title="Courses are coming soon"
        description="Community courses and training replays will live here."
      />
    </PageContainer>
  );
};
