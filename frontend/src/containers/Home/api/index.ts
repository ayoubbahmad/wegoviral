import { useQuery } from "@tanstack/react-query";
import { 
  Users, 
  Activity, 
  Eye, 
  ArrowUpRight 
} from "lucide-react";
import { HomeStats } from "./types";

export * from "./types";

// API Endpoints
export const HOME_ENDPOINTS = {
    GET_STATS: '/home/stats',
};

// Tanstack Query Hooks
export const useGetHomeStats = () => {
    return useQuery<HomeStats[]>({
        queryKey: ["home-stats"],
        queryFn: async () => {
            // Mocking the API call for now
            return [
                {
                    label: "Total Followers",
                    value: "12,345",
                    trend: 12,
                    icon: Users,
                },
                {
                    label: "Avg. Engagement",
                    value: "4.8%",
                    trend: 2.1,
                    icon: Activity,
                },
                {
                    label: "Impressions (30d)",
                    value: "45.2k",
                    trend: 8,
                    icon: Eye,
                },
                {
                    label: "Content Score",
                    value: "92",
                    icon: ArrowUpRight,
                },
            ];
        },
    });
};
