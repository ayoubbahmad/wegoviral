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

export const ContentSeriesView = ({ project }: { project: Project }) => {
  return (
    <div className='space-y-8 mt-6'>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <div className='flex items-center gap-3'>
            <span className='text-[10px] font-black text-orange-500 uppercase tracking-widest px-2 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20'>
              Content Series
            </span>
            <h1 className='text-3xl font-bold tracking-tight text-text-primary'>
              {project.name}
            </h1>
          </div>
          <p className='text-text-secondary font-medium'>
            Planning {project._count?.items || 0} episodes across your series
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <Button variant='primary'>
            <Calendar className='w-4 h-4' /> Production Schedule
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2 space-y-6'>
          <Card className='p-6'>
            <div className='flex items-center justify-between mb-6'>
              <div className='flex items-center gap-3'>
                <ListOrdered className='w-5 h-5 text-primary' />
                <h3 className='font-bold text-text-primary'>Episode Roadmap</h3>
              </div>
              <Button size='sm' variant='outline'>
                <Plus className='w-4 h-4' /> Add Episode
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
                      Pilot Episode: The Concept
                    </div>
                    <div className='text-xs text-text-secondary'>
                      Status: Drafting
                    </div>
                  </div>
                </div>
                <ChevronRight className='w-4 h-4 text-text-secondary group-hover:text-primary transition-colors' />
              </div>
              <div className='p-4 rounded-xl border border-dashed border-border bg-transparent flex items-center justify-center py-6'>
                <p className='text-xs text-text-secondary'>
                  Plan your next story beat...
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className='space-y-6'>
          <Card className='p-6 bg-gradient-to-br from-orange-500/5 to-transparent border-orange-500/10'>
            <div className='flex items-center gap-3 mb-4 text-orange-500'>
              <Lightbulb className='w-5 h-5' />
              <h3 className='font-bold'>Global Idea</h3>
            </div>
            <p className='text-sm text-text-secondary leading-relaxed'>
              {project.metadata?.globalIdea ||
                'Define the overarching theme and purpose of this content series to keep your episodes aligned.'}
            </p>
            <Button
              size='sm'
              variant='ghost'
              className='mt-4 text-orange-500 hover:bg-orange-500/10 p-0 h-auto'
            >
              Edit Idea
            </Button>
          </Card>

          <Card className='p-6'>
            <h3 className='font-bold text-sm mb-4'>Series Stats</h3>
            <div className='space-y-4'>
              <div>
                <div className='text-xs text-text-secondary mb-1'>
                  Total Word Count
                </div>
                <div className='text-xl font-bold text-text-primary'>0</div>
              </div>
              <div>
                <div className='text-xs text-text-secondary mb-1'>
                  Planned Content
                </div>
                <div className='text-xl font-bold text-text-primary'>
                  1 Episode
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
