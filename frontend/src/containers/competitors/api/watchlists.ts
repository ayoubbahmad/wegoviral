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
    return apiClient.get<Watchlist[]>('/watchlists') as any;
  },

  getById: async (id: string) => {
    return apiClient.get<Watchlist>(`/watchlists/${id}`) as any;
  },

  create: async (name: string) => {
    return apiClient.post<Watchlist>('/watchlists', { name }) as any;
  },

  update: async (id: string, name: string) => {
    return apiClient.patch<Watchlist>(`/watchlists/${id}`, { name }) as any;
  },

  delete: async (id: string) => {
    await apiClient.delete(`/watchlists/${id}`);
  },

  addCompetitor: async (watchlistId: string, competitorId: string) => {
    await apiClient.post('/watchlists/add-competitor', {
      watchlistId,
      competitorId,
    });
  },

  removeCompetitor: async (watchlistId: string, competitorId: string) => {
    await apiClient.post('/watchlists/remove-competitor', {
      watchlistId,
      competitorId,
    });
  },
};
