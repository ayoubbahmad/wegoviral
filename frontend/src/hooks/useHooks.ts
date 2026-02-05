"use client";

import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import { Hook } from "@/types/library";

export function useHooks() {
    const [hooks, setHooks] = useState<Hook[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const refresh = useCallback(async () => {
        setIsLoading(true);
        try {
            const data: any = await apiClient.get('/hooks');
            setHooks(data);
        } catch (error) {
            console.error('Error fetching hooks:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const addHook = async (newHook: Omit<Hook, "id" | "addedAt">) => {
        try {
            const savedHook: any = await apiClient.post('/hooks', newHook);
            setHooks(prev => [savedHook, ...prev]);
            return { success: true, hook: savedHook };
        } catch (error) {
            return { success: false, error: 'Failed to add hook' };
        }
    };

    const removeHook = async (id: string) => {
        try {
            await apiClient.delete(`/hooks/${id}`);
            setHooks(prev => prev.filter(h => h.id !== id));
            return { success: true };
        } catch (error) {
            return { success: false, error: 'Failed to delete hook' };
        }
    };

    const updateHook = async (id: string, updates: Partial<Hook>) => {
        try {
            const updatedHook: any = await apiClient.patch(`/hooks/${id}`, updates);
            setHooks(prev => prev.map(h => h.id === id ? updatedHook : h));
            return { success: true, hook: updatedHook };
        } catch (error) {
            return { success: false, error: 'Failed to update hook' };
        }
    };

    return {
        hooks,
        isLoading,
        addHook,
        updateHook,
        removeHook,
        refresh
    };
}
