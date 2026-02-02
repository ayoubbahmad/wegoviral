"use client";

import { Follower } from "@/types/community";
import { LoyaltyBadge } from "./LoyaltyBadge";
import { Heart, MessageCircle, Send } from "lucide-react";

interface FollowerListProps {
    followers: Follower[];
}

export function FollowerList({ followers }: FollowerListProps) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {followers.map((follower) => (
                <div
                    key={follower.id}
                    className="flex items-start gap-4 p-5 rounded-xl border border-border bg-card hover:shadow-md transition-shadow"
                >
                    <img
                        src={follower.avatarUrl}
                        alt={follower.username}
                        className="w-12 h-12 rounded-full border border-border"
                    />

                    <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                            <div>
                                <h3 className="font-semibold text-sm">{follower.fullName}</h3>
                                <p className="text-xs text-muted-foreground">@{follower.username}</p>
                            </div>
                            <LoyaltyBadge segment={follower.segment} />
                        </div>

                        <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1" title="Likes">
                                <Heart className="w-3.5 h-3.5" />
                                <span className="font-medium text-foreground">{follower.stats.likes}</span>
                            </div>
                            <div className="flex items-center gap-1" title="Comments">
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span className="font-medium text-foreground">{follower.stats.comments}</span>
                            </div>
                            <div className="flex items-center gap-1" title="Story Replies">
                                <Send className="w-3.5 h-3.5" />
                                <span className="font-medium text-foreground">{follower.stats.storyReplies}</span>
                            </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-border/50">
                            <p className="text-xs text-muted-foreground">
                                Loyalty Score: <span className="text-foreground font-semibold">{follower.loyaltyScore}/100</span>
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
