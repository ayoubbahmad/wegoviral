'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/providers/Auth';

export function usePerformance() {
  const { activeSocialAccount } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [insights, setInsights] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!activeSocialAccount) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const [pData, iData] = await Promise.all([
        apiClient
          .get(`/performance/posts?socialAccountId=${activeSocialAccount.id}`)
          .then((res) => res.data),
        apiClient
          .get(
            `/performance/insights?socialAccountId=${activeSocialAccount.id}`,
          )
          .then((res) => res.data),
      ]);
      setPosts(pData);
      setInsights(iData);
    } catch (error) {
      console.error('Error fetching performance data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [activeSocialAccount]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    posts,
    insights,
    isLoading,
    refresh,
  };
}
