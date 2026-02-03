"use client";

import { ScriptTemplate } from "@/types/library";
import { FileText, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ScriptTemplateListProps {
    scripts: ScriptTemplate[];
}

export function ScriptTemplateList({ scripts }: ScriptTemplateListProps) {
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopy = (id: string, structure: any[]) => {
        const text = structure.map(s => `${s.step}: ${s.description}`).join('\n');
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
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

                    <div className={cn("transition-opacity", copiedId === script.id ? "opacity-100" : "opacity-0 group-hover:opacity-100")}>
                        <button
                            className={cn(
                                "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                                copiedId === script.id
                                    ? "bg-green-500 text-white"
                                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                            )}
                        >
                            {copiedId === script.id ? "Copied!" : "Use Template"}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
