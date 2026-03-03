'use client';

import { Plus, Play } from 'lucide-react';

import { PageHeader } from '@/components/PageHeader';
import { VideoTable } from '@/containers/Videos/components/VideoTable';
import { Button } from '@/components/Button';

import { Project } from '../../Projects/api/types';

export const GeneralView = ({ project }: { project: Project }) => {
  return (
    <div className='space-y-8 mt-6'>
      <PageHeader
        title={project.name}
        description={
          project.description ||
          `${project._count?.items || 0} items in this project`
        }
        actions={
          <div className='flex items-center gap-3'>
            <Button variant='primary'>
              <Play className='w-4 h-4 fill-current' /> Analyze all
            </Button>
            <Button variant='secondary'>
              <Plus className='w-4 h-4' /> Add Item
            </Button>
          </div>
        }
      />

      <div className='bg-card border border-border rounded-2xl p-6'>
        {project.items && project.items.length > 0 ? (
          <VideoTable videos={project.items as any} />
        ) : (
          <div className='text-center py-20'>
            <p className='text-text-secondary'>
              No items found in this project.
            </p>
            <Button variant='outline' className='mt-4'>
              Add your first item
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
