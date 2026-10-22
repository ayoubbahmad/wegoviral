'use client';

import { Plus } from 'lucide-react';

import { ProjectsSkeleton } from '@/views/Projects/skeleton';
import { Button } from '@/components/Button';
import { PageHeader } from '@/components/PageHeader';
import { PageContainer } from '@/components/PageContainer';

import { ProjectCard, NewProjectCard, NewProjectModal } from './components';
import { useProjectsController } from './controller';
import { useT } from '@/i18n/provider';

export const ProjectsContainer = () => {
  const t = useT();
  const {
    projects,
    isLoading,
    isCreating,
    isModalOpen,
    setIsModalOpen,
    handleCreateProject,
  } = useProjectsController();

  if (isLoading) {
    return <ProjectsSkeleton />;
  }

  return (
    <PageContainer>
      <PageHeader
        title={t('creator.projects.title')}
        description={t('creator.projects.description')}
        actions={
          <Button
            variant='primary'
            size='md'
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className='w-4 h-4' /> {t('creator.projects.newProject')}
          </Button>
        }
      />

      <NewProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateProject}
        isSubmitting={isCreating}
      />

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <NewProjectCard onClick={() => setIsModalOpen(true)} />
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
