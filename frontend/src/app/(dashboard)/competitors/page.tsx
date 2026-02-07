"use client";

import { useCompetitors } from "@/hooks/useCompetitors";
import { CompetitorCard } from "@/components/competitors/CompetitorCard";
import { CompetitorsSkeleton } from "@/components/competitors/CompetitorsSkeleton";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { AddCompetitorModal } from "@/containers/competitors/AddCompetitor";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { PageContainer } from "@/components/ui/PageContainer";

export default function CompetitorsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { competitors, isLoading, addCompetitor, removeCompetitor, updateCompetitor } = useCompetitors();

    if (isLoading) {
        return <CompetitorsSkeleton />;
    }

    return (
        <PageContainer>
            <PageHeader 
                title="Competitor Tracking"
                description="Monitor top creators in your niche and analyze their winning strategies."
                actions={
                    <Button 
                        variant="primary" 
                        size="lg"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <Plus className="w-4 h-4" /> Add Competitor
                    </Button>
                }
            />

            <div className="space-y-12 pb-32">
                <AddCompetitorModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onAdd={addCompetitor}
                />

                <div className="flex items-center gap-2 p-3 bg-secondary/20 border border-border/50 rounded-2xl shadow-sm max-w-md focus-within:ring-1 focus-within:ring-primary/30 transition-all">
                    <Search className="w-4 h-4 text-muted-foreground/50" />
                    <input
                        type="text"
                        placeholder="Search competitors..."
                        className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground/50 font-medium"
                    />
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {competitors.map((competitor) => (
                        <CompetitorCard
                            key={competitor.id}
                            competitor={competitor}
                            onDelete={removeCompetitor}
                        />
                    ))}
                </div>
            </div>
        </PageContainer>
    );
}
