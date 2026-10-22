'use client';

import { PageContainer } from '@/components/PageContainer';
import { BackNavigation } from '@/components/BackNavigation';
import { Skeleton } from '@/components/Skeleton';

import { useProjectDetailsController } from './controller';
import { CaseStudyView } from './views/CaseStudyView';
import { ContentSeriesView } from './views/ContentSeriesView';
import { GeneralView } from './views/GeneralView';
import { CollaborativeView } from './views/CollaborativeView';
import { ProjectType } from '../Projects/constants';
import { useT } from '@/i18n/provider';

export const ProjectDetailsContainer = ({ id }: { id: string }) => {
  const t = useT();
  const { project, isLoading, error } = useProjectDetailsController(id);

  if (isLoading) {
    return (
      <PageContainer>
        <BackNavigation href='/creator/projects' label={t('creator.project.back')} />
        <div className='mt-8 space-y-4'>
          <Skeleton className='h-10 w-1/3' />
          <Skeleton className='h-64 w-full' />
        </div>
      </PageContainer>
    );
  }

  if (error || !project) {
    return (
      <PageContainer>
        <BackNavigation href='/creator/projects' label={t('creator.project.back')} />
        <div className='mt-20 text-center'>
          <h2 className='text-2xl font-bold text-text-primary'>
            {t('creator.project.notFound')}
          </h2>
          <p className='text-text-secondary mt-2'>
            {t('creator.project.notFoundBody')}
          </p>
        </div>
      </PageContainer>
    );
  }

  const renderView = () => {
    switch (project.type) {
      case ProjectType.CASE_STUDY:
        return <CaseStudyView project={project} />;
      case ProjectType.CONTENT_SERIES:
        return <ContentSeriesView project={project} />;
      case ProjectType.COLLABORATIVE:
        return <CollaborativeView project={project} />;
      default:
        return <GeneralView project={project} />;
    }
  };

  return (
    <PageContainer>
      <BackNavigation href='/creator/projects' label={t('creator.project.back')} />
      {renderView()}
    </PageContainer>
  );
};
