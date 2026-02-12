'use client';

import Image from 'next/image';
import { Loader2, Link, Tags, Plus } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { FormInput } from '@/components/forms/FormInput';
import { FormSelect } from '@/components/forms/FormSelect';
import { FormTextarea } from '@/components/forms/FormTextarea';
import { HookFormValues } from '../schema';

interface HookFormProps {
  form: UseFormReturn<HookFormValues>;
  metadata: any;
  isFetchingMetadata: boolean;
  onFetchMetadata: (url: string) => void;
  tagInput: string;
  setTagInput: (val: string) => void;
  onAddTag: (e: React.KeyboardEvent) => void;
  onRemoveTag: (tag: string) => void;
  onSubmit: (data: HookFormValues) => void;
}

export function HookForm({
  form,
  metadata,
  isFetchingMetadata,
  onFetchMetadata,
  tagInput,
  setTagInput,
  onAddTag,
  onRemoveTag,
  onSubmit,
}: HookFormProps) {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
      <FormTextarea
        control={form.control}
        name='content'
        label='Content'
        placeholder='Write your hook here...'
        className='min-h-[120px]'
      />

      <div className='grid grid-cols-2 gap-4'>
        <FormSelect
          control={form.control}
          name='type'
          label='Type'
          options={[
            { value: 'Verbal', label: 'Verbal' },
            { value: 'Visual', label: 'Visual' },
            { value: 'Text', label: 'Text' },
            { value: 'Audio', label: 'Audio' },
          ]}
        />
        <FormSelect
          control={form.control}
          name='emotion'
          label='Emotion'
          options={[
            { value: 'Curiosity', label: 'Curiosity' },
            { value: 'Fear', label: 'Fear' },
            { value: 'Humor', label: 'Humor' },
            { value: 'Desire', label: 'Desire' },
            { value: 'Surprise', label: 'Surprise' },
            { value: 'Inspiration', label: 'Inspiration' },
          ]}
        />
      </div>

      <div className='space-y-1.5'>
        <div className='flex gap-2 items-end'>
          <FormInput
            control={form.control}
            name='sourceUrl'
            label='Source URL'
            placeholder='Paste TikTok, IG, or YT link...'
            leftIcon={<Link className='w-4 h-4' />}
            className='flex-1'
            onBlur={(e) => onFetchMetadata(e.target.value)}
          />
          <Button
            type='button'
            variant='secondary'
            disabled={isFetchingMetadata}
            onClick={() => onFetchMetadata(form.getValues('sourceUrl') || '')}
            className='mb-[6px]'
          >
            {isFetchingMetadata ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              'Fetch'
            )}
          </Button>
        </div>
      </div>

      {metadata && (
        <div className='p-4 rounded-xl bg-muted/30 border border-border flex gap-4 animate-in fade-in slide-in-from-top-2 duration-300'>
          {metadata.thumbnail && (
            <div className='relative w-20 h-28 shrink-0 rounded-lg overflow-hidden bg-muted border border-border'>
              <Image
                src={metadata.thumbnail}
                alt='Preview'
                fill
                className='object-cover'
              />
            </div>
          )}
          <div className='flex flex-col gap-2 py-1 overflow-hidden'>
            <h5 className='text-sm font-bold line-clamp-2 leading-snug'>
              {metadata.title || 'Untitled Video'}
            </h5>
            <p className='text-[10px] text-muted-foreground line-clamp-2 leading-relaxed italic'>
              {metadata.description}
            </p>
          </div>
        </div>
      )}

      <div className='space-y-2'>
        <div className='relative'>
          <label className='text-sm font-medium mb-1.5 block'>Tags</label>
          <div className='relative'>
            <Tags className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
            <input
              type='text'
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={onAddTag}
              className='flex h-11 w-full rounded-lg border border-border bg-background pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-0'
              placeholder='Type tag and press Enter...'
            />
          </div>
        </div>
        {form.watch('tags')?.length ? (
          <div className='flex flex-wrap gap-2'>
            {form.watch('tags')?.map((tag) => (
              <Badge key={tag} variant='secondary' className='gap-1 pr-1'>
                {tag}
                <button
                  type='button'
                  onClick={() => onRemoveTag(tag)}
                  className='hover:text-destructive transition-colors'
                >
                  <Plus className='w-3 h-3 rotate-45' />
                </button>
              </Badge>
            ))}
          </div>
        ) : null}
      </div>

      <div className='pt-4 sticky bottom-0 bg-background pb-2 border-t border-border mt-6'>
        <Button
          type='submit'
          className='w-full'
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting && (
            <Loader2 className='w-4 h-4 animate-spin mr-2' />
          )}
          Save Hook
        </Button>
      </div>
    </form>
  );
}
