import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { GetCompetitorResponse } from "./types";

export * from "./types";

// API Endpoints
export const COMPETITOR_DETAIL_ENDPOINTS = {
    GET_BY_ID: (id: string) => `/competitors/${id}`,
};

// Tanstack Query Hooks
export const useGetCompetitor = (id: string) => {
    return useQuery<GetCompetitorResponse>({
        queryKey: ["competitor", id],
        queryFn: () => apiClient.get(COMPETITOR_DETAIL_ENDPOINTS.GET_BY_ID(id)),
        enabled: !!id,
    });
};
