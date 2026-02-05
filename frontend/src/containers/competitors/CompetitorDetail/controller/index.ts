import { useState } from "react";
import { useToast } from "@/providers/Toast";
import { Competitor } from '@/types/competitor';
import { useGetCompetitor } from "../api";

export const useCompetitorDetailController = (id: string) => {
    const { showToast } = useToast();
    const [savedHooks, setSavedHooks] = useState<string[]>([]);
    const [savedStructures, setSavedStructures] = useState<string[]>([]);

    const { data: competitor, isLoading, error } = useGetCompetitor(id);

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
        error,
        savedHooks,
        savedStructures,
        handleSave,
    };
};
