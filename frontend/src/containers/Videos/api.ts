import apiClient from '@/lib/api-client';

export interface Video {
  id: string;
  title: string;
  thumbnailUrl: string;
  channelName: string;
  channelAvatarUrl: string;
  publishedAt: string;
  views: string;
  likes: string;
  platform: 'youtube' | 'tiktok' | 'instagram';
  metrics: {
    outlierScore?: string;
    views: string;
    engagementRate?: string;
    url?: string;
  };
}

export const activeVideosApi = {
  getVideos: async (params?: any) => {
    const response = await apiClient.get('/videos', { params });
    return response.data;
  },

  syncAll: async () => {
    const response = await apiClient.post('/competitors/sync');
    return response.data;
  },

  getVideoDetails: async (id: string) => {
    const response = await apiClient.get(`/videos/${id}`);
    return response.data;
  },
};
