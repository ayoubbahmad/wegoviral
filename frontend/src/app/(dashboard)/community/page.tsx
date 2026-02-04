"use client";

import { useState } from "react";
import { useCommunity } from "@/hooks/useCommunity";
import { FollowerList } from "@/components/community/FollowerList";
import { Users, UserCheck, UserPlus, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_COMMUNITY } from "@/lib/mock-data";

export default function CommunityPage() {
    const { followers, summary, isLoading } = useCommunity();
    const [filter, setFilter] = useState<"All" | "VIP" | "New" | "TopLikers">("All");

    // Fallback to mock data if no followers yet to show the UI value
    const dataToUse = (followers && followers.length > 0) ? followers : MOCK_COMMUNITY;

    const getFilteredAndSortedFollowers = () => {
        let result = [...dataToUse];

        // Filter
        if (filter === "VIP") {
            result = result.filter(f => f.segment === "VIP" || f.segment === "Superfan");
        } else if (filter === "New") {
            result = result.filter(f => f.segment === "New");
        }

        // Sort
        if (filter === "TopLikers") {
            result.sort((a, b) => b.stats.likes - a.stats.likes);
        }

        return result;
    };

    const displayedFollowers = getFilteredAndSortedFollowers();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Community Intelligence</h1>
                <p className="text-muted-foreground mt-2">Identify your most valuable fans and understand who is engaging with you.</p>
            </div>

            {/* Health Stats */}
            <div className="grid gap-6 md:grid-cols-3">
                <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <Users className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">Total Community</span>
                    </div>
                    <span className="text-2xl font-bold">{summary.total || "12,345"}</span>
                    {!summary.total && <span className="text-xs text-green-500 ml-2 font-medium">+12% this month</span>}
                </div>

                <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-600">
                            <UserCheck className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">Loyal Fans (VIP)</span>
                    </div>
                    <span className="text-2xl font-bold">{summary.vips || "482"}</span>
                    <p className="text-xs text-muted-foreground mt-1">Fans with highly consistent engagement.</p>
                </div>

                <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600">
                            <UserPlus className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">New Faces</span>
                    </div>
                    <span className="text-2xl font-bold">{summary.newThisMonth || "145"}</span>
                    <p className="text-xs text-muted-foreground mt-1">Joined in the last 30 days.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 border-b border-border pb-4 overflow-x-auto">
                {[
                    { id: "All", label: "All Members", icon: Users },
                    { id: "VIP", label: "Loyal & VIP", icon: UserCheck },
                    { id: "TopLikers", label: "Top Likers", icon: ThumbsUp },
                    { id: "New", label: "New Faces", icon: UserPlus },
                ].map((f) => (
                    <button
                        key={f.id}
                        onClick={() => setFilter(f.id as any)}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap",
                            filter === f.id
                                ? "bg-secondary text-foreground"
                                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                        )}
                    >
                        <f.icon className="w-4 h-4" />
                        {f.label}
                    </button>
                ))}
            </div>

            {/* List */}
            {isLoading ? (
                <div className="p-12 text-center text-muted-foreground">Loading community data...</div>
            ) : (
                <FollowerList followers={displayedFollowers} />
            )}
        </div>
    );
}
