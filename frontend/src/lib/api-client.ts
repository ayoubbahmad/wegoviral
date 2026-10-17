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
    // Suspended, banned or no longer approved mid-session: reload once so the app shows why
    if (
      ['ACCOUNT_RESTRICTED', 'NOT_JOINED'].includes(error.response?.data?.code) &&
      typeof window !== 'undefined' &&
      !sessionStorage.getItem('wgv_restricted_reload')
    ) {
      sessionStorage.setItem('wgv_restricted_reload', '1');
      window.location.reload();
    }
    // No response at all means the server is unreachable or blocked by CORS
    const message = !error.response
      ? "Can't reach the server. Check your connection and try again."
      : error.response.data?.error ||
        error.response.data?.message ||
        'API request failed';
    return Promise.reject(new Error(message));
  },
);

export { apiClient };
export default apiClient;
