"use client";

import { useState, useEffect } from "react";
import { Hook } from "@/types/library";
import { getHooks, createHook, deleteHook as deleteHookAction } from "@/actions/hooks";

export function useHooks() {
    const [hooks, setHooks] = useState<Hook[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from database on mount
    useEffect(() => {
        async function loadHooks() {
            const data = await getHooks();
            setHooks(data);
            setIsLoaded(true);
        }
        loadHooks();
    }, []);

    const addHook = async (hook: Hook) => {
        const result = await createHook(hook);
        if (result.success && result.hook) {
            // Optimistic update
            setHooks((prev) => [result.hook as any, ...prev]);
        }
    };

    const deleteHook = async (id: string) => {
        const result = await deleteHookAction(id);
        if (result.success) {
            // Optimistic update
            setHooks((prev) => prev.filter((h) => h.id !== id));
        }
    };

    return { hooks, addHook, deleteHook, isLoaded };
}
