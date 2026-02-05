import { useGetHomeStats } from "../api";

export const useHomeController = () => {
    const { data: stats = [], isLoading } = useGetHomeStats();

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
        isLoading,
        videos,
        scripts,
        projects,
        challenges
    };
};
