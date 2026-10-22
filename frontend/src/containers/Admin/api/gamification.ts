import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { AdminBadge, BadgeInput, GamificationConfig, LevelRow, PointRuleRow } from '../types';
import { adminKeys } from '.';

export const gamificationKeys = {
  all: ['admin', 'gamification'] as const,
};

/** Points and badges show up on the leaderboard, in /auth/me, the feed and the member panel. */
const useRefreshGamification = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: gamificationKeys.all });
    queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
    queryClient.invalidateQueries({ queryKey: adminKeys.members });
    queryClient.invalidateQueries({ queryKey: ['admin', 'activity'] });
  };
};

export const useGamification = () =>
  useQuery({
    queryKey: gamificationKeys.all,
    queryFn: async () => (await apiClient.get<GamificationConfig>('/admin/gamification')).data,
  });

export const useSavePointRules = () => {
  const refresh = useRefreshGamification();
  return useMutation({
    mutationFn: async (rules: Omit<PointRuleRow, 'label'>[]) =>
      (await apiClient.put<GamificationConfig>('/admin/gamification/rules', { rules })).data,
    onSuccess: refresh,
  });
};

export const useSaveLevels = () => {
  const refresh = useRefreshGamification();
  return useMutation({
    mutationFn: async (levels: Omit<LevelRow, 'level'>[]) =>
      (await apiClient.put<GamificationConfig>('/admin/gamification/levels', { levels })).data,
    onSuccess: refresh,
  });
};

export const useSaveBadge = () => {
  const refresh = useRefreshGamification();
  return useMutation({
    mutationFn: async ({ id, input }: { id?: string; input: BadgeInput }) =>
      (id ? await apiClient.patch<AdminBadge>(`/admin/badges/${id}`, input) : await apiClient.post<AdminBadge>('/admin/badges', input)).data,
    onSuccess: refresh,
  });
};

export const useArchiveBadge = () => {
  const refresh = useRefreshGamification();
  return useMutation({
    mutationFn: async ({ id, archived }: { id: string; archived: boolean }) =>
      (await apiClient.patch<AdminBadge>(`/admin/badges/${id}/archive`, { archived })).data,
    onSuccess: refresh,
  });
};

export const useAwardBadge = () => {
  const refresh = useRefreshGamification();
  return useMutation({
    mutationFn: async ({ memberId, badgeId, note }: { memberId: string; badgeId: string; note?: string }) =>
      (await apiClient.post(`/admin/members/${memberId}/badges`, { badgeId, note: note || undefined })).data,
    onSuccess: refresh,
  });
};

export const useRemoveBadge = () => {
  const refresh = useRefreshGamification();
  return useMutation({
    mutationFn: async ({ memberId, badgeId }: { memberId: string; badgeId: string }) =>
      (await apiClient.delete(`/admin/members/${memberId}/badges/${badgeId}`)).data,
    onSuccess: refresh,
  });
};

export const useAdjustPoints = () => {
  const refresh = useRefreshGamification();
  return useMutation({
    mutationFn: async ({ memberId, points, reason }: { memberId: string; points: number; reason: string }) =>
      (await apiClient.post<{ points: number }>(`/admin/members/${memberId}/points`, { points, reason })).data,
    onSuccess: refresh,
  });
};
