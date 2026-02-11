import { apiClient } from '@/lib/api-client';
import { Competitor } from '@/types/competitor';

export const competitorsSharedApi = {
  getAll: async (watchlistId?: string) => {
    const response = await apiClient.get<Competitor[]>('/competitors', {
      params: { watchlistId },
    });
    return response.data;
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/competitors/${id}`);
    return response.data;
  },
  update: async (id: string, updates: Partial<Competitor>) => {
    const response = await apiClient.patch<Competitor>(
      `/competitors/${id}`,
      updates,
    );
    return response.data;
  },
};
