"use client";

import { useState } from "react";
import { MOCK_COMMUNITY } from "@/lib/mock-data";
import { FollowerList } from "@/components/community/FollowerList";
import { Users, UserCheck, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CommunityPage() {
    const [filter, setFilter] = useState<"All" | "VIP" | "New">("All");

    const filteredFollowers = MOCK_COMMUNITY.filter(f => {
        if (filter === "All") return true;
        if (filter === "VIP") return f.segment === "VIP" || f.segment === "Superfan";
        if (filter === "New") return f.segment === "New";
        return true;
    });

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
                    <span className="text-2xl font-bold">12,345</span>
                    <span className="text-xs text-green-500 ml-2 font-medium">+12% this month</span>
                </div>

                <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-600">
                            <UserCheck className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">Loyal Fans (VIP)</span>
                    </div>
                    <span className="text-2xl font-bold">482</span>
                    <p className="text-xs text-muted-foreground mt-1">Fans with highly consistent engagement.</p>
                </div>

                <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600">
                            <UserPlus className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">New Faces</span>
                    </div>
                    <span className="text-2xl font-bold">145</span>
                    <p className="text-xs text-muted-foreground mt-1">Joined in the last 30 days.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 border-b border-border pb-4">
                {["All", "VIP", "New"].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f as any)}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                            filter === f
                                ? "bg-secondary text-foreground"
                                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                        )}
                    >
                        {f === "VIP" ? "Loyal & VIP" : f === "New" ? "New Faces" : "All Members"}
                    </button>
                ))}
            </div>

            {/* List */}
            <FollowerList followers={filteredFollowers} />
        </div>
    );
}
