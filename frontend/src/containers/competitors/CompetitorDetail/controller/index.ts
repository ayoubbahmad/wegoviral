import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { Competitor, CompetitorPost } from "@/types/competitor";
import { useState } from "react";
import { useToast } from "@/components/ui/Toast";

export const useCompetitorDetailController = (id: string) => {
    const { showToast } = useToast();
    const [savedHooks, setSavedHooks] = useState<string[]>([]);
    const [savedStructures, setSavedStructures] = useState<string[]>([]);

    const { data: competitor, isLoading, error } = useQuery<Competitor>({
        queryKey: ["competitor", id],
        queryFn: () => apiClient.get(`/competitors/${id}`),
        enabled: !!id,
    });

    const posts = competitor?.posts || [];

    const handleSave = (postId: string, type: 'hook' | 'structure') => {
        if (type === 'hook') {
            setSavedHooks(prev => [...prev, postId]);
            showToast("Hook saved to Library!", "success");
        } else {
            setSavedStructures(prev => [...prev, postId]);
            showToast("Script Structure saved to Library!", "success");
        }
    };

    return {
        competitor,
        posts,
        isLoading,
        error: error ? (error as Error).message : null,
        savedHooks,
        savedStructures,
        handleSave,
    };
};
