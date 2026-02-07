import { apiClient } from "@/lib/api-client";
import { Script, CreateScriptDTO, UpdateScriptDTO } from "./types";

export const SCRIPTS_ENDPOINTS = {
  BASE: "/scripts",
  DETAIL: (id: string) => `/scripts/${id}`,
};

export const scriptsApi = {
  getScripts: async () => {
    return apiClient.get<any, Script[]>(SCRIPTS_ENDPOINTS.BASE);
  },
  
  getScript: async (id: string) => {
    return apiClient.get<any, Script>(SCRIPTS_ENDPOINTS.DETAIL(id));
  },
  
  createScript: async (data: CreateScriptDTO) => {
    return apiClient.post<any, Script>(SCRIPTS_ENDPOINTS.BASE, data);
  },
  
  updateScript: async (id: string, data: UpdateScriptDTO) => {
    return apiClient.patch<any, Script>(SCRIPTS_ENDPOINTS.DETAIL(id), data);
  },
  
  deleteScript: async (id: string) => {
    return apiClient.delete(SCRIPTS_ENDPOINTS.DETAIL(id));
  },
};
