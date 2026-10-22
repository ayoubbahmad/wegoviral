'use client';

import { Trash2, Link, Tags, X, Loader2 } from 'lucide-react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { FormInput } from '@/components/forms/FormInput';
import { FormSelect } from '@/components/forms/FormSelect';
import { ScriptTemplateFormValues } from '../forms';
import { useT } from '@/i18n/provider';

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
  const t = useT();
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
        label={t('creator.library.scriptTitle')}
        placeholder={t('creator.library.scriptTitlePlaceholder')}
      />

      <FormSelect
        control={form.control}
        name='category'
        label={t('creator.library.category')}
        options={(['Educational', 'Entertainment', 'Sales', 'Storytelling'] as const).map((value) => ({ value, label: t(`creator.library.categories.${value}`) }))}
      />

      <div className='space-y-3'>
        <div className='flex items-center justify-between'>
          <label className='text-sm font-medium'>{t('creator.library.structureSteps')}</label>
          <button
            type='button'
            onClick={() => appendStep({ step: t('creator.library.newStep'), description: '' })}
            className='text-xs text-primary font-bold hover:underline'
          >
            + {t('creator.library.addStep')}
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
                    placeholder={t('creator.library.stepName')}
                    className='mb-0'
                  />
                </div>
                <div className='col-span-8'>
                  <FormInput
                    control={form.control}
                    name={`content.${index}.description`}
                    placeholder={t('creator.library.stepDescription')}
                    className='mb-0'
                  />
                </div>
              </div>
              <button
                type='button'
                onClick={() => removeStep(index)}
                aria-label={t('creator.library.removeStep')}
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
            label={t('creator.library.sourceUrl')}
            placeholder={t('creator.library.inspirationPlaceholder')}
            leftIcon={<Link className='w-4 h-4' />}
            className='flex-1'
          />
        </div>
      </div>

      <div className='space-y-2'>
        <div className='relative'>
          <label className='text-sm font-medium mb-1.5 block'>{t('creator.library.tags')}</label>
          <div className='relative'>
            <Tags className='absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
            <input
              type='text'
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={onAddTag}
              className='flex h-11 w-full rounded-lg border border-border bg-background ps-10 pe-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-0'
              placeholder={t('creator.library.tagPlaceholder')}
            />
          </div>
        </div>
        {form.watch('tags')?.length ? (
          <div className='flex flex-wrap gap-2'>
            {form.watch('tags')?.map((tag) => (
              <Badge key={tag} variant='secondary' className='gap-1 pe-1'>
                {tag}
                <button
                  type='button'
                  onClick={() => onRemoveTag(tag)}
                  aria-label={t('creator.library.removeTag', { tag })}
                  className='hover:text-destructive transition-colors'
                >
                  <X className='w-3 h-3' />
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
            <Loader2 className='w-4 h-4 animate-spin me-2' />
          )}
          {t('creator.library.saveTemplate')}
        </Button>
      </div>
    </form>
  );
}
