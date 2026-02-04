'use client';

import { ProjectCard, NewProjectCard } from "@/components/projects/ProjectCard";
import { Plus } from "lucide-react";

const MOCK_PROJECTS = [
    { name: "Personal Brand 2024", items: 12, lastModified: "2h ago" },
    { name: "Client Work: Fitness", items: 5, lastModified: "1d ago" },
    { name: "YouTube Main Channel", items: 48, lastModified: "3d ago" },
    { name: "TikTok Shorts Batch", items: 8, lastModified: "1w ago" },
];

export default function ProjectsPage() {
    return (
        <div className="max-w-[1400px] mx-auto space-y-12 pb-32 pt-4">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <h1 className="text-3xl font-black tracking-tight text-foreground uppercase italic underline decoration-primary/50 underline-offset-8">Projects</h1>
                    <p className="text-muted-foreground font-medium">Organize your content into dedicated project folders.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95">
                    <Plus className="w-4 h-4" /> New Project
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <NewProjectCard />
                {MOCK_PROJECTS.map((project, i) => (
                    <ProjectCard 
                        key={i}
                        name={project.name}
                        items={project.items}
                        lastModified={project.lastModified}
                    />
                ))}
            </div>
        </div>
    );
}
