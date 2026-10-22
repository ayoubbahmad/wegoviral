"use client";

import { Follower } from "@/types/followers";
import { LoyaltyBadge } from "./LoyaltyBadge";
import { Heart, MessageCircle, Send, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Modal } from "@/components/Modal";
import { useT } from '@/i18n/provider';

interface FollowerListProps {
    followers: Follower[];
}

export function FollowerList({ followers }: FollowerListProps) {
    const t = useT();
    const [selectedFollower, setSelectedFollower] = useState<Follower | null>(null);

    return (
        <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {followers.map((follower) => (
                    <div
                        key={follower.id}
                        className="flex items-start gap-4 p-5 rounded-xl border border-border bg-card hover:shadow-md transition-shadow relative group"
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
                                    <a
                                        href={`https://instagram.com/${follower.username}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[10px] text-blue-500 hover:underline flex items-center gap-0.5 mt-0.5"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {t('creator.followers.openInstagram')} <ExternalLink className="w-2.5 h-2.5" />
                                    </a>
                                </div>
                                <LoyaltyBadge segment={follower.segment} />
                            </div>

                            <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1" title={t('creator.followers.likes')}>
                                    <Heart className="w-3.5 h-3.5" />
                                    <span className="font-medium text-foreground">{follower.stats.likes}</span>
                                </div>
                                <div className="flex items-center gap-1" title={t('creator.followers.comments')}>
                                    <MessageCircle className="w-3.5 h-3.5" />
                                    <span className="font-medium text-foreground">{follower.stats.comments}</span>
                                </div>
                                <div className="flex items-center gap-1" title={t('creator.followers.storyReplies')}>
                                    <Send className="w-3.5 h-3.5" />
                                    <span className="font-medium text-foreground">{follower.stats.storyReplies}</span>
                                </div>
                            </div>

                            <div className="mt-3 pt-3 border-t border-border/50 flex justify-between items-end">
                                <p className="text-xs text-muted-foreground">
                                    {t('creator.followers.loyalty')} <span className="text-foreground font-semibold">{follower.loyaltyScore}/100</span>
                                </p>
                                {follower.sampleComments && (
                                    <button
                                        onClick={() => setSelectedFollower(follower)}
                                        className="text-xs text-primary hover:underline font-medium"
                                    >
                                        {t('creator.followers.viewComments')}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={!!selectedFollower} onClose={() => setSelectedFollower(null)} title={t('creator.followers.commentsBy', { username: selectedFollower?.username ?? '' })}>
                <div className="space-y-3">
                    {selectedFollower?.sampleComments?.map((comment, i) => (
                        <div key={i} className="p-3 rounded-lg bg-secondary/50 border border-border text-sm">
                            “{comment}”
                        </div>
                    ))}
                    {(!selectedFollower?.sampleComments || selectedFollower.sampleComments.length === 0) && (
                        <p className="text-muted-foreground text-center py-4">{t('creator.followers.noComments')}</p>
                    )}
                </div>
            </Modal>
        </>
    );
}
