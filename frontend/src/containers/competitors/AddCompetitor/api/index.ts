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
    return apiClient.post<any, any>(COMPETITORS_ENDPOINTS.BULK, data);
  },
  preview: async (handle: string) => {
    return apiClient.get<any, any>(
      `${COMPETITORS_ENDPOINTS.PREVIEW}?handle=${encodeURIComponent(handle)}`,
    );
  },
};
