"use client";

import { useState } from "react";
import { useHooks } from "@/hooks/useHooks";
import { useScripts } from "@/hooks/useScripts";
import { HookCard } from "@/components/library/HookCard";
import { ScriptTemplateList } from "@/components/library/ScriptTemplateList";
import { cn } from "@/lib/utils";
import { AddNewItem } from "@/components/library/AddNewItem";

export default function LibraryPage() {
    const [activeTab, setActiveTab] = useState<"hooks" | "scripts">("hooks");
    const { hooks, addHook } = useHooks();
    const { scripts, addScript } = useScripts();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Library</h1>
                    <p className="text-muted-foreground mt-2">Manage your creative assets, hooks, and script structures.</p>
                </div>
                <AddNewItem onAddHook={addHook} onAddScript={addScript} />
            </div>

            <div className="border-b border-border">
                <div className="flex gap-6">
                    <button
                        onClick={() => setActiveTab("hooks")}
                        className={cn(
                            "pb-3 text-sm font-medium transition-colors relative",
                            activeTab === "hooks" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Hooks
                        {activeTab === "hooks" && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full layout-id='active-tab'" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab("scripts")}
                        className={cn(
                            "pb-3 text-sm font-medium transition-colors relative",
                            activeTab === "scripts" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Script Templates
                        {activeTab === "scripts" && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full layout-id='active-tab'" />
                        )}
                    </button>
                </div>
            </div>

            <div className="min-h-[400px]">
                {activeTab === "hooks" ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {hooks.map((hook) => (
                            <HookCard key={hook.id} hook={hook} />
                        ))}
                    </div>
                ) : (
                    <ScriptTemplateList scripts={scripts as any} />
                )}
            </div>
        </div>
    );
}
