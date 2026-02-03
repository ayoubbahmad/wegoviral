"use client";

import { VideoCard, Video } from "@/components/videos/VideoCard";

const MOCK_VIDEOS: Video[] = [
    {
        id: "1",
        title: "You Don't Wanna Miss This",
        thumbnailUrl: "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=800&q=80",
        channelName: "raywilliamjohnson",
        channelAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=ray",
        publishedAt: "1w ago",
        views: "106K",
        likes: "12K",
        platform: "youtube",
        metrics: {
            outlierScore: "1x",
            views: "106K",
            engagementRate: "6%",
        },
    },
    {
        id: "2",
        title: "The $20 Billion Quantum IPO That Changes Everything",
        thumbnailUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80",
        channelName: "stocksharks",
        channelAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=stock",
        publishedAt: "1w ago",
        views: "31K",
        likes: "2.4K",
        platform: "tiktok",
        metrics: {
            outlierScore: "1.1x",
            views: "31K",
            engagementRate: "2%",
        },
    },
    {
        id: "3",
        title: "pastor bugging",
        thumbnailUrl: "https://images.unsplash.com/photo-1542598380-ec62c0b621e8?w=800&q=80",
        channelName: "xaviuniverse",
        channelAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=xavi",
        publishedAt: "1w ago",
        views: "3.9M",
        likes: "340K",
        platform: "instagram",
        metrics: {
            outlierScore: "1.1x",
            views: "3.9M",
            engagementRate: "13%",
        },
    },
    {
        id: "4",
        title: "The IPO market is poised to boom in 2026",
        thumbnailUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80",
        channelName: "stocksharks",
        channelAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=stock",
        publishedAt: "1w ago",
        views: "51K",
        likes: "1.2K",
        platform: "tiktok",
        metrics: {
            outlierScore: "1.9x",
            views: "51K",
            engagementRate: "1%",
        },
    },
    {
        id: "5",
        title: "Why it feels hard",
        thumbnailUrl: "https://images.unsplash.com/photo-1596707328675-d14457224855?w=800&q=80",
        channelName: "sapiscience",
        channelAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=sapi",
        publishedAt: "1w ago",
        views: "164K",
        likes: "12K",
        platform: "tiktok",
        metrics: {
            outlierScore: "1.2x",
            views: "164K",
            engagementRate: "9%",
        },
    },
    {
        id: "6",
        title: "TRY THIS",
        thumbnailUrl: "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=800&q=80",
        channelName: "creative_daily",
        channelAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=creative",
        publishedAt: "5d ago",
        views: "809K",
        likes: "55K",
        platform: "instagram",
        metrics: {
            outlierScore: "1.2x",
            views: "809K",
            engagementRate: "5%",
        },
    },
    {
        id: "7",
        title: "Hidden Features in iOS 18",
        thumbnailUrl: "https://images.unsplash.com/photo-1621360841012-3f822a96b607?w=800&q=80",
        channelName: "tech_insider",
        channelAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=tech",
        publishedAt: "3d ago",
        views: "2.1M",
        likes: "120K",
        platform: "youtube",
        metrics: {
            outlierScore: "2.4x",
            views: "2.1M",
            engagementRate: "8%",
        },
    },
    {
        id: "8",
        title: "My Morning Routine 2026",
        thumbnailUrl: "https://images.unsplash.com/photo-1579737996766-02e20ec42ef3?w=800&q=80",
        channelName: "lifestyle_hub",
        channelAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=life",
        publishedAt: "2d ago",
        views: "450K",
        likes: "32K",
        platform: "instagram",
        metrics: {
            outlierScore: "1.5x",
            views: "450K",
            engagementRate: "4%",
        },
    },
];

export default function VideosPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                     {/* Breadcrumb style header if desired, or simplified */}
                    <h1 className="text-2xl font-bold tracking-tight">Videos</h1>
                    <p className="text-muted-foreground text-sm">Analyze top performing videos in your niche.</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                {MOCK_VIDEOS.map((video) => (
                    <VideoCard key={video.id} video={video} />
                ))}
            </div>
        </div>
    );
}
