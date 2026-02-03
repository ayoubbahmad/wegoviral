"use client";

import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/lib/api-client";
import { ScriptTemplate } from "@/types/library";

export function useScripts() {
    const [scripts, setScripts] = useState<ScriptTemplate[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const refresh = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await apiFetch('/scripts');
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
            const savedScript = await apiFetch('/scripts', {
                method: 'POST',
                body: JSON.stringify(newScript),
            });
            setScripts(prev => [savedScript, ...prev]);
            return { success: true, script: savedScript };
        } catch (error) {
            return { success: false, error: 'Failed to add script template' };
        }
    };

    const removeScript = async (id: string) => {
        try {
            await apiFetch(`/scripts/${id}`, { method: 'DELETE' });
            setScripts(prev => prev.filter(s => s.id !== id));
            return { success: true };
        } catch (error) {
            return { success: false, error: 'Failed to delete script template' };
        }
    };

    return {
        scripts,
        isLoading,
        addScript,
        removeScript,
        refresh
    };
}
