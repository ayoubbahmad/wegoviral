"use client";

import { useState, useEffect, useCallback } from "react";
import { getFollowers, getCommunitySummary } from "@/actions/community";
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
        const [fData, sData] = await Promise.all([
            getFollowers(activeSocialAccount.id),
            getCommunitySummary(activeSocialAccount.id)
        ]);
        setFollowers(fData);
        setSummary(sData);
        setIsLoading(false);
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
