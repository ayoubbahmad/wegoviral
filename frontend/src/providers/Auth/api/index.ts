import { apiClient } from '@/lib/api-client';
import { User } from '../types';

export const authApi = {
  me: async () => {
    const response = await apiClient.get<{ user: User }>('/auth/me');
    return response.data;
  },

  checkUsername: async (username: string) => {
    const response = await apiClient.get<{ available: boolean; reason?: string }>(
      '/auth/username-available',
      { params: { username } },
    );
    return response.data;
  },

  setLocale: async (locale: 'en' | 'fr' | 'ar') => {
    await apiClient.put('/auth/me/locale', { locale });
  },
};
