import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { HowPointsWork, Leaderboard, LeaderboardPeriod } from '@/types/communityFeed';

export const leaderboardKeys = {
  period: (period: LeaderboardPeriod) => ['leaderboard', period] as const,
  howItWorks: ['leaderboard', 'how-it-works'] as const,
};

export const useLeaderboard = (period: LeaderboardPeriod) =>
  useQuery({
    queryKey: leaderboardKeys.period(period),
    queryFn: async () => (await apiClient.get<Leaderboard>('/leaderboard', { params: { period } })).data,
  });

/** Point rules, levels and badges. Also used by the access editors to list the levels. */
export const useHowPointsWork = (enabled = true) =>
  useQuery({
    queryKey: leaderboardKeys.howItWorks,
    queryFn: async () => (await apiClient.get<HowPointsWork>('/leaderboard/how-it-works')).data,
    staleTime: 5 * 60_000,
    enabled,
  });
