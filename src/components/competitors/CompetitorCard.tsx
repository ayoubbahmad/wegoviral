"use client";

import { Competitor } from "@/types/competitor";
import { Users, Activity, TrendingUp } from "lucide-react";
import Link from "next/link";

interface CompetitorCardProps {
    competitor: Competitor;
}

export function CompetitorCard({ competitor }: CompetitorCardProps) {
    return (
        <Link
            href={`/competitors/${competitor.id}`}
            className="group relative flex flex-col gap-4 p-5 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all cursor-pointer"
        >
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <img
                        src={competitor.avatarUrl}
                        alt={competitor.name}
                        className="w-12 h-12 rounded-full border border-border"
                    />
                    <div>
                        <h3 className="font-semibold leading-tight">{competitor.name}</h3>
                        <p className="text-sm text-muted-foreground">{competitor.handle}</p>
                    </div>
                </div>

                {competitor.isFollowing && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 border border-green-500/20">
                        Tracking
                    </span>
                )}
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                {competitor.bio}
            </p>

            <div className="flex items-center gap-2 flex-wrap">
                {competitor.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground font-medium">
                        {tag}
                    </span>
                ))}
            </div>

            <div className="pt-4 mt-auto border-t border-border grid grid-cols-3 gap-2">
                <div className="text-center">
                    <div className="text-xs text-muted-foreground flex items-center justify-center gap-1 mb-1">
                        <Users className="w-3 h-3" /> Followers
                    </div>
                    <span className="font-bold text-sm block">{competitor.stats.followers}</span>
                </div>
                <div className="text-center border-l border-border">
                    <div className="text-xs text-muted-foreground flex items-center justify-center gap-1 mb-1">
                        <Activity className="w-3 h-3" /> Avg. Likes
                    </div>
                    <span className="font-bold text-sm block">{competitor.stats.avgLikes}</span>
                </div>
                <div className="text-center border-l border-border">
                    <div className="text-xs text-muted-foreground flex items-center justify-center gap-1 mb-1">
                        <TrendingUp className="w-3 h-3" /> Eng. Rate
                    </div>
                    <span className="font-bold text-sm block text-green-500">{competitor.stats.engagementRate}</span>
                </div>
            </div>
        </Link>
    );
}
