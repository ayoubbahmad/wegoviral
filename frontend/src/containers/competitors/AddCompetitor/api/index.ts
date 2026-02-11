import { apiClient } from '@/lib/api-client';

export const COMPETITORS_ENDPOINTS = {
  BULK: '/competitors/bulk',
  PREVIEW: '/competitors/preview',
};

export const competitorsApi = {
  bulkCreate: async (data: {
    handles: string[];
    tags?: string[];
    socialAccountId?: string;
    watchlistId?: string;
  }) => {
    const response = await apiClient.post<any, any>(
      COMPETITORS_ENDPOINTS.BULK,
      data,
    );
    return response.data;
  },
  preview: async (handle: string) => {
    const response = await apiClient.get<any, any>(
      `${COMPETITORS_ENDPOINTS.PREVIEW}?handle=${encodeURIComponent(handle)}`,
    );
    return response.data;
  },
};
