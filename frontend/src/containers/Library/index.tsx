"use client";

import { useState } from "react";
import { PageContainer } from "@/components/ui/PageContainer";
import { PageHeader } from "@/components/ui/PageHeader";
import { Tabs } from "@/components/ui/Tabs";
import { AddNewItem } from "@/components/library/AddNewItem";
import { HookCard } from "@/components/library/HookCard";
import { ScriptTemplateList } from "@/components/library/ScriptTemplateList";
import { useLibraryController } from "./controller";

export const LibraryContainer = () => {
    const [activeTab, setActiveTab] = useState<"hooks" | "scripts">("hooks");
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

            <Tabs 
                items={[
                    { id: "hooks", label: "Hooks" },
                    { id: "scripts", label: "Script Templates" }
                ]}
                activeId={activeTab}
                onChange={(id) => setActiveTab(id as any)}
                className="mb-8"
            />

            <div className="min-h-[400px]">
                {activeTab === "hooks" ? (
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
                    <ScriptTemplateList
                        scripts={templates}
                        onDelete={removeTemplate}
                        onUpdate={(id, data) => updateTemplate({ id, data })}
                    />
                )}
            </div>
        </PageContainer>
    );
};
