"use client";

import { ProjectCard, NewProjectCard } from "@/components/projects/ProjectCard";
import { Plus } from "lucide-react";
import { useProjectsController } from "./controller";
import { ProjectsSkeleton } from "@/views/Projects/skeleton";

export const ProjectsContainer = () => {
    const {
        projects,
        isLoading,
        handleNewProject
    } = useProjectsController();

    if (isLoading) {
        return <ProjectsSkeleton />;
    }

    return (
        <div className="space-y-12 pb-32">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                    <p className="text-muted-foreground font-medium">Organize your content into dedicated project folders.</p>
                </div>
                <button 
                    onClick={handleNewProject}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95"
                >
                    <Plus className="w-4 h-4" /> New Project
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <NewProjectCard />
                {projects.map((project, i) => (
                    <ProjectCard 
                        key={project.id}
                        id={project.id}
                        name={project.name}
                        items={project.items}
                        lastModified={project.lastModified}
                    />
                ))}
            </div>
        </div>
    );
};
