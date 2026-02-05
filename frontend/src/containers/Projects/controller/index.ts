"use client";

import { useState } from "react";

export const useProjectsController = () => {
    const [projects, setProjects] = useState([
        { id: '1', name: "Personal Brand 2024", items: 12, lastModified: "2h ago" },
        { id: '2', name: "Client Work: Fitness", items: 5, lastModified: "1d ago" },
        { id: '3', name: "YouTube Main Channel", items: 48, lastModified: "3d ago" },
        { id: '4', name: "TikTok Shorts Batch", items: 8, lastModified: "1w ago" },
    ]);

    const handleNewProject = () => {
        // Implementation for logic to add a new project
        console.log("New project action triggered");
    };

    return {
        projects,
        handleNewProject
    };
};
