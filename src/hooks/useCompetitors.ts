"use client";

import { useState, useEffect } from "react";
import { Competitor } from "@/types/competitor";
import { MOCK_COMPETITORS } from "@/lib/mock-data";

export function useCompetitors() {
    const [competitors, setCompetitors] = useState<Competitor[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("creator_os_competitors");
        if (stored) {
            setCompetitors(JSON.parse(stored));
        } else {
            setCompetitors(MOCK_COMPETITORS);
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("creator_os_competitors", JSON.stringify(competitors));
        }
    }, [competitors, isLoaded]);

    const addCompetitor = (competitor: Competitor) => {
        setCompetitors((prev) => [...prev, competitor]);
    };

    const removeCompetitor = (id: string) => {
        setCompetitors((prev) => prev.filter((c) => c.id !== id));
    };

    return { competitors, addCompetitor, removeCompetitor, isLoaded };
}
