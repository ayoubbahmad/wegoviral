import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { UserRole } from '@/lib/roles';
import {
  ActivityEntry,
  AdminMember,
  AdminOverview,
  MemberDetail,
  MembersFilters,
  MembersPage,
  RestrictionInput,
} from '../types';

export const MEMBERS_PAGE_SIZE = 25;

export const adminKeys = {
  all: ['admin'] as const,
  overview: ['admin', 'overview'] as const,
  members: ['admin', 'members'] as const,
  membersList: (filters: MembersFilters) => ['admin', 'members', 'list', filters] as const,
  member: (id: string) => ['admin', 'members', 'detail', id] as const,
  activity: (targetType?: string) => ['admin', 'activity', targetType ?? 'all'] as const,
};

export const useAdminOverview = () =>
  useQuery({
    queryKey: adminKeys.overview,
    queryFn: async () => (await apiClient.get<AdminOverview>('/admin/overview')).data,
  });

export const useAdminMembers = (filters: MembersFilters) =>
  useQuery({
    queryKey: adminKeys.membersList(filters),
    queryFn: async () =>
      (
        await apiClient.get<MembersPage>('/admin/members', {
          params: { ...filters, pageSize: MEMBERS_PAGE_SIZE },
        })
      ).data,
    // Keep showing the current page while the next one loads
    placeholderData: keepPreviousData,
  });

export const useAdminMember = (id: string | null) =>
  useQuery({
    queryKey: adminKeys.member(id ?? ''),
    queryFn: async () => (await apiClient.get<MemberDetail>(`/admin/members/${id}`)).data,
    enabled: Boolean(id),
  });

export const useAdminActivity = (targetType?: string) =>
  useInfiniteQuery({
    queryKey: adminKeys.activity(targetType),
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }) =>
      (
        await apiClient.get<{ entries: ActivityEntry[]; nextCursor: string | null }>(
          '/admin/activity',
          { params: { targetType, cursor: pageParam, limit: 30 } },
        )
      ).data,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

/** After changing a member: refresh lists, their detail, the overview and the log. */
const useRefreshAfterMemberChange = () => {
  const queryClient = useQueryClient();
  return (member: AdminMember) => {
    queryClient.invalidateQueries({ queryKey: adminKeys.members });
    queryClient.invalidateQueries({ queryKey: adminKeys.member(member.id) });
    queryClient.invalidateQueries({ queryKey: adminKeys.overview });
    queryClient.invalidateQueries({ queryKey: ['admin', 'activity'] });
  };
};

export const useChangeRole = () => {
  const refresh = useRefreshAfterMemberChange();
  return useMutation({
    mutationFn: async ({ id, role }: { id: string; role: UserRole }) =>
      (await apiClient.patch<AdminMember>(`/admin/members/${id}/role`, { role })).data,
    onSuccess: refresh,
  });
};

export const useRestrictMember = () => {
  const refresh = useRefreshAfterMemberChange();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: RestrictionInput }) =>
      (await apiClient.post<AdminMember>(`/admin/members/${id}/restriction`, input)).data,
    onSuccess: refresh,
  });
};

export const useLiftRestriction = () => {
  const refresh = useRefreshAfterMemberChange();
  return useMutation({
    mutationFn: async (id: string) =>
      (await apiClient.delete<AdminMember>(`/admin/members/${id}/restriction`)).data,
    onSuccess: refresh,
  });
};
