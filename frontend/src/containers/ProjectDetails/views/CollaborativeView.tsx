'use client';

import { Users, MessageSquare, Share2, Plus } from 'lucide-react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';

import { Project } from '../../Projects/api/types';

export const CollaborativeView = ({ project }: { project: Project }) => {
  return (
    <div className='space-y-8 mt-6'>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <div className='flex items-center gap-3'>
            <span className='text-[10px] font-black text-green-500 uppercase tracking-widest px-2 py-0.5 rounded-md bg-green-500/10 border border-green-500/20'>
              Collaborative
            </span>
            <h1 className='text-3xl font-bold tracking-tight text-text-primary'>
              {project.name}
            </h1>
          </div>
          <p className='text-text-secondary font-medium'>
            Shared workspace for you and your team
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <Button variant='outline'>
            <Share2 className='w-4 h-4' /> Invite
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card className='p-6'>
          <div className='flex items-center justify-between mb-6'>
            <div className='flex items-center gap-3'>
              <Users className='w-5 h-5 text-green-500' />
              <h3 className='font-bold text-text-primary'>Collaborators</h3>
            </div>
            <Button
              size='sm'
              variant='ghost'
              className='text-green-500 p-0 h-auto'
            >
              Manage
            </Button>
          </div>

          <div className='flex -space-x-2'>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className='w-10 h-10 rounded-full border-2 border-card bg-secondary flex items-center justify-center text-xs font-bold text-text-secondary'
              >
                U{i}
              </div>
            ))}
            <button className='w-10 h-10 rounded-full border-2 border-dashed border-border bg-transparent flex items-center justify-center text-muted-foreground hover:border-primary transition-colors'>
              <Plus className='w-4 h-4' />
            </button>
          </div>
        </Card>

        <Card className='p-6'>
          <div className='flex items-center gap-3 mb-6'>
            <MessageSquare className='w-5 h-5 text-primary' />
            <h3 className='font-bold text-text-primary'>Activity Feed</h3>
          </div>
          <div className='text-sm text-text-secondary italic'>
            No recent activity.
          </div>
        </Card>
      </div>

      <div className='bg-card border border-border rounded-2xl p-6'>
        <h3 className='font-bold mb-6 text-text-primary'>Shared Assets</h3>
        <div className='text-center py-20 border border-dashed border-border rounded-xl'>
          <p className='text-text-secondary'>
            Drop files here or add existing scripts to this project.
          </p>
          <Button variant='secondary' className='mt-4'>
            Add Asset
          </Button>
        </div>
      </div>
    </div>
  );
};
