import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { Competitor } from "@/types/competitor";

// API Endpoints
export const COMPETITOR_DETAIL_ENDPOINTS = {
    GET_BY_ID: (id: string) => `/competitors/${id}`,
};

// Response Types
// Note: We use the centralized Competitor type, but we could define more specific ones here if needed
export type GetCompetitorResponse = Competitor;

// Tanstack Query Hooks
export const useGetCompetitor = (id: string) => {
    return useQuery<GetCompetitorResponse>({
        queryKey: ["competitor", id],
        queryFn: () => apiClient.get(COMPETITOR_DETAIL_ENDPOINTS.GET_BY_ID(id)),
        enabled: !!id,
    });
};
