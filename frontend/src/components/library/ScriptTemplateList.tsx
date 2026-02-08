"use client";

import { ScriptTemplate } from "@/containers/Library/api/types";
import { FileText, ChevronRight, Trash2, Edit2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ScriptTemplateListProps {
    scripts: ScriptTemplate[];
    onDelete?: (id: string) => void;
    onUpdate?: (id: string, updates: Partial<ScriptTemplate>) => void;
}

export function ScriptTemplateList({ scripts, onDelete, onUpdate }: ScriptTemplateListProps) {
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

    
    return (
        <div className="space-y-4">
            {scripts.map((script) => (
                <div
                    key={script.id}
                    className="group flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-secondary/20 transition-all cursor-pointer"
                    onClick={() => handleCopy(script.id, script.content)}
                >
                    <div className="p-3 bg-secondary rounded-lg">
                        <FileText className="w-6 h-6 text-foreground" />
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-lg">{script.title}</h3>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground border border-border">
                                {script.category}
                            </span>
                        </div>
                        <div className="text-sm text-muted-foreground flex gap-2 overflow-x-auto pb-1">
                            {script.content.map((step: any, i: number) => (
                                <span key={i} className="flex items-center whitespace-nowrap">
                                    {step.step}
                                    {i < script.content.length - 1 && <ChevronRight className="w-3 h-3 mx-1 opacity-50" />}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className={cn("flex items-center gap-2 transition-opacity", copiedId === script.id ? "opacity-100" : "opacity-0 group-hover:opacity-100")}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCopy(script.id, script.content);
                            }}
                            className={cn(
                                "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                                copiedId === script.id
                                    ? "bg-green-500 text-white"
                                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                            )}
                        >
                            {copiedId === script.id ? "Copied!" : "Use Template"}
                        </button>
                        <button
                            onClick={(e) => handleDelete(e, script.id)}
                            disabled={isDeleting === script.id}
                            className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-muted-foreground hover:text-red-500 transition-colors"
                            title="Delete template"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
