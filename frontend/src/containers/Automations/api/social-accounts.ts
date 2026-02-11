import apiClient from '@/lib/api-client';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface SocialAccount {
  id: string;
  platform: string;
  username: string;
  accountId: string;
  avatarUrl?: string;
  isActive: boolean;
  isConnected: boolean;
}

export const getAuthUrl = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/social-accounts/auth-url`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const handleOAuthCallback = async (code: string) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/social-accounts/callback`, {
    params: { code },
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getMySocialAccounts = async (): Promise<SocialAccount[]> => {
  const token = localStorage.getItem('token');
  const response = await apiClient.get(`${API_URL}/social-accounts/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
