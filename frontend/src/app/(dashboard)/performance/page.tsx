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
import { PageContainer } from "@/components/ui/PageContainer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProgressBar } from "@/components/ui/ProgressBar";

export default function PerformancePage() {
    const { activeSocialAccount } = useAuth();
    const { posts, insights, isLoading } = usePerformance();

    const dataPosts = (posts && posts.length > 0) ? posts : MOCK_PERFORMANCE_POSTS;
    const contentMix = insights?.contentMix || [
        { label: "Reels", value: 60, color: "bg-blue-500" },
        { label: "Carousels", value: 30, color: "bg-purple-500" },
    ];

    return (
        <PageContainer className="animate-in fade-in duration-500">
            <PageHeader 
                title="Performance Insights"
                description="Understand what works and when to post for maximum impact."
            />

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Heatmap Section */}
                <div className="lg:col-span-2 p-6 rounded-2xl bg-card border border-border shadow-sm relative overflow-hidden">
                    <SectionHeader 
                      title="Best Time to Post"
                      icon={Clock}
                      description="Based on historical engagement rates."
                      className="mb-6"
                      titleClassName="text-lg"
                    />

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
                        <SectionHeader 
                          title="Content Mix" 
                          className="mb-4" 
                          titleClassName="text-base"
                        />
                        <div className="space-y-4">
                            {contentMix.map((item: any, i: number) => (
                                <div key={i} className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-medium">
                                        <span>{item.label}</span>
                                        <span className="text-muted-foreground">{item.value}%</span>
                                    </div>
                                    <ProgressBar value={item.value} color={item.color} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-border pt-8">
                <SectionHeader 
                  title="Top Performing Content"
                  icon={TrendingUp}
                  className="mb-6"
                />
                {isLoading ? (
                    <div className="p-12 text-center text-muted-foreground">Loading posts...</div>
                ) : (
                    <TopPostsGrid posts={dataPosts} />
                )}
            </div>
        </PageContainer>
    );
}
