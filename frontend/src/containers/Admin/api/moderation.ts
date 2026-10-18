import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { AdminSpace, DeletedContent, HeldContent, ReportGroup, ReportStatus, ResolveReportsInput, SpaceInput } from '../types';
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
