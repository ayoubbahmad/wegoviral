"use client";

import { PerformancePost } from "@/types/performance";
import { Heart, MessageCircle, Bookmark, Share2, BarChart2 } from "lucide-react";
import { useT } from '@/i18n/provider';
import { activeIntl } from '@/i18n/active';

interface TopPostsGridProps {
    posts: PerformancePost[];
}

export function TopPostsGrid({ posts }: TopPostsGridProps) {
    const t = useT();
    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map(post => (
                <div key={post.id} className="group relative bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all">
                    <div className="relative aspect-[4/5] bg-secondary">
                        <img
                            src={post.thumbnailUrl}
                            alt={t('creator.performance.thumbnail')}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 start-2 px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold rounded uppercase">
                            {post.type}
                        </div>
                    </div>

                    <div className="p-4">
                        <div className="flex justify-between items-start mb-4">
                            <p className="font-medium text-sm line-clamp-1">{post.caption}</p>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {new Date(post.postedAt).toLocaleDateString(activeIntl(), { month: 'short', day: 'numeric' })}
                            </span>
                        </div>

                        <div className="grid grid-cols-4 gap-2 py-3 border-t border-border">
                            <div className="text-center">
                                <Heart className="w-4 h-4 mx-auto mb-1 text-muted-foreground group-hover:text-red-500 transition-colors" />
                                <span className="text-xs font-semibold">{post.metrics.likes > 1000 ? (post.metrics.likes / 1000).toFixed(1) + 'k' : post.metrics.likes}</span>
                            </div>
                            <div className="text-center">
                                <MessageCircle className="w-4 h-4 mx-auto mb-1 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                                <span className="text-xs font-semibold">{post.metrics.comments}</span>
                            </div>
                            <div className="text-center">
                                <Bookmark className="w-4 h-4 mx-auto mb-1 text-muted-foreground group-hover:text-yellow-500 transition-colors" />
                                <span className="text-xs font-semibold">{post.metrics.saves}</span>
                            </div>
                            <div className="text-center">
                                <Share2 className="w-4 h-4 mx-auto mb-1 text-muted-foreground group-hover:text-green-500 transition-colors" />
                                <span className="text-xs font-semibold">{post.metrics.shares}</span>
                            </div>
                        </div>

                        <div className="mt-2 p-2 bg-secondary/30 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <BarChart2 className="w-3.5 h-3.5" /> {t('creator.performance.reach')}
                            </div>
                            <span className="text-sm font-bold">{(post.metrics.reach / 1000).toFixed(1)}k</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
