"use client";

import { useState } from "react";
import { useHooks } from "@/hooks/useHooks";
import { useScripts } from "@/hooks/useScripts";
import { HookCard } from "@/components/library/HookCard";
import { ScriptTemplateList } from "@/components/library/ScriptTemplateList";
import { cn } from "@/lib/utils";
import { AddNewItem } from "@/components/library/AddNewItem";
import { PageHeader } from "@/components/ui/PageHeader";
import { Tabs } from "@/components/ui/Tabs";
import { PageContainer } from "@/components/ui/PageContainer";

export default function LibraryPage() {
    const [activeTab, setActiveTab] = useState<"hooks" | "scripts">("hooks");
    const { hooks, addHook, removeHook, updateHook } = useHooks();
    const { scripts, addScript, removeScript, updateScript } = useScripts();

    return (
        <PageContainer>
            <PageHeader 
                title="Library"
                description="Manage your creative assets, hooks, and script structures."
                actions={<AddNewItem onAddHook={addHook} onAddScript={addScript} />}
            />

            <Tabs 
                activeId={activeTab}
                onChange={(id) => setActiveTab(id as any)}
                items={[
                    { id: "hooks", label: "Hooks" },
                    { id: "scripts", label: "Script Templates" }
                ]}
            />

            <div className="min-h-[400px]">
                {activeTab === "hooks" ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {hooks.map((hook) => (
                            <HookCard
                                key={hook.id}
                                hook={hook}
                                onDelete={removeHook}
                                onUpdate={updateHook}
                            />
                        ))}
                    </div>
                ) : (
                    <ScriptTemplateList
                        scripts={scripts}
                        onDelete={removeScript}
                        onUpdate={updateScript}
                    />
                )}
            </div>
        </PageContainer>
    );
}
