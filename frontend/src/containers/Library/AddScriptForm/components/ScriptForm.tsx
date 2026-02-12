'use client';

import { Trash2, Link, Tags, Plus, Loader2 } from 'lucide-react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { FormInput } from '@/components/forms/FormInput';
import { FormSelect } from '@/components/forms/FormSelect';
import { ScriptTemplateFormValues } from '../forms';

interface ScriptFormProps {
  form: UseFormReturn<ScriptTemplateFormValues>;
  tagInput: string;
  setTagInput: (val: string) => void;
  onAddTag: (e: React.KeyboardEvent) => void;
  onRemoveTag: (tag: string) => void;
  onSubmit: (data: ScriptTemplateFormValues) => void;
}

export function ScriptForm({
  form,
  tagInput,
  setTagInput,
  onAddTag,
  onRemoveTag,
  onSubmit,
}: ScriptFormProps) {
  const {
    fields: scriptSteps,
    append: appendStep,
    remove: removeStep,
  } = useFieldArray({
    control: form.control,
    name: 'content',
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
      <FormInput
        control={form.control}
        name='title'
        label='Script Title'
        placeholder='e.g. 1-Minute Educational Reel'
      />

      <FormSelect
        control={form.control}
        name='category'
        label='Category'
        options={[
          { value: 'Educational', label: 'Educational' },
          { value: 'Entertainment', label: 'Entertainment' },
          { value: 'Sales', label: 'Sales' },
          { value: 'Storytelling', label: 'Storytelling' },
        ]}
      />

      <div className='space-y-3'>
        <div className='flex items-center justify-between'>
          <label className='text-sm font-medium'>Structure Steps</label>
          <button
            type='button'
            onClick={() => appendStep({ step: 'New Step', description: '' })}
            className='text-xs text-primary font-bold hover:underline'
          >
            + Add Step
          </button>
        </div>
        <div className='space-y-3'>
          {scriptSteps.map((field, index) => (
            <div key={field.id} className='flex gap-2 items-start group'>
              <div className='flex-1 grid grid-cols-12 gap-2'>
                <div className='col-span-4'>
                  <FormInput
                    control={form.control}
                    name={`content.${index}.step`}
                    placeholder='Step Name'
                    className='mb-0'
                  />
                </div>
                <div className='col-span-8'>
                  <FormInput
                    control={form.control}
                    name={`content.${index}.description`}
                    placeholder='Description...'
                    className='mb-0'
                  />
                </div>
              </div>
              <button
                type='button'
                onClick={() => removeStep(index)}
                className='p-2 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 mt-1'
              >
                <Trash2 className='w-4 h-4' />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className='space-y-1.5'>
        <div className='flex gap-2 items-end'>
          <FormInput
            control={form.control}
            name='sourceUrl'
            label='Source URL'
            placeholder='Link to inspiration...'
            leftIcon={<Link className='w-4 h-4' />}
            className='flex-1'
          />
        </div>
      </div>

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
          Save Template
        </Button>
      </div>
    </form>
  );
}
