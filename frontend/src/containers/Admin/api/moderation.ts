import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { AccessRule, AdminSpace, Tier, DeletedContent, HeldContent, ReportGroup, ReportStatus, ResolveReportsInput, SpaceInput } from '../types';
import { adminKeys } from '.';

export const moderationKeys = {
  reports: (status: ReportStatus) => ['admin', 'moderation', 'reports', status] as const,
  held: ['admin', 'moderation', 'held'] as const,
  deleted: ['admin', 'moderation', 'deleted'] as const,
  spaces: ['admin', 'spaces'] as const,
};

/** Moderation changes show up in the queues, the overview, the log and the feed. */
const useRefreshModeration = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'moderation'] });
    queryClient.invalidateQueries({ queryKey: adminKeys.overview });
    queryClient.invalidateQueries({ queryKey: ['admin', 'activity'] });
    queryClient.invalidateQueries({ queryKey: adminKeys.members });
    queryClient.invalidateQueries({ queryKey: ['feed'] });
  };
};

export const useReports = (status: ReportStatus) =>
  useQuery({
    queryKey: moderationKeys.reports(status),
    queryFn: async () => (await apiClient.get<ReportGroup[]>('/admin/moderation/reports', { params: { status } })).data,
  });

export const useResolveReports = () => {
  const refresh = useRefreshModeration();
  return useMutation({
    mutationFn: async (input: ResolveReportsInput) =>
      (await apiClient.post<{ status: string; resolution: string }>('/admin/moderation/reports/resolve', input)).data,
    onSuccess: refresh,
  });
};

export const useHeldContent = () =>
  useQuery({
    queryKey: moderationKeys.held,
    queryFn: async () => (await apiClient.get<HeldContent>('/admin/moderation/held')).data,
  });

export const useReleaseComment = () => {
  const refresh = useRefreshModeration();
  return useMutation({
    mutationFn: async (id: string) => (await apiClient.post(`/admin/moderation/comments/${id}/release`)).data,
    onSuccess: refresh,
  });
};

/** Held posts are released through the normal review endpoints. */
export const useReviewHeldPost = () => {
  const refresh = useRefreshModeration();
  return useMutation({
    mutationFn: async ({ id, decision }: { id: string; decision: 'approve' | 'reject' }) =>
      (await apiClient.post(`/feed/reviews/${id}/${decision}`, {})).data,
    onSuccess: refresh,
  });
};

export const useDeleteComment = () => {
  const refresh = useRefreshModeration();
  return useMutation({
    mutationFn: async (id: string) => (await apiClient.delete(`/feed/comments/${id}`)).data,
    onSuccess: refresh,
  });
};

export const useDeletedContent = () =>
  useQuery({
    queryKey: moderationKeys.deleted,
    queryFn: async () => (await apiClient.get<DeletedContent>('/admin/moderation/deleted')).data,
  });

export const useRestoreContent = () => {
  const refresh = useRefreshModeration();
  return useMutation({
    mutationFn: async (input: { targetType: 'post' | 'comment'; id: string }) =>
      (await apiClient.post('/admin/moderation/restore', input)).data,
    onSuccess: refresh,
  });
};

export const useWarnMember = () => {
  const refresh = useRefreshModeration();
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) =>
      (await apiClient.post(`/admin/members/${id}/warn`, { reason })).data,
    onSuccess: refresh,
  });
};

// ─── Spaces ──────────────────────────────────────────────────────────────────

export const useAdminSpaces = () =>
  useQuery({
    queryKey: moderationKeys.spaces,
    queryFn: async () => (await apiClient.get<AdminSpace[]>('/admin/spaces')).data,
  });

const useRefreshSpaces = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: moderationKeys.spaces });
    queryClient.invalidateQueries({ queryKey: ['feed'] });
    queryClient.invalidateQueries({ queryKey: ['admin', 'activity'] });
  };
};

export const useSaveSpace = () => {
  const refresh = useRefreshSpaces();
  return useMutation({
    mutationFn: async ({ id, input }: { id?: string; input: SpaceInput }) =>
      id
        ? (await apiClient.patch<AdminSpace>(`/admin/spaces/${id}`, input)).data
        : (await apiClient.post<AdminSpace>('/admin/spaces', input)).data,
    onSuccess: refresh,
  });
};

export const useReorderSpaces = () => {
  const refresh = useRefreshSpaces();
  return useMutation({
    mutationFn: async (ids: string[]) => (await apiClient.put<AdminSpace[]>('/admin/spaces/order', { ids })).data,
    onSuccess: refresh,
  });
};

export const useArchiveSpace = () => {
  const refresh = useRefreshSpaces();
  return useMutation({
    mutationFn: async ({ id, archived }: { id: string; archived: boolean }) =>
      (await apiClient.patch<AdminSpace>(`/admin/spaces/${id}/archive`, { archived })).data,
    onSuccess: refresh,
  });
};

// ─── Access rules & tiers ────────────────────────────────────────────────────

export const tierKeys = { all: ['admin', 'tiers'] as const };

export const useSaveSpaceAccess = () => {
  const refresh = useRefreshSpaces();
  return useMutation({
    mutationFn: async ({ id, rule }: { id: string; rule: AccessRule }) =>
      (await apiClient.put<AccessRule | null>(`/admin/spaces/${id}/access`, rule)).data,
    onSuccess: refresh,
  });
};

export const useTiers = (enabled = true) =>
  useQuery({
    queryKey: tierKeys.all,
    queryFn: async () => (await apiClient.get<Tier[]>('/admin/tiers')).data,
    enabled,
  });

const useRefreshTiers = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: tierKeys.all });
    queryClient.invalidateQueries({ queryKey: moderationKeys.spaces });
    queryClient.invalidateQueries({ queryKey: adminKeys.members });
    queryClient.invalidateQueries({ queryKey: ['admin', 'activity'] });
    queryClient.invalidateQueries({ queryKey: ['feed'] });
  };
};

export const useSaveTier = () => {
  const refresh = useRefreshTiers();
  return useMutation({
    mutationFn: async ({ id, input }: { id?: string; input: { name?: string; description?: string; isDefault?: boolean } }) =>
      id ? (await apiClient.patch<Tier>(`/admin/tiers/${id}`, input)).data : (await apiClient.post<Tier>('/admin/tiers', input)).data,
    onSuccess: refresh,
  });
};

export const useDeleteTier = () => {
  const refresh = useRefreshTiers();
  return useMutation({
    mutationFn: async (id: string) => (await apiClient.delete(`/admin/tiers/${id}`)).data,
    onSuccess: refresh,
  });
};

export const useSetMemberTier = () => {
  const refresh = useRefreshTiers();
  return useMutation({
    mutationFn: async ({ id, tierId }: { id: string; tierId: string | null }) =>
      (await apiClient.patch(`/admin/members/${id}/tier`, { tierId })).data,
    onSuccess: refresh,
  });
};
