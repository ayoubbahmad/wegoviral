import { apiClient } from '@/lib/api-client';
import {
  Hook,
  ScriptTemplate,
  CreateHookDTO,
  UpdateHookDTO,
  CreateScriptTemplateDTO,
  UpdateScriptTemplateDTO,
} from './types';

export const LIBRARY_ENDPOINTS = {
  HOOKS: '/hooks',
  HOOK_DETAIL: (id: string) => `/hooks/${id}`,
  TEMPLATES: '/script-templates',
  TEMPLATE_DETAIL: (id: string) => `/script-templates/${id}`,
  METADATA: '/library/metadata',
};

export const libraryApi = {
  // Hooks
  getHooks: async () => {
    return apiClient.get<any, Hook[]>(LIBRARY_ENDPOINTS.HOOKS);
  },
  createHook: async (data: CreateHookDTO) => {
    return apiClient.post<any, Hook>(LIBRARY_ENDPOINTS.HOOKS, data);
  },
  updateHook: async (id: string, data: UpdateHookDTO) => {
    return apiClient.patch<any, Hook>(LIBRARY_ENDPOINTS.HOOK_DETAIL(id), data);
  },
  deleteHook: async (id: string) => {
    return apiClient.delete(LIBRARY_ENDPOINTS.HOOK_DETAIL(id));
  },

  // Script Templates
  getTemplates: async () => {
    return apiClient.get<any, ScriptTemplate[]>(LIBRARY_ENDPOINTS.TEMPLATES);
  },
  createTemplate: async (data: CreateScriptTemplateDTO) => {
    return apiClient.post<any, ScriptTemplate>(
      LIBRARY_ENDPOINTS.TEMPLATES,
      data,
    );
  },
  updateTemplate: async (id: string, data: UpdateScriptTemplateDTO) => {
    const response = await apiClient.patch(
      LIBRARY_ENDPOINTS.TEMPLATE_DETAIL(id),
      data,
    );
    return response.data;
  },

  // Metadata
  getMetadata: async (url: string) => {
    const response = await apiClient.get(LIBRARY_ENDPOINTS.METADATA, {
      params: { url },
    });
    return response.data;
  },
  deleteTemplate: async (id: string) => {
    return apiClient.delete(LIBRARY_ENDPOINTS.TEMPLATE_DETAIL(id));
  },
};
