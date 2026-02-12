import { apiClient } from '@/lib/api-client';
import {
  ScriptTemplate,
  CreateScriptTemplateDTO,
  UpdateScriptTemplateDTO,
} from '../../types';

export const SCRIPT_ENDPOINTS = {
  TEMPLATES: '/script-templates',
  TEMPLATE_DETAIL: (id: string) => `/script-templates/${id}`,
};

export const scriptApi = {
  createTemplate: async (data: CreateScriptTemplateDTO) => {
    const response = await apiClient.post<any, { data: ScriptTemplate }>(
      SCRIPT_ENDPOINTS.TEMPLATES,
      data,
    );
    return response.data;
  },
  updateTemplate: async (id: string, data: UpdateScriptTemplateDTO) => {
    const response = await apiClient.patch<any, { data: ScriptTemplate }>(
      SCRIPT_ENDPOINTS.TEMPLATE_DETAIL(id),
      data,
    );
    return response.data;
  },
};
