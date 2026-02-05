import { useQuery } from "@tanstack/react-query";
import { HookTemplate, StyleTemplate } from "./types";

export * from "./types";

// API Endpoints
export const SCRIPT_WIZARD_ENDPOINTS = {
    GET_HOOK_TEMPLATES: '/scripts/hooks',
    GET_STYLE_TEMPLATES: '/scripts/styles',
};

// Tanstack Query Hooks
export const useGetHookTemplates = () => {
    return useQuery<HookTemplate[]>({
        queryKey: ["hook-templates"],
        queryFn: async () => {
            // Mocking the API call for now
            return [
                { id: 1, title: 'Google Alpha Earth', views: '23M', thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&q=80' },
                { id: 2, title: 'What would happen if', views: '9.4M', thumbnailUrl: 'https://images.unsplash.com/photo-1484589065579-248aad0d8b13?w=300&q=80' },
                { id: 3, title: "Education | Here's What Hap...", views: '1.7M', thumbnailUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&q=80' },
                { id: 4, title: 'Question | Is it Just Me?', views: '820M', thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&q=80' },
                { id: 5, title: 'Question | 5 Minute...', views: '1M', thumbnailUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&q=80' },
            ];
        },
    });
};

export const useGetStyleTemplates = () => {
    return useQuery<StyleTemplate[]>({
        queryKey: ["style-templates"],
        queryFn: async () => {
            // Mocking the API call for now
            return [
                { id: 1, title: 'Google Alpha Earth', views: '2M', thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&q=80' },
                { id: 2, title: 'What would happen if', views: '9.4M', thumbnailUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&q=80' },
                { id: 3, title: 'Listicle (5 Steps)', views: '1M', thumbnailUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&q=80' },
                { id: 4, title: 'Long Tutorial', views: '1.7M', thumbnailUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80' },
                { id: 5, title: 'Rapid Tutorial', views: '580K', thumbnailUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=300&q=80' },
            ];
        },
    });
};
