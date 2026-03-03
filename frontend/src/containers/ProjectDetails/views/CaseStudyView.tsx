'use client';

import { Video, BarChart3, Search, Sparkles, Plus } from 'lucide-react';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';

import { Project } from '../../Projects/api/types';

export const CaseStudyView = ({ project }: { project: Project }) => {
  return (
    <div className='space-y-8 mt-6'>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <div className='flex items-center gap-3'>
            <span className='text-[10px] font-black text-primary uppercase tracking-widest px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20'>
              Case Study
            </span>
            <h1 className='text-3xl font-bold tracking-tight text-text-primary'>
              {project.name}
            </h1>
          </div>
          <p className='text-text-secondary font-medium'>
            Analyze {project._count?.items || 0} videos to extract winning
            patterns
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <Button variant='primary' size='md'>
            <Sparkles className='w-4 h-4' /> AI Pattern Analysis
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
              Source Videos
            </h3>
            <p className='text-sm text-text-secondary'>
              Videos being studied for this case.
            </p>
          </div>
          <Button
            variant='outline'
            className='w-full justify-start border-dashed'
          >
            <Plus className='w-4 h-4 mr-2' /> Add Video
          </Button>
        </Card>

        <Card className='p-6 space-y-4'>
          <div className='p-3 w-fit rounded-xl bg-purple-500/10 text-purple-500'>
            <Search className='w-6 h-6' />
          </div>
          <div>
            <h3 className='font-bold text-lg text-text-primary'>Key Hooks</h3>
            <p className='text-sm text-text-secondary'>
              Extracted hooks that performed best.
            </p>
          </div>
          <div className='text-xs text-text-secondary italic'>
            No hooks extracted yet.
          </div>
        </Card>

        <Card className='p-6 space-y-4'>
          <div className='p-3 w-fit rounded-xl bg-orange-500/10 text-orange-500'>
            <BarChart3 className='w-6 h-6' />
          </div>
          <div>
            <h3 className='font-bold text-lg text-text-primary'>
              Retention Patterns
            </h3>
            <p className='text-sm text-text-secondary'>
              Visualized flow of winning content.
            </p>
          </div>
          <div className='text-xs text-text-secondary italic'>
            Add videos to start analysis.
          </div>
        </Card>
      </div>

      <div className='bg-card border border-border rounded-2xl p-6'>
        <h3 className='font-bold mb-6 text-text-primary'>Videos in Study</h3>
        <div className='text-center py-10 border border-dashed border-border rounded-xl'>
          <p className='text-text-secondary'>
            Search and add videos to analyze them.
          </p>
          <Button variant='secondary' className='mt-4'>
            <Search className='w-4 h-4 mr-2' /> Search Creators
          </Button>
        </div>
      </div>
    </div>
  );
};
