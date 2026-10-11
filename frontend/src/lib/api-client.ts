import axios from 'axios';
import { supabase } from './supabase';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  // Supabase refreshes the access token automatically; always send the current one
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      await supabase.auth.signOut();
      window.location.href = '/login';
    }
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      'API request failed';
    return Promise.reject(new Error(message));
  },
);

export { apiClient };
export default apiClient;
