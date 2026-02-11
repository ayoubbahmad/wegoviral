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
    const response = await apiClient.get<any, { data: Hook[] }>(
      LIBRARY_ENDPOINTS.HOOKS,
    );
    return response.data;
  },
  createHook: async (data: CreateHookDTO) => {
    const response = await apiClient.post<any, { data: Hook }>(
      LIBRARY_ENDPOINTS.HOOKS,
      data,
    );
    return response.data;
  },
  updateHook: async (id: string, data: UpdateHookDTO) => {
    const response = await apiClient.patch<any, { data: Hook }>(
      LIBRARY_ENDPOINTS.HOOK_DETAIL(id),
      data,
    );
    return response.data;
  },
  deleteHook: async (id: string) => {
    const response = await apiClient.delete(LIBRARY_ENDPOINTS.HOOK_DETAIL(id));
    return response.data;
  },

  // Script Templates
  getTemplates: async () => {
    const response = await apiClient.get<any, { data: ScriptTemplate[] }>(
      LIBRARY_ENDPOINTS.TEMPLATES,
    );
    return response.data;
  },
  createTemplate: async (data: CreateScriptTemplateDTO) => {
    const response = await apiClient.post<any, { data: ScriptTemplate }>(
      LIBRARY_ENDPOINTS.TEMPLATES,
      data,
    );
    return response.data;
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
    const response = await apiClient.delete(
      LIBRARY_ENDPOINTS.TEMPLATE_DETAIL(id),
    );
    return response.data;
  },
};
