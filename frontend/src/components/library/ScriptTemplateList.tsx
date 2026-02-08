"use client";

import { ScriptTemplate } from "@/containers/Library/api/types";
import { FileText, ChevronRight, Trash2, Edit2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card } from "../ui/Card";

interface ScriptTemplateListProps {
    scripts: ScriptTemplate[];
    viewType?: "grid" | "table";
    onDelete?: (id: string) => void;
    onUpdate?: (id: string, updates: Partial<ScriptTemplate>) => void;
}

export function ScriptTemplateList({ scripts, viewType = "table", onDelete, onUpdate }: ScriptTemplateListProps) {
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const handleCopy = (id: string, structure: any[]) => {
        const text = structure.map(s => `${s.step}: ${s.description}`).join('\n');
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();

        if (confirm("Are you sure you want to delete this script template?")) {
            setIsDeleting(id);
            await onDelete?.(id);
            setIsDeleting(null);
        }
    };

    
    if (viewType === "grid") {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {scripts.map((script) => (
                    <Card 
                        key={script.id}
                        hover
                        padding="none"
                        className="group flex flex-col h-full overflow-hidden"
                        onClick={() => handleCopy(script.id, script.content)}
                    >
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-secondary rounded-xl group-hover:scale-110 transition-transform">
                                    <FileText className="w-6 h-6 text-foreground" />
                                </div>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-bold uppercase tracking-widest border border-border">
                                    {script.category}
                                </span>
                            </div>

                            <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">{script.title}</h3>
                            
                            <div className="text-xs text-muted-foreground flex flex-wrap gap-1 mb-6">
                                {script.content.slice(0, 3).map((step: any, i: number) => (
                                    <span key={i} className="flex items-center">
                                        {step.step}
                                        {i < Math.min(script.content.length, 3) - 1 && <ChevronRight className="w-3 h-3 mx-0.5 opacity-50" />}
                                    </span>
                                ))}
                                {script.content.length > 3 && <span>...</span>}
                            </div>

                            <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/30">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCopy(script.id, script.content);
                                    }}
                                    className={cn(
                                        "text-xs font-bold uppercase tracking-widest transition-colors",
                                        copiedId === script.id ? "text-green-500" : "text-primary hover:text-primary/80"
                                    )}
                                >
                                    {copiedId === script.id ? "Copied!" : "Use Template"}
                                </button>
                                <button
                                    onClick={(e) => handleDelete(e, script.id)}
                                    disabled={isDeleting === script.id}
                                    className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-muted-foreground hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <table className="w-full text-left">
                <thead className="border-b border-border bg-muted/30">
                    <tr>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Template</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Category</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Structure</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                    {scripts.map((script) => (
                        <tr 
                            key={script.id} 
                            className="group hover:bg-muted/5 transition-colors cursor-pointer"
                            onClick={() => handleCopy(script.id, script.content)}
                        >
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm font-bold">{script.title}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-bold uppercase tracking-widest">
                                    {script.category}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <p className="text-xs text-muted-foreground line-clamp-1">
                                    {script.content.map((s: any) => s.step).join(' → ')}
                                </p>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCopy(script.id, script.content);
                                        }}
                                        className={cn(
                                            "text-[10px] font-black uppercase tracking-tighter",
                                            copiedId === script.id ? "text-green-500" : "text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                                        )}
                                    >
                                        {copiedId === script.id ? "Copied" : "Use"}
                                    </button>
                                    <button
                                        onClick={(e) => handleDelete(e, script.id)}
                                        className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-muted-foreground hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
