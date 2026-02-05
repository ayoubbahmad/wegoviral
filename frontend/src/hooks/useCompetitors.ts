"use client";

import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import { Competitor } from "@/types/competitor";

export function useCompetitors() {
    const [competitors, setCompetitors] = useState<Competitor[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const refresh = useCallback(async () => {
        setIsLoading(true);
        try {
            const data: any = await apiClient.get('/competitors');
            setCompetitors(data);
        } catch (error) {
            console.error('Error fetching competitors:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const addCompetitor = async (newComp: Omit<Competitor, "id">) => {
        try {
            const savedComp: any = await apiClient.post('/competitors', newComp);
            setCompetitors(prev => [savedComp, ...prev]);
            return { success: true, competitor: savedComp };
        } catch (error) {
            return { success: false, error: 'Failed to add competitor' };
        }
    };

    const removeCompetitor = async (id: string) => {
        try {
            await apiClient.delete(`/competitors/${id}`);
            setCompetitors(prev => prev.filter(c => c.id !== id));
            return { success: true };
        } catch (error) {
            return { success: false, error: 'Failed to delete competitor' };
        }
    };

    const updateCompetitor = async (id: string, updates: Partial<Competitor>) => {
        try {
            const updatedComp: any = await apiClient.patch(`/competitors/${id}`, updates);
            setCompetitors(prev => prev.map(c => c.id === id ? updatedComp : c));
            return { success: true, competitor: updatedComp };
        } catch (error) {
            return { success: false, error: 'Failed to update competitor' };
        }
    };

    return {
        competitors,
        isLoading,
        addCompetitor,
        updateCompetitor,
        removeCompetitor,
        refresh
    };
}
