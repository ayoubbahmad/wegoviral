import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import {
  Users,
  Activity,
  Eye,
  ArrowUpRight,
  Globe,
  Flame,
  Trophy,
} from 'lucide-react';

// Standard icon mapping
const ICON_MAP: Record<string, any> = {
  Users,
  Activity,
  Eye,
  ArrowUpRight,
  Globe,
  Flame,
  Trophy,
};

// Types
export interface HomeStats {
  label: string;
  value: string;
  trend?: number;
  icon: any;
}

export interface HomeSummary {
  stats: any[];
  scripts: any[];
  videos: any[];
  projects: any[];
  challenges: any[];
}

// API Functions
export const homeApi = {
  getSummary: async (): Promise<HomeSummary> => {
    const response = await apiClient.get('/home/summary');
    return response.data;
  },
};

// Tanstack Query Hooks
export const useGetHomeSummary = () => {
  return useQuery({
    queryKey: ['home-summary'],
    queryFn: homeApi.getSummary,
  });
};

// Legacy support or specific stat hook
export const useGetHomeStats = () => {
  const { data: summary, isLoading, error } = useGetHomeSummary();

  const stats = (summary?.stats || []).map((stat) => ({
    ...stat,
    icon: ICON_MAP[stat.icon] || Globe,
  }));

  return { data: stats, isLoading, error };
};
