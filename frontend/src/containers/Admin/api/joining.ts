import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import {
  AdminGuide,
  ApplicationWithUser,
  CommunitySettings,
  CreateInviteInput,
  GuideSectionDraft,
  InviteLink,
  JoinStatus,
  QuizQuestionDraft,
} from '../types';
import { adminKeys } from '.';

export const joiningKeys = {
  applications: (status: JoinStatus) => ['admin', 'applications', status] as const,
  settings: ['admin', 'settings'] as const,
  guide: ['admin', 'guide'] as const,
  invites: ['admin', 'invites'] as const,
};

/** After a joining change: members, overview and the activity log may all show it. */
const useRefreshAdmin = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'applications'] });
    queryClient.invalidateQueries({ queryKey: adminKeys.members });
    queryClient.invalidateQueries({ queryKey: adminKeys.overview });
    queryClient.invalidateQueries({ queryKey: ['admin', 'activity'] });
  };
};

export const useApplications = (status: JoinStatus) =>
  useQuery({
    queryKey: joiningKeys.applications(status),
    queryFn: async () =>
      (
        await apiClient.get<{ applications: ApplicationWithUser[]; total: number }>('/admin/applications', {
          params: { status, pageSize: 100 },
        })
      ).data,
  });

export const useReviewApplication = () => {
  const refresh = useRefreshAdmin();
  return useMutation({
    mutationFn: async ({ userId, decision, note }: { userId: string; decision: 'approve' | 'reject'; note?: string }) =>
      (await apiClient.post(`/admin/applications/${userId}/${decision}`, decision === 'reject' ? { note } : {})).data,
    onSuccess: refresh,
  });
};

export const useSetSpecialMember = () => {
  const refresh = useRefreshAdmin();
  return useMutation({
    mutationFn: async ({ id, specialMember }: { id: string; specialMember: boolean }) =>
      (await apiClient.patch(`/admin/members/${id}/special`, { specialMember })).data,
    onSuccess: refresh,
  });
};

export const useCommunitySettings = () =>
  useQuery({
    queryKey: joiningKeys.settings,
    queryFn: async () => (await apiClient.get<CommunitySettings>('/admin/settings')).data,
  });

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (changes: Partial<CommunitySettings>) =>
      (await apiClient.patch<CommunitySettings>('/admin/settings', changes)).data,
    onSuccess: (settings) => {
      queryClient.setQueryData(joiningKeys.settings, settings);
      queryClient.invalidateQueries({ queryKey: ['admin', 'activity'] });
    },
  });
};

export const useAdminGuide = () =>
  useQuery({
    queryKey: joiningKeys.guide,
    queryFn: async () => (await apiClient.get<AdminGuide>('/admin/guide')).data,
  });

export const useSaveGuideSections = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (sections: GuideSectionDraft[]) =>
      (
        await apiClient.put('/admin/guide/sections', {
          sections: sections.map(({ title, body, mediaUrl }) => ({ title, body, mediaUrl: mediaUrl || '' })),
        })
      ).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: joiningKeys.guide }),
  });
};

export const useSaveQuiz = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (questions: QuizQuestionDraft[]) =>
      (
        await apiClient.put('/admin/guide/quiz', {
          questions: questions.map(({ question, options, correctIndex }) => ({ question, options, correctIndex })),
        })
      ).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: joiningKeys.guide }),
  });
};

export const usePublishGuide = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => (await apiClient.post<{ version: number }>('/admin/guide/publish')).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: joiningKeys.guide });
      queryClient.invalidateQueries({ queryKey: joiningKeys.settings });
      queryClient.invalidateQueries({ queryKey: ['admin', 'activity'] });
    },
  });
};

export const useInvites = () =>
  useQuery({
    queryKey: joiningKeys.invites,
    queryFn: async () => (await apiClient.get<InviteLink[]>('/admin/invites')).data,
  });

export const useCreateInvite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateInviteInput) => (await apiClient.post<InviteLink>('/admin/invites', input)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: joiningKeys.invites }),
  });
};

export const useRevokeInvite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await apiClient.delete<InviteLink>(`/admin/invites/${id}`)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: joiningKeys.invites }),
  });
};
