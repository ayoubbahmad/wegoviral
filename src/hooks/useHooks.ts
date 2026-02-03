"use client";

import { useState, useEffect } from "react";
import { Hook } from "@/types/library";
import { MOCK_HOOKS } from "@/lib/mock-data";

export function useHooks() {
    const [hooks, setHooks] = useState<Hook[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem("creator_os_hooks");
        if (stored) {
            setHooks(JSON.parse(stored));
        } else {
            setHooks(MOCK_HOOKS);
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage whenever hooks change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("creator_os_hooks", JSON.stringify(hooks));
        }
    }, [hooks, isLoaded]);

    const addHook = (hook: Hook) => {
        setHooks((prev) => [hook, ...prev]);
    };

    const deleteHook = (id: string) => {
        setHooks((prev) => prev.filter((h) => h.id !== id));
    };

    return { hooks, addHook, deleteHook, isLoaded };
}
