import { apiClient } from '@/lib/api-client';
import { Competitor, Creator } from '@/types/competitor';

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

  // Creator endpoints
  getCreators: async () => {
    const response = await apiClient.get<Creator[]>('/competitors/creators');
    return response.data;
  },
  getCreator: async (id: string) => {
    const response = await apiClient.get<Creator>(
      `/competitors/creators/${id}`,
    );
    return response.data;
  },
  createCreator: async (name: string) => {
    const response = await apiClient.post<Creator>('/competitors/creators', {
      name,
    });
    return response.data;
  },
  linkCompetitor: async (competitorId: string, creatorId: string) => {
    const response = await apiClient.post<Competitor>(
      '/competitors/creators/link',
      {
        competitorId,
        creatorId,
      },
    );
    return response.data;
  },
  unlinkCompetitor: async (competitorId: string) => {
    const response = await apiClient.post<Competitor>(
      `/competitors/creators/unlink/${competitorId}`,
    );
    return response.data;
  },
};
