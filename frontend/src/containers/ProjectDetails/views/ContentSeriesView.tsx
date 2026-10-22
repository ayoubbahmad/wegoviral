'use client';

import { Project } from '../../Projects/api/types';
import { Button } from '@/components/Button';
import {
  Calendar,
  ListOrdered,
  Lightbulb,
  Plus,
  ChevronRight,
} from 'lucide-react';
import { Card } from '@/components/Card';
import { useT } from '@/i18n/provider';

export const ContentSeriesView = ({ project }: { project: Project }) => {
  const t = useT();
  return (
    <div className='space-y-8 mt-6'>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <div className='flex items-center gap-3'>
            <span className='text-[10px] font-black text-orange-500 uppercase tracking-widest px-2 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20'>
              {t('creator.projects.types.CONTENT_SERIES.label')}
            </span>
            <h1 className='text-3xl font-bold tracking-tight text-text-primary'>
              {project.name}
            </h1>
          </div>
          <p className='text-text-secondary font-medium'>
            {t('creator.project.series.intro', { count: project._count?.items || 0 })}
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <Button variant='primary'>
            <Calendar className='w-4 h-4' /> {t('creator.project.series.schedule')}
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2 space-y-6'>
          <Card className='p-6'>
            <div className='flex items-center justify-between mb-6'>
              <div className='flex items-center gap-3'>
                <ListOrdered className='w-5 h-5 text-primary' />
                <h3 className='font-bold text-text-primary'>{t('creator.project.series.roadmap')}</h3>
              </div>
              <Button size='sm' variant='outline'>
                <Plus className='w-4 h-4' /> {t('creator.project.series.addEpisode')}
              </Button>
            </div>

            <div className='space-y-3'>
              <div className='p-4 rounded-xl border border-border bg-card/50 flex items-center justify-between group hover:border-primary/50 transition-colors'>
                <div className='flex items-center gap-4'>
                  <div className='w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-text-secondary'>
                    01
                  </div>
                  <div>
                    <div className='font-semibold text-text-primary'>
                      {t('creator.project.series.sampleEpisode')}
                    </div>
                    <div className='text-xs text-text-secondary'>
                      {t('creator.project.series.sampleStatus')}
                    </div>
                  </div>
                </div>
                <ChevronRight className='w-4 h-4 rtl:rotate-180 text-text-secondary group-hover:text-primary transition-colors' />
              </div>
              <div className='p-4 rounded-xl border border-dashed border-border bg-transparent flex items-center justify-center py-6'>
                <p className='text-xs text-text-secondary'>
                  {t('creator.project.series.nextBeat')}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className='space-y-6'>
          <Card className='p-6 bg-gradient-to-br rtl:bg-gradient-to-bl from-orange-500/5 to-transparent border-orange-500/10'>
            <div className='flex items-center gap-3 mb-4 text-orange-500'>
              <Lightbulb className='w-5 h-5' />
              <h3 className='font-bold'>{t('creator.project.series.idea')}</h3>
            </div>
            <p className='text-sm text-text-secondary leading-relaxed'>
              {project.metadata?.globalIdea ||
                t('creator.project.series.ideaPlaceholder')}
            </p>
            <Button
              size='sm'
              variant='ghost'
              className='mt-4 text-orange-500 hover:bg-orange-500/10 p-0 h-auto'
            >
              {t('creator.project.series.editIdea')}
            </Button>
          </Card>

          <Card className='p-6'>
            <h3 className='font-bold text-sm mb-4'>{t('creator.project.series.stats')}</h3>
            <div className='space-y-4'>
              <div>
                <div className='text-xs text-text-secondary mb-1'>
                  {t('creator.project.series.words')}
                </div>
                <div className='text-xl font-bold text-text-primary'>0</div>
              </div>
              <div>
                <div className='text-xs text-text-secondary mb-1'>
                  {t('creator.project.series.planned')}
                </div>
                <div className='text-xl font-bold text-text-primary'>
                  {t('creator.project.series.episodes', { count: 1 })}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
