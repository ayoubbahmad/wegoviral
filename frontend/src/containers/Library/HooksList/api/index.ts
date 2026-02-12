import { apiClient } from '@/lib/api-client';
import { Hook } from '../../types';

export const HOOK_LIST_ENDPOINTS = {
  HOOKS: '/hooks',
  HOOK_DETAIL: (id: string) => `/hooks/${id}`,
};

export const hookListApi = {
  getHooks: async () => {
    const response = await apiClient.get<any, { data: Hook[] }>(
      HOOK_LIST_ENDPOINTS.HOOKS,
    );
    return response.data;
  },
  deleteHook: async (id: string) => {
    const response = await apiClient.delete(
      HOOK_LIST_ENDPOINTS.HOOK_DETAIL(id),
    );
    return response.data;
  },
};
