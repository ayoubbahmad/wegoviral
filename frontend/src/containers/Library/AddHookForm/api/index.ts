import { apiClient } from '@/lib/api-client';
import { Hook, CreateHookDTO, UpdateHookDTO } from '../types';

export const HOOK_ENDPOINTS = {
  HOOKS: '/hooks',
  HOOK_DETAIL: (id: string) => `/hooks/${id}`,
  METADATA: '/library/metadata',
};

export const hookApi = {
  createHook: async (data: CreateHookDTO) => {
    const response = await apiClient.post<any, { data: Hook }>(
      HOOK_ENDPOINTS.HOOKS,
      data,
    );
    return response.data;
  },
  updateHook: async (id: string, data: UpdateHookDTO) => {
    const response = await apiClient.patch<any, { data: Hook }>(
      HOOK_ENDPOINTS.HOOK_DETAIL(id),
      data,
    );
    return response.data;
  },
  getMetadata: async (url: string) => {
    const response = await apiClient.get(HOOK_ENDPOINTS.METADATA, {
      params: { url },
    });
    return response.data;
  },
};
