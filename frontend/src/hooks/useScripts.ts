"use client";

import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import { ScriptTemplate } from "@/types/library";

export function useScripts() {
    const [scripts, setScripts] = useState<ScriptTemplate[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const refresh = useCallback(async () => {
        setIsLoading(true);
        try {
            const data: any = await apiClient.get('/scripts');
            setScripts(data);
        } catch (error) {
            console.error('Error fetching scripts:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const addScript = async (newScript: Omit<ScriptTemplate, "id" | "createdAt">) => {
        try {
            const savedScript: any = await apiClient.post('/scripts', newScript);
            setScripts(prev => [savedScript, ...prev]);
            return { success: true, script: savedScript };
        } catch (error) {
            return { success: false, error: 'Failed to add script template' };
        }
    };

    const removeScript = async (id: string) => {
        try {
            await apiClient.delete(`/scripts/${id}`);
            setScripts(prev => prev.filter(s => s.id !== id));
            return { success: true };
        } catch (error) {
            return { success: false, error: 'Failed to delete script template' };
        }
    };

    const updateScript = async (id: string, updates: Partial<ScriptTemplate>) => {
        try {
            const updatedScript: any = await apiClient.patch(`/scripts/${id}`, updates);
            setScripts(prev => prev.map(s => s.id === id ? updatedScript : s));
            return { success: true, script: updatedScript };
        } catch (error) {
            return { success: false, error: 'Failed to update script template' };
        }
    };

    return {
        scripts,
        isLoading,
        addScript,
        updateScript,
        removeScript,
        refresh
    };
}
