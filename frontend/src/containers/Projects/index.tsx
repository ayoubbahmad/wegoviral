'use client';

import { ProjectCard, NewProjectCard } from './components/ProjectCard';
import { Plus } from 'lucide-react';
import { useProjectsController } from './controller';
import { ProjectsSkeleton } from '@/views/Projects/skeleton';
import { Button } from '@/components/Button';
import { PageHeader } from '@/components/PageHeader';
import { PageContainer } from '@/components/PageContainer';

export const ProjectsContainer = () => {
  const { projects, isLoading, handleNewProject } = useProjectsController();

  if (isLoading) {
    return <ProjectsSkeleton />;
  }

  return (
    <PageContainer>
      <PageHeader
        title='Projects'
        description='Organize your content into dedicated project folders.'
        actions={
          <Button variant='primary' size='md' onClick={handleNewProject}>
            <Plus className='w-4 h-4' /> New Project
          </Button>
        }
      />

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
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
    </PageContainer>
  );
};
