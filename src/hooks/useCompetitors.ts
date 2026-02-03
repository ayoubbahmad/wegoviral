"use client";

import { useState, useEffect } from "react";
import { Competitor } from "@/types/competitor";
import { getCompetitors, createCompetitor, deleteCompetitor } from "@/actions/competitors";

export function useCompetitors() {
    const [competitors, setCompetitors] = useState<Competitor[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        async function loadCompetitors() {
            const data = await getCompetitors();
            setCompetitors(data);
            setIsLoaded(true);
        }
        loadCompetitors();
    }, []);

    const addCompetitor = async (competitor: Competitor) => {
        const result = await createCompetitor(competitor);
        if (result.success && result.competitor) {
            setCompetitors((prev) => [...prev, result.competitor as any]);
        }
    };

    const removeCompetitor = async (id: string) => {
        const result = await deleteCompetitor(id);
        if (result.success) {
            setCompetitors((prev) => prev.filter((c) => c.id !== id));
        }
    };

    return { competitors, addCompetitor, removeCompetitor, isLoaded };
}
