import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useGetProjects, useCreateProject } from '../api';
import { TProjectType } from '../types';

export const useProjectsController = () => {
  const { data: projects = [], isLoading } = useGetProjects();
  const createProject = useCreateProject();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleCreateProject = async (data: {
    name: string;
    type: TProjectType;
    description: string;
  }) => {
    try {
      const project = await createProject.mutateAsync(data);
      setIsModalOpen(false);
      // Redirect to project detail page
      router.push(`/projects/${project.id}`);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const formattedProjects = projects.map((project) => ({
    ...project,
    items: project._count?.items || 0,
    lastModified:
      new Date(project.updatedAt).toLocaleDateString() ===
      new Date().toLocaleDateString()
        ? 'Today'
        : new Date(project.updatedAt).toLocaleDateString(),
  }));

  return {
    projects: formattedProjects,
    isLoading,
    isCreating: createProject.isPending,
    isModalOpen,
    setIsModalOpen,
    handleCreateProject,
  };
};
