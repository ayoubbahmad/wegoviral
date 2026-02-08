"use client";

import { useState } from "react";
import { PageContainer } from "@/components/ui/PageContainer";
import { PageHeader } from "@/components/ui/PageHeader";
import { Tabs } from "@/components/ui/Tabs";
import { AddNewItem } from "@/components/library/AddNewItem";
import { HookCard } from "@/components/library/HookCard";
import { ScriptTemplateList } from "@/components/library/ScriptTemplateList";
import { useLibraryController } from "./controller";

import { ViewToggle } from "@/components/ui/ViewToggle";

export const LibraryContainer = () => {
    const [activeTab, setActiveTab] = useState<"hooks" | "scripts">("hooks");
    const [viewType, setViewType] = useState<"grid" | "table">("grid");
    const { 
        hooks, 
        templates, 
        isLoading, 
        addHook, 
        removeHook, 
        updateHook, 
        addTemplate, 
        removeTemplate, 
        updateTemplate 
    } = useLibraryController();

    if (isLoading) {
        return (
            <PageContainer>
                <div className="flex items-center justify-center h-full">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <PageHeader 
                title="Library"
                description="Manage your creative assets, hooks, and script structures."
                actions={
                    <AddNewItem 
                        onAddHook={async (data) => {
                            try {
                                await addHook(data);
                                return { success: true };
                            } catch (error: any) {
                                return { success: false, error: error.message };
                            }
                        }} 
                        onAddScript={async (data) => {
                            try {
                                await addTemplate(data);
                                return { success: true };
                            } catch (error: any) {
                                return { success: false, error: error.message };
                            }
                        }} 
                    />
                }
            />

            <div className="flex items-center justify-between mb-8">
                <Tabs 
                    items={[
                        { id: "hooks", label: "Hooks" },
                        { id: "scripts", label: "Script Templates" }
                    ]}
                    activeId={activeTab}
                    onChange={(id) => setActiveTab(id as any)}
                    className="mb-0"
                />
                
                <ViewToggle mode={viewType} onChange={setViewType} />
            </div>

            <div className="min-h-[400px]">
                {activeTab === "hooks" ? (
                    viewType === "grid" ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {hooks.map((hook) => (
                                <HookCard 
                                    key={hook.id} 
                                    hook={hook} 
                                    onDelete={removeHook}
                                    onUpdate={(id, data) => updateHook({ id, data })}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-border bg-card overflow-hidden">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-border bg-muted/30">
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Content</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Type</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Emotion</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {hooks.map((hook) => (
                                        <tr key={hook.id} className="hover:bg-muted/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-medium line-clamp-1">"{hook.content}"</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground">{hook.type}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs text-muted-foreground">{hook.emotion}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {/* Simplified actions for table view */}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                ) : (
                    <ScriptTemplateList
                        scripts={templates}
                        viewType={viewType}
                        onDelete={removeTemplate}
                        onUpdate={(id, data) => updateTemplate({ id, data })}
                    />
                )}
            </div>
        </PageContainer>
    );
};
