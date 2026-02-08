"use client";

import { Hook } from "@/containers/Library/api/types";
import { Edit2, Trash2, Copy, Star, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface HookCardProps {
    hook: Hook;
    onDelete?: (id: string) => void;
    onUpdate?: (id: string, updates: Partial<Hook>) => void;
}

export function HookCard({ hook, onDelete, onUpdate }: HookCardProps) {
    const [copied, setCopied] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(hook.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this hook?")) {
            setIsDeleting(true);
            await onDelete?.(hook.id);
            setIsDeleting(false);
        }
    };

    return (
        <div className="group relative rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
            <div className="flex items-start justify-between mb-4">
                <div className="flex gap-2">
                    <span className={cn(
                        "px-2 py-1 rounded-md text-xs font-medium",
                        hook.type === "Verbal" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" :
                            hook.type === "Visual" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" :
                                "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                    )}>
                        {hook.type}
                    </span>
                    <span className="px-2 py-1 rounded-md text-xs font-medium bg-secondary text-secondary-foreground flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {hook.emotion}
                    </span>
                </div>
                <div className="flex items-center gap-1 text-yellow-500">
                    {Array.from({ length: hook.performanceRating || 0 }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                </div>
            </div>

            <p className="text-lg font-medium leading-relaxed mb-6 line-clamp-3">
                "{hook.content}"
            </p>

            <div className="flex items-center justify-between mt-auto">
                <span className="text-xs text-muted-foreground">{hook.topic}</span>
                <div className="flex items-center gap-1">
                    <button
                        onClick={copyToClipboard}
                        className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                        title="Copy content"
                    >
                        <Copy className={cn("w-4 h-4", copied && "text-green-500")} />
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-muted-foreground hover:text-red-500 transition-colors"
                        title="Delete hook"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {(hook.usageCount || 0) > 0 && (
                <div className="pt-3 mt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                    <span>Used {hook.usageCount} time{hook.usageCount !== 1 ? 's' : ''}</span>
                    {hook.lastUsed && <span>Last: {new Date(hook.lastUsed).toLocaleDateString()}</span>}
                </div>
            )}
        </div>
    );
}
