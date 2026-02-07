"use client";

import { usePerformance } from "@/hooks/usePerformance";
import { PostingTimeHeatmap } from "@/components/performance/PostingTimeHeatmap";
import { TopPostsGrid } from "@/components/performance/TopPostsGrid";
import { Clock, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/Auth";
import Link from "next/link";
import { MOCK_PERFORMANCE_POSTS, MOCK_POSTING_TIMES } from "@/lib/mock-data";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";

export default function PerformancePage() {
    const { activeSocialAccount } = useAuth();
    const { posts, insights, isLoading } = usePerformance();

    const dataPosts = (posts && posts.length > 0) ? posts : MOCK_PERFORMANCE_POSTS;
    const contentMix = insights?.contentMix || [
        { label: "Reels", value: 60, color: "bg-blue-500" },
        { label: "Carousels", value: 30, color: "bg-purple-500" },
    ];

    return (
        <div className="space-y-12 animate-in fade-in duration-500 pb-12">
            <PageHeader 
                title="Performance Insights"
                description="Understand what works and when to post for maximum impact."
            />

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Heatmap Section */}
                <div className="lg:col-span-2 p-6 rounded-2xl bg-card border border-border shadow-sm relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-1.5 bg-blue-500/10 rounded-lg">
                            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">Best Time to Post</h2>
                            <p className="text-xs text-muted-foreground">Based on historical engagement rates.</p>
                        </div>
                    </div>

                    {activeSocialAccount ? (
                        <PostingTimeHeatmap data={MOCK_POSTING_TIMES} />
                    ) : (
                        <div className="relative">
                            <div className="filter blur-md opacity-40 select-none pointer-events-none">
                                <PostingTimeHeatmap data={MOCK_POSTING_TIMES} />
                            </div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                                <div className="p-3 bg-background/80 backdrop-blur-md rounded-xl border border-border shadow-lg max-w-sm">
                                    <h3 className="font-semibold mb-1">Connect Social Account</h3>
                                    <p className="text-xs text-muted-foreground mb-3">
                                        Connect your account to analyze your specific audience activity and find your best posting times.
                                    </p>
                                    <Button onClick={() => window.location.href = '/settings'}>
                                        Connect Now
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Quick Stats or Insight */}
                <div className="space-y-6">
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20">
                        <h3 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">💡 Quick Insight</h3>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                            Your audience is most active on <strong>{insights?.bestTime || "Tuesdays at 6 PM"}</strong>. Try scheduling your most important content (Reels/Carousels) for this window.
                        </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-card border border-border">
                        <h3 className="font-semibold mb-4">Content Mix</h3>
                        <div className="space-y-3">
                            {contentMix.map((item: any, i: number) => (
                                <div key={i}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>{item.label}</span>
                                        <span className="font-bold">{item.value}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                                        <div className={cn("h-full", item.color)} style={{ width: `${item.value}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-border pt-8">
                <div className="flex items-center gap-2 mb-6">
                    <div className="p-1.5 bg-green-500/10 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-xl font-bold">Top Performing Content</h2>
                </div>
                {isLoading ? (
                    <div className="p-12 text-center text-muted-foreground">Loading posts...</div>
                ) : (
                    <TopPostsGrid posts={dataPosts} />
                )}
            </div>
        </div>
    );
}
