'use client';

import { Video, BarChart3, Search, Sparkles, Plus } from 'lucide-react';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';

import { Project } from '../../Projects/api/types';
import { useT } from '@/i18n/provider';

export const CaseStudyView = ({ project }: { project: Project }) => {
  const t = useT();
  return (
    <div className='space-y-8 mt-6'>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <div className='flex items-center gap-3'>
            <span className='text-[10px] font-black text-primary uppercase tracking-widest px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20'>
              {t('creator.projects.types.CASE_STUDY.label')}
            </span>
            <h1 className='text-3xl font-bold tracking-tight text-text-primary'>
              {project.name}
            </h1>
          </div>
          <p className='text-text-secondary font-medium'>
            {t('creator.project.caseStudy.intro', { count: project._count?.items || 0 })}
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <Button variant='primary' size='md'>
            <Sparkles className='w-4 h-4' /> {t('creator.project.caseStudy.aiAnalysis')}
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Card className='p-6 space-y-4'>
          <div className='p-3 w-fit rounded-xl bg-blue-500/10 text-blue-500'>
            <Video className='w-6 h-6' />
          </div>
          <div>
            <h3 className='font-bold text-lg text-text-primary'>
              {t('creator.project.caseStudy.sources')}
            </h3>
            <p className='text-sm text-text-secondary'>
              {t('creator.project.caseStudy.sourcesBody')}
            </p>
          </div>
          <Button
            variant='outline'
            className='w-full justify-start border-dashed'
          >
            <Plus className='w-4 h-4 me-2' /> {t('creator.project.caseStudy.addVideo')}
          </Button>
        </Card>

        <Card className='p-6 space-y-4'>
          <div className='p-3 w-fit rounded-xl bg-purple-500/10 text-purple-500'>
            <Search className='w-6 h-6' />
          </div>
          <div>
            <h3 className='font-bold text-lg text-text-primary'>{t('creator.project.caseStudy.hooks')}</h3>
            <p className='text-sm text-text-secondary'>
              {t('creator.project.caseStudy.hooksBody')}
            </p>
          </div>
          <div className='text-xs text-text-secondary italic'>
            {t('creator.project.caseStudy.noHooks')}
          </div>
        </Card>

        <Card className='p-6 space-y-4'>
          <div className='p-3 w-fit rounded-xl bg-orange-500/10 text-orange-500'>
            <BarChart3 className='w-6 h-6' />
          </div>
          <div>
            <h3 className='font-bold text-lg text-text-primary'>
              {t('creator.project.caseStudy.retention')}
            </h3>
            <p className='text-sm text-text-secondary'>
              {t('creator.project.caseStudy.retentionBody')}
            </p>
          </div>
          <div className='text-xs text-text-secondary italic'>
            {t('creator.project.caseStudy.addToStart')}
          </div>
        </Card>
      </div>

      <div className='bg-card border border-border rounded-2xl p-6'>
        <h3 className='font-bold mb-6 text-text-primary'>{t('creator.project.caseStudy.inStudy')}</h3>
        <div className='text-center py-10 border border-dashed border-border rounded-xl'>
          <p className='text-text-secondary'>
            {t('creator.project.caseStudy.searchAdd')}
          </p>
          <Button variant='secondary' className='mt-4'>
            <Search className='w-4 h-4 me-2' /> {t('creator.project.caseStudy.searchCreators')}
          </Button>
        </div>
      </div>
    </div>
  );
};
