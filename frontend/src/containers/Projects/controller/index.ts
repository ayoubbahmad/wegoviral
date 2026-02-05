import { useGetProjects } from "../api";

export const useProjectsController = () => {
    const { data: projects = [] } = useGetProjects();

    const handleNewProject = () => {
        // Implementation for logic to add a new project
        console.log("New project action triggered");
    };

    return {
        projects,
        handleNewProject
    };
};
