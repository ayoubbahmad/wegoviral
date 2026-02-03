"use client";

import { MOCK_PERFORMANCE_POSTS, MOCK_POSTING_TIMES } from "@/lib/mock-data";
import { PostingTimeHeatmap } from "@/components/performance/PostingTimeHeatmap";
import { TopPostsGrid } from "@/components/performance/TopPostsGrid";
import { Clock, TrendingUp } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

export default function PerformancePage() {
    const { activeSocialAccount } = useAuth();
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Performance Insights</h1>
                <p className="text-muted-foreground mt-2">Understand what works and when to post for maximum impact.</p>
            </div>

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
                                    <Link
                                        href="/settings"
                                        className="inline-flex items-center justify-center px-4 py-2 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all"
                                    >
                                        Connect Now
                                    </Link>
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
                            Your audience is most active on <strong>Tuesdays at 6 PM</strong>. Try scheduling your most important content (Reels/Carousels) for this window.
                        </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-card border border-border">
                        <h3 className="font-semibold mb-4">Content Mix</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span>Reels</span>
                                <span className="font-bold">60%</span>
                            </div>
                            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-[60%]"></div>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Carousels</span>
                                <span className="font-bold">30%</span>
                            </div>
                            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 w-[30%]"></div>
                            </div>
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
                <TopPostsGrid posts={MOCK_PERFORMANCE_POSTS} />
            </div>
        </div>
    );
}
