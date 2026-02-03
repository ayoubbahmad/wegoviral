"use client";

import { useState, useEffect, useCallback } from "react";
import { getUserPosts, getPerformanceInsights } from "@/actions/performance";
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
        const [pData, iData] = await Promise.all([
            getUserPosts(activeSocialAccount.id),
            getPerformanceInsights(activeSocialAccount.id)
        ]);
        setPosts(pData);
        setInsights(iData);
        setIsLoading(false);
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
