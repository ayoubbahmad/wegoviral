'use client';

import { useState } from 'react';
import { Video, ListOrdered, Users, Folder } from 'lucide-react';

import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Textarea } from '@/components/Textarea';
import { Label } from '@/components/Label';
import { cn } from '@/lib/utils';

import { ProjectType } from '../constants';
import { TProjectType } from '../types';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    type: TProjectType;
    description: string;
  }) => void;
  isSubmitting?: boolean;
}

const PROJECT_TYPES: {
  type: TProjectType;
  label: string;
  description: string;
  icon: any;
}[] = [
  {
    type: ProjectType.GENERAL,
    label: 'General Project',
    description: 'A standard project folder for mixed content.',
    icon: Folder,
  },
  {
    type: ProjectType.CASE_STUDY,
    label: 'Case Study',
    description: 'Analyze videos, identify patterns, and extract insights.',
    icon: Video,
  },
  {
    type: ProjectType.CONTENT_SERIES,
    label: 'Content Series',
    description: 'Plan episodes, manage a calendar, and define global ideas.',
    icon: ListOrdered,
  },
  {
    type: ProjectType.COLLABORATIVE,
    label: 'Collaborative',
    description: 'Work with others on shared content goals.',
    icon: Users,
  },
];

export const NewProjectModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: NewProjectModalProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedType, setSelectedType] = useState<TProjectType>(
    ProjectType.GENERAL,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, type: selectedType, description });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title='Create New Project'
      maxWidth='2xl'
    >
      <form onSubmit={handleSubmit} className='space-y-6'>
        <div className='space-y-4'>
          <div className='space-y-1.5'>
            <Label htmlFor='name'>Project Name</Label>
            <Input
              id='name'
              placeholder='e.g. My Awesome Series'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='description'>Description (Optional)</Label>
            <Textarea
              id='description'
              placeholder='What is this project about?'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className='space-y-3'>
          <label className='text-sm font-medium text-text-primary'>
            Project Type
          </label>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {PROJECT_TYPES.map(({ type, label, description, icon: Icon }) => (
              <button
                key={String(type)}
                type='button'
                onClick={() => setSelectedType(type)}
                className={cn(
                  'flex items-start gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left',
                  selectedType === type
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-border hover:border-border-hover bg-card',
                )}
              >
                <div
                  className={cn(
                    'p-2 rounded-lg',
                    selectedType === type
                      ? 'bg-primary text-white'
                      : 'bg-secondary text-text-secondary',
                  )}
                >
                  <Icon className='w-5 h-5' />
                </div>
                <div>
                  <div className='font-semibold text-text-primary'>{label}</div>
                  <div className='text-xs text-text-secondary mt-1 leading-relaxed'>
                    {description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className='flex justify-end gap-3 pt-4 border-t border-border'>
          <Button variant='secondary' onClick={onClose} type='button'>
            Cancel
          </Button>
          <Button
            variant='primary'
            type='submit'
            isLoading={isSubmitting}
            disabled={!name.trim()}
          >
            Create Project
          </Button>
        </div>
      </form>
    </Modal>
  );
};
