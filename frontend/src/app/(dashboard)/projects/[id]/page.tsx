'use client';

import { useParams } from 'next/navigation';
import { ProjectCard } from "@/components/projects/ProjectCard";
import { VideoTable } from "@/components/videos/VideoTable";
import { ChevronLeft, Play, MoreHorizontal, LayoutGrid, List, Plus, Search, Filter } from "lucide-react";
import Link from "next/link";
import { useState } from 'react';
import { cn } from "@/lib/utils";

// Mock data for a project's videos
const MOCK_PROJECT_VIDEOS = [
    {
        id: '1',
        title: "Fast for 30 Days during Ramadan ? Fasting isn't just about skipping meals—it rewires your metabolism...",
        thumbnailUrl: 'https://images.unsplash.com/photo-1541534741688-6078c65b5a33?w=800&q=400',
        channelName: '@zack.chug',
        channelAvatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zack',
        publishedAt: '11mo ago',
        views: '1.2M',
        likes: '45K',
        platform: 'youtube' as const,
        metrics: {
            outlierScore: '5.2x',
            views: '1.2M',
            engagementRate: '8.4%'
        }
    },
    {
        id: '2',
        title: "How I use AI to automate my creative workflow and save 20+ hours every week. This is the future...",
        thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=400',
        channelName: '@tech.creator',
        channelAvatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tech',
        publishedAt: '2d ago',
        views: '850K',
        likes: '120K',
        platform: 'tiktok' as const,
        metrics: {
            outlierScore: '12.5x',
            views: '850K',
            engagementRate: '15.2%'
        }
    },
    {
        id: '3',
        title: "3 Tips for better lighting in your home office without spending a fortune on expensive equipment...",
        thumbnailUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=400',
        channelName: '@design.tips',
        channelAvatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=design',
        publishedAt: '1w ago',
        views: '520K',
        likes: '32K',
        platform: 'instagram' as const,
        metrics: {
            outlierScore: '2.1x',
            views: '520K',
            engagementRate: '6.1%'
        }
    }
];

const PROJECT_MAP: Record<string, string> = {
    '1': 'Personal Brand 2024',
    '2': 'Client Work: Fitness',
    '3': 'YouTube Main Channel',
    '4': 'TikTok Shorts Batch',
    'steal-like-an-artist': 'Steal like an artist',
    'tutorials': 'Tutorials'
};

export default function ProjectDetailsPage() {
    const params = useParams();
    const id = params?.id as string;
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
    const projectName = PROJECT_MAP[id] || 'Unnamed Project';

    return (
        <div className="space-y-10 pb-32">
            {/* Header / Breadcrumbs */}
            <div className="space-y-6">
                <Link 
                    href="/projects" 
                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all group"
                >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to projects
                </Link>
                
                <div className="flex items-end justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20">Project</span>
                            <h1 className="text-3xl font-bold tracking-tight">{projectName}</h1>
                        </div>
                        <p className="text-muted-foreground font-medium flex items-center gap-2">
                            {MOCK_PROJECT_VIDEOS.length} videos saved in this project
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-3 pb-1">
                        <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-[10px] hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95">
                            <Play className="w-3.5 h-3.5 fill-current" /> Analyze all
                        </button>
                        <button className="p-3 rounded-2xl bg-secondary/50 border border-border/50 text-muted-foreground hover:text-foreground transition-all">
                            <Plus className="w-5 h-5" />
                        </button>
                        <button className="p-3 rounded-2xl bg-secondary/50 border border-border/50 text-muted-foreground hover:text-foreground transition-all">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between p-4 rounded-3xl bg-card/30 border border-border/50">
                <div className="flex items-center gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input 
                            type="text" 
                            placeholder="Search videos in project..." 
                            className="w-full bg-secondary/20 border border-border/30 rounded-2xl pl-11 pr-4 py-2.5 text-sm font-medium outline-none focus:border-primary/50 transition-colors"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-secondary/30 border border-border/30 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all">
                        <Filter className="w-4 h-4" /> Filters
                    </button>
                </div>

                <div className="flex items-center gap-1 p-1 bg-secondary/20 rounded-2xl border border-border/30">
                    <button 
                        onClick={() => setViewMode('table')}
                        className={cn(
                            "p-2 rounded-xl transition-all",
                            viewMode === 'table' ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <List className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => setViewMode('grid')}
                        className={cn(
                            "p-2 rounded-xl transition-all",
                            viewMode === 'grid' ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Videos List/Grid */}
            {viewMode === 'table' ? (
                <VideoTable videos={MOCK_PROJECT_VIDEOS as any} />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {/* Grid view would use VideoCard, but for now we focus on the table as the primary view for projects */}
                    <div className="col-span-full py-20 text-center space-y-4">
                        <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto text-muted-foreground/30">
                            <LayoutGrid className="w-8 h-8" />
                        </div>
                        <p className="text-muted-foreground font-medium">Grid view is coming soon. Use table view for organized analysis.</p>
                        <button 
                            onClick={() => setViewMode('table')}
                            className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                        >
                            Switch to table view
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
