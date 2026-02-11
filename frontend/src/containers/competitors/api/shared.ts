import { apiClient } from '@/lib/api-client';
import { Competitor } from '@/types/competitor';

export const competitorsSharedApi = {
  getAll: async () => {
    return apiClient.get<any, Competitor[]>('/competitors');
  },
  delete: async (id: string) => {
    return apiClient.delete(`/competitors/${id}`);
  },
  update: async (id: string, updates: Partial<Competitor>) => {
    return apiClient.patch<any, Competitor>(`/competitors/${id}`, updates);
  },
};
