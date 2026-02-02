"use client";

import { use, useState } from "react";
import { MOCK_COMPETITORS, MOCK_COMPETITOR_POSTS } from "@/lib/mock-data";
import { ArrowLeft, ExternalLink, Heart, MessageCircle, PlayCircle, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";

export default function CompetitorDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = use(props.params);
    const competitor = MOCK_COMPETITORS.find(c => c.id === params.id);
    const posts = MOCK_COMPETITOR_POSTS[params.id] || [];

    if (!competitor) {
        notFound();
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col gap-6 border-b border-border pb-8">
                <Link href="/competitors" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors w-fit">
                    <ArrowLeft className="w-4 h-4" /> Back to List
                </Link>

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <img
                            src={competitor.avatarUrl}
                            alt={competitor.name}
                            className="w-20 h-20 rounded-full border-2 border-primary/10"
                        />
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{competitor.name}</h1>
                            <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                <span>{competitor.handle}</span>
                                <span>•</span>
                                <a href={`https://instagram.com/${competitor.handle.replace('@', '')}`} target="_blank" className="flex items-center gap-1 hover:text-primary hover:underline">
                                    Instagram <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                            <div className="flex gap-2 mt-3">
                                {competitor.tags.map(tag => (
                                    <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground border border-border">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-8 bg-card px-8 py-4 rounded-xl border border-border shadow-sm">
                        <div className="text-center">
                            <span className="block text-2xl font-bold">{competitor.stats.followers}</span>
                            <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Followers</span>
                        </div>
                        <div className="text-center border-l border-border pl-8">
                            <span className="block text-2xl font-bold">{competitor.stats.avgLikes}</span>
                            <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Avg Likes</span>
                        </div>
                        <div className="text-center border-l border-border pl-8">
                            <span className="block text-2xl font-bold text-green-500">{competitor.stats.engagementRate}</span>
                            <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Eng. Rate</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Analysis */}
            <div>
                <div className="flex items-center gap-2 mb-6">
                    <div className="p-1.5 bg-purple-500/10 rounded-lg">
                        <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h2 className="text-xl font-bold">Viral Hits & Analysis</h2>
                </div>

                {posts.length > 0 ? (
                    <div className="grid gap-6">
                        {posts.map(post => (
                            <div key={post.id} className="flex flex-col lg:flex-row gap-6 p-5 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
                                {/* Thumbnail / Visual */}
                                <div className="relative w-full lg:w-48 aspect-[4/5] bg-secondary rounded-xl overflow-hidden shrink-0 group">
                                    <img src={post.thumbnailUrl} alt="Post thumbnail" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                    {post.isViral && (
                                        <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-[10px] font-bold uppercase rounded shadow-sm flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" /> Viral
                                        </div>
                                    )}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <PlayCircle className="w-10 h-10 text-white drop-shadow-lg" />
                                    </div>
                                </div>

                                {/* Content Data */}
                                <div className="flex-1 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <p className="font-medium text-lg leading-snug line-clamp-2 pr-4">{post.captionExcerpt}</p>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                                            {new Date(post.postedAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1"><Heart className="w-4 h-4" /> {post.metrics.likes.toLocaleString()}</span>
                                        <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" /> {post.metrics.comments.toLocaleString()}</span>
                                    </div>

                                    {/* Analysis Card */}
                                    {post.analysis && (
                                        <div className="mt-4 p-4 rounded-xl bg-secondary/30 border border-border/50 space-y-3">
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Hook Strategy</span>
                                                    <p className="text-sm font-medium text-foreground bg-background px-3 py-2 rounded-lg border border-border flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                        {post.analysis.hook}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Structure</span>
                                                    <p className="text-sm font-medium text-foreground bg-background px-3 py-2 rounded-lg border border-border flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                                        {post.analysis.structure}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="pt-2">
                                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Why it worked</span>
                                                <p className="text-sm text-muted-foreground italic">"{post.analysis.notes}"</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 rounded-xl border border-dashed border-border bg-secondary/10">
                        <p className="text-muted-foreground">No posts tracked for this competitor yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
