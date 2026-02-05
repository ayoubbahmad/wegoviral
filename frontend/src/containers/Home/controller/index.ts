"use client";

import { 
  Users, 
  Activity, 
  Eye, 
  ArrowUpRight 
} from "lucide-react";

export const useHomeController = () => {
    // In a real app, you might fetch this data using Tanstack Query
    const stats = [
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

    const videos = [1, 2];
    const scripts = [1, 2];
    const projects = [
        { name: "30-Day Growth Challenge", progress: 65, color: "bg-amber-500" },
        { name: "Creator OS Launch", progress: 92, color: "bg-emerald-500" }
    ];
    const challenges = [
        { name: "Viral Hook Marathon", recruits: 1284, hot: true },
        { name: "Consistency Sprint", recruits: 450, hot: false }
    ];

    return {
        stats,
        videos,
        scripts,
        projects,
        challenges
    };
};
