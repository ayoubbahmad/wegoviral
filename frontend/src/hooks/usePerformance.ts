"use client";

import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";

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
                apiFetch(`/performance/posts?socialAccountId=${activeSocialAccount.id}`),
                apiFetch(`/performance/insights?socialAccountId=${activeSocialAccount.id}`)
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
        refresh
    };
}
