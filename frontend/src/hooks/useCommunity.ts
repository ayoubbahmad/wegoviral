"use client";

import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";

export function useCommunity() {
    const { activeSocialAccount } = useAuth();
    const [followers, setFollowers] = useState<any[]>([]);
    const [summary, setSummary] = useState({ total: 0, vips: 0, newThisMonth: 0 });
    const [isLoading, setIsLoading] = useState(true);

    const refresh = useCallback(async () => {
        if (!activeSocialAccount) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        try {
            const [fData, sData] = await Promise.all([
                (apiClient.get(`/community/followers?socialAccountId=${activeSocialAccount.id}`) as any),
                (apiClient.get(`/community/summary?socialAccountId=${activeSocialAccount.id}`) as any)
            ]);
            setFollowers(fData);
            setSummary(sData);
        } catch (error) {
            console.error('Error fetching community data:', error);
        } finally {
            setIsLoading(false);
        }
    }, [activeSocialAccount]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return {
        followers,
        summary,
        isLoading,
        refresh
    };
}
