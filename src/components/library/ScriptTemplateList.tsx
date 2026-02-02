"use client";

import { ScriptTemplate } from "@/types/library";
import { FileText, ChevronRight } from "lucide-react";

interface ScriptTemplateListProps {
    scripts: ScriptTemplate[];
}

export function ScriptTemplateList({ scripts }: ScriptTemplateListProps) {
    return (
        <div className="space-y-4">
            {scripts.map((script) => (
                <div
                    key={script.id}
                    className="group flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-secondary/20 transition-all cursor-pointer"
                >
                    <div className="p-3 bg-secondary rounded-lg">
                        <FileText className="w-6 h-6 text-foreground" />
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-lg">{script.name}</h3>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground border border-border">
                                {script.category}
                            </span>
                        </div>
                        <div className="text-sm text-muted-foreground flex gap-2 overflow-x-auto pb-1">
                            {script.structure.map((step, i) => (
                                <span key={i} className="flex items-center whitespace-nowrap">
                                    {step.step}
                                    {i < script.structure.length - 1 && <ChevronRight className="w-3 h-3 mx-1 opacity-50" />}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg">
                            Use Template
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
