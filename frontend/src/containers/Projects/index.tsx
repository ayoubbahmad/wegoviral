"use client";

import { ProjectCard, NewProjectCard } from "@/components/projects/ProjectCard";
import { Plus } from "lucide-react";
import { useProjectsController } from "./controller";
import { ProjectsSkeleton } from "@/views/Projects/skeleton";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";

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
            <PageHeader 
                title="Projects"
                description="Organize your content into dedicated project folders."
                actions={
                    <Button 
                        variant="pill" 
                        size="lg"
                        onClick={handleNewProject}
                    >
                        <Plus className="w-4 h-4" /> New Project
                    </Button>
                }
            />

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
