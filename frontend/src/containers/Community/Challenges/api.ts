import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import {
  ChallengeDetail,
  ChallengeInput,
  ChallengeLeaderboard,
  ChallengeScope,
  ChallengeSummary,
  CheckIn,
} from '@/types/challenges';
import type { AccessRuleInput } from '../Events/api';

export const challengeKeys = {
  all: ['challenges'] as const,
  list: (scope: ChallengeScope) => ['challenges', 'list', scope] as const,
  detail: (id: string) => ['challenges', 'detail', id] as const,
  checkIns: (id: string) => ['challenges', 'check-ins', id] as const,
  leaderboard: (id: string) => ['challenges', 'leaderboard', id] as const,
  access: (id: string) => ['challenges', 'access', id] as const,
};

export const useChallenges = (scope: ChallengeScope) =>
  useQuery({
    queryKey: challengeKeys.list(scope),
    queryFn: async () => (await apiClient.get<ChallengeSummary[]>('/challenges', { params: { scope } })).data,
  });

export const useChallenge = (id: string) =>
  useQuery({
    queryKey: challengeKeys.detail(id),
    queryFn: async () => (await apiClient.get<ChallengeDetail>(`/challenges/${id}`)).data,
  });

export const useCheckIns = (id: string, enabled: boolean) =>
  useInfiniteQuery({
    queryKey: challengeKeys.checkIns(id),
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }) =>
      (await apiClient.get<{ checkIns: CheckIn[]; nextCursor: string | null }>(`/challenges/${id}/check-ins`, { params: { cursor: pageParam } })).data,
    getNextPageParam: (page) => page.nextCursor ?? undefined,
    enabled,
  });

export const useChallengeLeaderboard = (id: string, enabled: boolean) =>
  useQuery({
    queryKey: challengeKeys.leaderboard(id),
    queryFn: async () => (await apiClient.get<ChallengeLeaderboard>(`/challenges/${id}/leaderboard`)).data,
    enabled,
  });

/** Everything about challenges, plus points on the main leaderboard. */
const useRefresh = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: challengeKeys.all });
    queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
  };
};

export const useSaveChallenge = () => {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: async ({ id, input }: { id?: string; input: ChallengeInput }) =>
      (id ? await apiClient.patch<ChallengeDetail>(`/challenges/${id}`, input) : await apiClient.post<ChallengeDetail>('/challenges', input)).data,
    onSuccess: refresh,
  });
};

export const useDeleteChallenge = () => {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: async (id: string) => (await apiClient.delete(`/challenges/${id}`)).data,
    onSuccess: refresh,
  });
};

export const useJoinChallenge = () => {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: async ({ id, join }: { id: string; join: boolean }) =>
      (join ? await apiClient.put<ChallengeDetail>(`/challenges/${id}/join`) : await apiClient.delete<ChallengeDetail>(`/challenges/${id}/join`)).data,
    onSuccess: refresh,
  });
};

export const useCheckIn = () => {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: { content: string; imageUrl?: string | null; link?: string | null } }) =>
      (await apiClient.post<ChallengeDetail>(`/challenges/${id}/check-ins`, input)).data,
    onSuccess: refresh,
  });
};

export const useDeleteCheckIn = () => {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: async ({ id, checkInId }: { id: string; checkInId: string }) => (await apiClient.delete(`/challenges/${id}/check-ins/${checkInId}`)).data,
    onSuccess: refresh,
  });
};

export const useSetWinners = () => {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: { mode: 'manual'; userIds: string[] } | { mode: 'top'; count: number } | { mode: 'clear' } }) =>
      (await apiClient.put<ChallengeDetail>(`/challenges/${id}/winners`, input)).data,
    onSuccess: refresh,
  });
};

export const useChallengeAccess = (id: string | undefined) =>
  useQuery({
    queryKey: challengeKeys.access(id ?? ''),
    queryFn: async () => (await apiClient.get<AccessRuleInput | null>(`/challenges/${id}/access`)).data,
    enabled: Boolean(id),
  });

export const useSaveChallengeAccess = () => {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: async ({ id, rule }: { id: string; rule: AccessRuleInput }) => (await apiClient.put(`/challenges/${id}/access`, rule)).data,
    onSuccess: refresh,
  });
};
