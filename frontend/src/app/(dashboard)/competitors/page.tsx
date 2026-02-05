"use client";

import { useCompetitors } from "@/hooks/useCompetitors";
import { CompetitorCard } from "@/components/competitors/CompetitorCard";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { AddCompetitorModal } from "@/containers/competitors/AddCompetitor";

export default function CompetitorsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { competitors, addCompetitor, removeCompetitor, updateCompetitor } = useCompetitors();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Competitor Tracking</h1>
                    <p className="text-muted-foreground mt-2">Monitor top creators in your niche and analyze their winning strategies.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Competitor</span>
                </button>
            </div>

            <AddCompetitorModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={addCompetitor}
            />

            <div className="flex items-center gap-2 p-3 bg-card border border-border rounded-xl shadow-sm max-w-md">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search competitors..."
                    className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground"
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
    );
}
