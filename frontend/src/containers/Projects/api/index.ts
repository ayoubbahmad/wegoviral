import { useQuery } from "@tanstack/react-query";
import { Project } from "./types";

export * from "./types";

// API Endpoints
export const PROJECTS_ENDPOINTS = {
    GET_LIST: '/projects',
};

// Tanstack Query Hooks
export const useGetProjects = () => {
    return useQuery<Project[]>({
        queryKey: ["projects"],
        queryFn: async () => {
            // Mocking the API call for now
            return [
                { id: '1', name: "Personal Brand 2024", items: 12, lastModified: "2h ago" },
                { id: '2', name: "Client Work: Fitness", items: 5, lastModified: "1d ago" },
                { id: '3', name: "YouTube Main Channel", items: 48, lastModified: "3d ago" },
                { id: '4', name: "TikTok Shorts Batch", items: 8, lastModified: "1w ago" },
            ];
        },
    });
};
