"use client";

import { Competitor } from "@/types/competitor";
import { Trash2, Users, Activity, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface CompetitorCardProps {
    competitor: Competitor;
    onDelete?: (id: string) => void;
}

import { Card } from "../ui/Card";

export function CompetitorCard({ competitor, onDelete }: CompetitorCardProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm(`Are you sure you want to stop tracking ${competitor.handle}?`)) {
            setIsDeleting(true);
            await onDelete?.(competitor.id);
            setIsDeleting(false);
        }
    };

    return (
        <Link href={`/competitors/${competitor.id}`} className="group block h-full">
            <Card hover className="flex flex-col h-full overflow-hidden">
                <Card.Header 
                    actions={
                        <div className="flex items-center gap-2">
                             {competitor.isFollowing && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-green-500/10 text-green-600 uppercase tracking-wider">
                                    Tracking
                                </span>
                            )}
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-muted-foreground hover:text-red-500 transition-colors"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    }
                >
                    <div className="flex items-center gap-3">
                        <img
                            src={competitor.avatarUrl}
                            alt={competitor.name}
                            className="w-12 h-12 rounded-full border border-border flex-shrink-0"
                        />
                        <div className="min-w-0">
                            <h3 className="font-bold leading-tight truncate text-foreground group-hover:text-primary transition-colors">{competitor.name}</h3>
                            <p className="text-xs text-muted-foreground font-medium">{competitor.handle}</p>
                        </div>
                    </div>
                </Card.Header>

                <Card.Content className="space-y-4">
                    <p className="text-sm text-muted-foreground font-medium line-clamp-2 min-h-[40px]">
                        {competitor.bio}
                    </p>

                    <div className="flex items-center gap-2 flex-wrap pb-2">
                        {competitor.tags.map(tag => (
                            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground font-black uppercase tracking-widest">
                                {tag}
                            </span>
                        ))}
                    </div>
                </Card.Content>

                <Card.Footer 
                    metadata={
                        <div className="grid grid-cols-3 w-full divide-x divide-border/30 text-center">
                            <div className="px-1">
                                <Card.MetaItem icon={Users} label={competitor.stats.followers} className="justify-center mb-0.5" />
                                <span className="text-[9px] uppercase tracking-tighter text-muted-foreground/50">Followers</span>
                            </div>
                            <div className="px-1">
                                <Card.MetaItem icon={Activity} label={competitor.stats.avgLikes} className="justify-center mb-0.5" />
                                <span className="text-[9px] uppercase tracking-tighter text-muted-foreground/50">Avg. Likes</span>
                            </div>
                            <div className="px-1">
                                <Card.MetaItem icon={TrendingUp} label={competitor.stats.engagementRate} className="justify-center mb-0.5 text-green-500" />
                                <span className="text-[9px] uppercase tracking-tighter text-muted-foreground/50">Engagement</span>
                            </div>
                        </div>
                    }
                />
            </Card>
        </Link>
    );
}
