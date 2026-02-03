"use client";

import { useState, useEffect, useCallback } from "react";
import { ScriptTemplate, getScriptTemplates, createScriptTemplate, deleteScriptTemplate } from "@/actions/scripts";

export function useScripts() {
    const [scripts, setScripts] = useState<ScriptTemplate[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const refreshScripts = useCallback(async () => {
        setIsLoading(true);
        const data = await getScriptTemplates();
        setScripts(data);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        refreshScripts();
    }, [refreshScripts]);

    const addScript = async (data: Omit<ScriptTemplate, "id" | "createdAt">) => {
        const result = await createScriptTemplate(data);
        if (result.success) {
            refreshScripts();
        }
        return result;
    };

    const removeScript = async (id: string) => {
        const result = await deleteScriptTemplate(id);
        if (result.success) {
            refreshScripts();
        }
        return result;
    };

    return {
        scripts,
        isLoading,
        addScript,
        removeScript,
        refreshScripts
    };
}
