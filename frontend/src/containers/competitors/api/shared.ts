import { apiClient } from '@/lib/api-client';
import { Competitor } from '@/types/competitor';

export const competitorsSharedApi = {
  getAll: async (watchlistId?: string) => {
    return apiClient.get<any, Competitor[]>('/competitors', {
      params: { watchlistId },
    });
  },
  delete: async (id: string) => {
    return apiClient.delete(`/competitors/${id}`);
  },
  update: async (id: string, updates: Partial<Competitor>) => {
    return apiClient.patch<any, Competitor>(`/competitors/${id}`, updates);
  },
};
