import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { ContentStats, EngagementStats, MemberStats, StatsRange } from '../types';

const timezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

const useStats = <T,>(kind: 'members' | 'engagement' | 'content', range: StatsRange, enabled: boolean) =>
  useQuery({
    queryKey: ['admin', 'stats', kind, range],
    queryFn: async () => (await apiClient.get<T>(`/admin/stats/${kind}`, { params: { range, timezone: timezone() } })).data,
    placeholderData: keepPreviousData,
    enabled,
  });

export const useMemberStats = (range: StatsRange, enabled = true) => useStats<MemberStats>('members', range, enabled);
export const useEngagementStats = (range: StatsRange, enabled = true) => useStats<EngagementStats>('engagement', range, enabled);
export const useContentStats = (range: StatsRange, enabled = true) => useStats<ContentStats>('content', range, enabled);
