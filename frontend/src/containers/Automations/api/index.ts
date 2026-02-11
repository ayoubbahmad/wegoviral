import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

// Types
export interface Automation {
  id: string;
  name: string;
  triggerKeyword: string;
  responseMessage: string;
  platform: string | null;
  active: boolean;
  userId: string;
  socialAccountId: string | null;
  runCount: number;
  lastRunAt: string | null;
  commentReplyEnabled: boolean;
  commentReplyMessage: string | null;
  instagramPostId: string | null;
  isGlobal: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAutomationDTO {
  name: string;
  triggerKeyword: string;
  responseMessage: string;
  platform?: string;
  socialAccountId?: string;
  commentReplyEnabled?: boolean;
  commentReplyMessage?: string;
  instagramPostId?: string;
  isGlobal?: boolean;
}

export interface UpdateAutomationDTO {
  name?: string;
  triggerKeyword?: string;
  responseMessage?: string;
  platform?: string;
  active?: boolean;
  socialAccountId?: string;
  commentReplyEnabled?: boolean;
  commentReplyMessage?: string;
  instagramPostId?: string;
  isGlobal?: boolean;
}

// API Functions
export const automationsApi = {
  getAutomations: async (): Promise<Automation[]> => {
    const response = await apiClient.get<Automation[]>('/automations');
    return response.data;
  },

  getAutomation: async (id: string): Promise<Automation> => {
    const response = await apiClient.get<Automation>(`/automations/${id}`);
    return response.data;
  },

  createAutomation: async (data: CreateAutomationDTO): Promise<Automation> => {
    const response = await apiClient.post<Automation>('/automations', data);
    return response.data;
  },

  updateAutomation: async ({
    id,
    data,
  }: {
    id: string;
    data: UpdateAutomationDTO;
  }): Promise<Automation> => {
    const response = await apiClient.patch<Automation>(
      `/automations/${id}`,
      data,
    );
    return response.data;
  },

  deleteAutomation: async (id: string): Promise<void> => {
    await apiClient.delete(`/automations/${id}`);
  },
};

// Hooks
export const useGetAutomations = () => {
  return useQuery({
    queryKey: ['automations'],
    queryFn: automationsApi.getAutomations,
  });
};

export const useCreateAutomation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: automationsApi.createAutomation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automations'] });
    },
  });
};

export const useUpdateAutomation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: automationsApi.updateAutomation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automations'] });
    },
  });
};

export const useDeleteAutomation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: automationsApi.deleteAutomation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automations'] });
    },
  });
};
