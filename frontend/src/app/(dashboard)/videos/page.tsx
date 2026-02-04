"use client";

import { useState } from "react";
import { VideoCard, Video } from "@/components/videos/VideoCard";
import { VideoTable } from "@/components/videos/VideoTable";
import { 
    Search, 
    LayoutGrid, 
    Table2, 
    ChevronDown, 
    ArrowUpDown, 
    Clock, 
    RotateCcw,
    Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

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
            outlierScore: "1.4x",
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
            outlierScore: "4.8x",
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
        publishedAt: "3d ago",
        views: "164K",
        likes: "12K",
        platform: "tiktok",
        metrics: {
            outlierScore: "1.2x",
            views: "164K",
            engagementRate: "9%",
        },
    },
];

export default function VideosPage() {
    const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

    return (
        <div className="space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Videos</h1>
                <p className="text-muted-foreground mt-2">Discover what's gone viral in your niche, and why it worked.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                {/* Search Bar */}
                <div className="relative w-full max-w-xl group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search for videos by topic..."
                        className="w-full h-11 pl-11 pr-20 rounded-xl bg-card border border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all text-sm"
                    />
                    <button className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-lg bg-secondary border border-border/50 text-xs font-bold hover:bg-secondary/80 transition-colors flex items-center gap-2 group/btn">
                        Go
                        <span className="text-[10px] opacity-50 group-hover/btn:translate-x-0.5 transition-transform">↵</span>
                    </button>
                </div>

                {/* View Controls */}
                <div className="flex items-center gap-2">
                    <div className="flex p-1 bg-card border border-border/50 rounded-xl">
                        <button 
                            onClick={() => setViewMode("table")}
                            className={cn(
                                "p-2 rounded-lg transition-all",
                                viewMode === "table" ? "bg-primary/10 text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                            )}
                            title="Table View"
                        >
                            <Table2 className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => setViewMode("cards")}
                            className={cn(
                                "p-2 rounded-lg transition-all",
                                viewMode === "cards" ? "bg-primary/10 text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                            )}
                            title="Grid View"
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                    </div>

                    <button className="h-11 px-4 rounded-xl bg-card border border-border/50 text-muted-foreground hover:text-foreground hover:border-border transition-all flex items-center gap-2 text-sm font-medium">
                        <ArrowUpDown className="w-4 h-4" />
                        Sort
                    </button>
                    
                    <button className="h-11 px-4 rounded-xl bg-card border border-border/50 text-muted-foreground hover:text-foreground hover:border-border transition-all flex items-center gap-2 text-sm font-medium">
                        <Filter className="w-4 h-4" />
                        Filters
                    </button>

                    <button className="h-11 w-11 flex items-center justify-center rounded-xl bg-card border border-border/50 text-muted-foreground hover:text-foreground transition-all">
                        <Clock className="w-4 h-4" />
                    </button>

                    <button className="h-11 w-11 flex items-center justify-center rounded-xl bg-card border border-border/50 text-muted-foreground hover:text-foreground transition-all">
                        <RotateCcw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {viewMode === "cards" ? (
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                    {MOCK_VIDEOS.map((video) => (
                        <VideoCard key={video.id} video={video} />
                    ))}
                </div>
            ) : (
                <VideoTable videos={MOCK_VIDEOS} />
            )}
        </div>
    );
}
