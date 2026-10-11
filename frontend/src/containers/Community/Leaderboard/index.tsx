'use client';

import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { useCommunityController } from '../controller';
import { LeaderBoardTab } from '../components';

export const CommunityLeaderboardContainer = () => {
  const { leaderboard } = useCommunityController();

  return (
    <PageContainer>
      <PageHeader
        title="Leaderboard"
        description="See who's leading the community this month."
      />
      <LeaderBoardTab leaderboard={leaderboard} />
    </PageContainer>
  );
};
