import { apiClient } from '@/lib/api-client';
import { ScriptTemplate } from '../../types';

export const SCRIPT_LIST_ENDPOINTS = {
  TEMPLATES: '/script-templates',
  TEMPLATE_DETAIL: (id: string) => `/script-templates/${id}`,
};

export const scriptListApi = {
  getTemplates: async () => {
    const response = await apiClient.get<any, { data: ScriptTemplate[] }>(
      SCRIPT_LIST_ENDPOINTS.TEMPLATES,
    );
    return response.data;
  },
  deleteTemplate: async (id: string) => {
    const response = await apiClient.delete(
      SCRIPT_LIST_ENDPOINTS.TEMPLATE_DETAIL(id),
    );
    return response.data;
  },
};
