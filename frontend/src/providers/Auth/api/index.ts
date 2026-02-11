import { apiClient } from '@/lib/api-client';
import { User } from '../types';

export const authApi = {
  me: async () => {
    const response = await apiClient.get<{ user: User }>('/auth/me');
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await apiClient.post<{ token: string; user: User }>(
      '/auth/login',
      data,
    );
    return response.data;
  },

  register: async (data: {
    email: string;
    username: string;
    password: string;
    name?: string;
  }) => {
    const response = await apiClient.post<{ token: string; user: User }>(
      '/auth/register',
      data,
    );
    return response.data;
  },
};
