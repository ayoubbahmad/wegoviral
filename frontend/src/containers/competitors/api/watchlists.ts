import { apiClient } from '@/lib/api-client';

export interface Watchlist {
  id: string;
  name: string;
  _count?: {
    competitors: number;
  };
}

export const watchlistsApi = {
  getAll: async () => {
    const response = await apiClient.get<Watchlist[]>('/watchlists');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<Watchlist>(`/watchlists/${id}`);
    return response.data;
  },

  create: async (name: string) => {
    const response = await apiClient.post<Watchlist>('/watchlists', { name });
    return response.data;
  },

  update: async (id: string, name: string) => {
    const response = await apiClient.patch<Watchlist>(`/watchlists/${id}`, {
      name,
    });
    return response.data;
  },

  delete: async (id: string) => {
    await apiClient.delete(`/watchlists/${id}`);
  },

  addCompetitor: async (watchlistId: string, competitorId: string) => {
    const response = await apiClient.post('/watchlists/add-competitor', {
      watchlistId,
      competitorId,
    });
    return response.data;
  },

  removeCompetitor: async (watchlistId: string, competitorId: string) => {
    const response = await apiClient.post('/watchlists/remove-competitor', {
      watchlistId,
      competitorId,
    });
    return response.data;
  },
};
