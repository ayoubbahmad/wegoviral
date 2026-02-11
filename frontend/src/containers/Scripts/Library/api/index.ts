import { apiClient } from '@/lib/api-client';
import { Script, CreateScriptDTO, UpdateScriptDTO } from './types';

export const SCRIPTS_ENDPOINTS = {
  BASE: '/scripts',
  DETAIL: (id: string) => `/scripts/${id}`,
};

export const scriptsApi = {
  getScripts: async () => {
    const response = await apiClient.get<any, { data: Script[] }>(
      SCRIPTS_ENDPOINTS.BASE,
    );
    return response.data;
  },

  getScript: async (id: string) => {
    const response = await apiClient.get<any, { data: Script }>(
      SCRIPTS_ENDPOINTS.DETAIL(id),
    );
    return response.data;
  },

  createScript: async (data: CreateScriptDTO) => {
    const response = await apiClient.post<any, { data: Script }>(
      SCRIPTS_ENDPOINTS.BASE,
      data,
    );
    return response.data;
  },

  updateScript: async (id: string, data: UpdateScriptDTO) => {
    const response = await apiClient.patch<any, { data: Script }>(
      SCRIPTS_ENDPOINTS.DETAIL(id),
      data,
    );
    return response.data;
  },

  deleteScript: async (id: string) => {
    const response = await apiClient.delete(SCRIPTS_ENDPOINTS.DETAIL(id));
    return response.data;
  },
};
