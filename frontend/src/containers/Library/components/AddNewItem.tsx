'use client';

import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Loader2, Trash2, Link, Tags } from 'lucide-react';

import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { FormInput } from '@/components/forms/FormInput';
import { FormSelect } from '@/components/forms/FormSelect';
import { FormTextarea } from '@/components/forms/FormTextarea';
import { libraryApi } from '../api';
import { useLibraryStore } from '../slice';
import { Hook, ScriptTemplate } from '../api/types';
import {
  HookSchema,
  ScriptTemplateSchema,
  HookFormValues,
  ScriptTemplateFormValues,
} from './AddNewItem/schema';
import Image from 'next/image';

interface LibraryAssetModalProps {
  onAddHook?: (hook: any) => Promise<{ success: boolean; error?: string }>;
  onUpdateHook?: (
    id: string,
    hook: any,
  ) => Promise<{ success: boolean; error?: string }>;
  onAddScript?: (script: any) => Promise<{ success: boolean; error?: string }>;
  onUpdateScript?: (
    id: string,
    script: any,
  ) => Promise<{ success: boolean; error?: string }>;
  editItem?: Hook | ScriptTemplate | null;
}

export function LibraryAssetModal({
  onAddHook,
  onUpdateHook,
  onAddScript,
  onUpdateScript,
  editItem,
}: LibraryAssetModalProps) {
  const { isAdding, setIsAdding, isEditing, setIsEditing } = useLibraryStore();
  const isOpen = isAdding || isEditing;
  const [activeTab, setActiveTab] = useState<'hook' | 'script'>('hook');

  // Metadata fetching state
  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);
  const [metadata, setMetadata] = useState<any>(null);

  // Hook Form
  const hookForm = useForm<HookFormValues>({
    resolver: zodResolver(HookSchema),
    defaultValues: {
      content: '',
      type: 'Verbal',
      emotion: 'Curiosity',
      topic: '',
      sourceUrl: '',
      tags: [],
    },
  });

  // Script Form
  const scriptForm = useForm<ScriptTemplateFormValues>({
    resolver: zodResolver(ScriptTemplateSchema),
    defaultValues: {
      title: '',
      category: 'Educational',
      content: [{ step: 'Hook', description: '' }],
      sourceUrl: '',
      tags: [],
    },
  });

  const {
    fields: scriptSteps,
    append: appendStep,
    remove: removeStep,
  } = useFieldArray({
    control: scriptForm.control,
    name: 'content',
  });

  // Reset and populate forms when opening/editing
  useEffect(() => {
    if (!isOpen) {
      hookForm.reset();
      scriptForm.reset();
      setMetadata(null);
      return;
    }

    if (isEditing && editItem) {
      if ('content' in editItem && typeof editItem.content === 'string') {
        // It's a Hook
        const hook = editItem as Hook;
        setActiveTab('hook');
        hookForm.reset({
          content: hook.content,
          type: hook.type as any,
          emotion: hook.emotion as any,
          topic: hook.topic,
          sourceUrl: hook.sourceUrl || '',
          tags: hook.tags || [],
          sourceMetadata: hook.sourceMetadata,
        });
        setMetadata(hook.sourceMetadata);
      } else {
        // It's a Script Template
        const script = editItem as ScriptTemplate;
        setActiveTab('script');
        scriptForm.reset({
          title: script.title,
          category: script.category as any,
          content: script.content,
          sourceUrl: script.sourceUrl || '',
          tags: script.tags || [],
          sourceMetadata: script.sourceMetadata,
        });
        setMetadata(script.sourceMetadata);
      }
    } else {
      // Adding new item - reset to defaults
      hookForm.reset({
        content: '',
        type: 'Verbal',
        emotion: 'Curiosity',
        topic: '',
        sourceUrl: '',
        tags: [],
      });
      scriptForm.reset({
        title: '',
        category: 'Educational',
        content: [{ step: 'Hook', description: '' }],
        sourceUrl: '',
        tags: [],
      });
      setMetadata(null);
    }
  }, [isOpen, isEditing, editItem, hookForm, scriptForm]);

  const handleFetchMetadata = async (url: string) => {
    if (!url || !url.startsWith('http')) return;

    setIsFetchingMetadata(true);
    try {
      const data = await libraryApi.getMetadata(url);
      setMetadata(data);

      // Auto-fill topic/title if empty
      if (activeTab === 'hook') {
        hookForm.setValue('sourceMetadata', data);
        if (!hookForm.getValues('topic')) {
          hookForm.setValue('topic', data.title || '');
        }
      } else {
        scriptForm.setValue('sourceMetadata', data);
        if (!scriptForm.getValues('title')) {
          scriptForm.setValue('title', data.title || '');
        }
      }
    } catch (error) {
      console.error('Failed to fetch metadata', error);
    } finally {
      setIsFetchingMetadata(false);
    }
  };

  const onHookSubmit = async (data: HookFormValues) => {
    try {
      if (isEditing && editItem) {
        await onUpdateHook?.(editItem.id, data);
      } else {
        await onAddHook?.(data);
      }
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  const onScriptSubmit = async (data: ScriptTemplateFormValues) => {
    try {
      if (isEditing && editItem) {
        await onUpdateScript?.(editItem.id, data);
      } else {
        await onAddScript?.(data);
      }
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = () => {
    setIsAdding(false);
    setIsEditing(false);
    setMetadata(null);
  };

  // Tag handling helper
  const [tagInput, setTagInput] = useState('');
  const handleAddTag = (
    e: React.KeyboardEvent,
    form: any,
    fieldName: 'tags',
  ) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const currentTags = form.getValues(fieldName) || [];
      if (!currentTags.includes(tagInput.trim())) {
        form.setValue(fieldName, [...currentTags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsAdding(true)}
        leftSection={<Plus className='w-4 h-4' />}
      >
        Add New
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={
          isEditing
            ? `Edit ${activeTab === 'hook' ? 'Hook' : 'Script'}`
            : activeTab === 'hook'
              ? 'Add New Hook'
              : 'Add Script Template'
        }
      >
        <div className='max-h-[75vh] overflow-y-auto px-1'>
          {!isEditing && (
            <div className='flex bg-secondary p-1 rounded-lg mb-6 sticky top-0 z-10'>
              <button
                onClick={() => setActiveTab('hook')}
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
                  activeTab === 'hook'
                    ? 'bg-background shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Hook
              </button>
              <button
                onClick={() => setActiveTab('script')}
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
                  activeTab === 'script'
                    ? 'bg-background shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Script
              </button>
            </div>
          )}

          {activeTab === 'hook' ? (
            <form
              onSubmit={hookForm.handleSubmit(onHookSubmit)}
              className='space-y-6'
            >
              <FormTextarea
                control={hookForm.control}
                name='content'
                label='Content'
                placeholder='Write your hook here...'
                className='min-h-[120px]'
              />

              <div className='grid grid-cols-2 gap-4'>
                <FormSelect
                  control={hookForm.control}
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
                  control={hookForm.control}
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

              {/* Source URL Section */}
              <div className='space-y-1.5'>
                <div className='flex gap-2 items-end'>
                  <FormInput
                    control={hookForm.control}
                    name='sourceUrl'
                    label='Source URL'
                    placeholder='Paste TikTok, IG, or YT link...'
                    leftIcon={<Link className='w-4 h-4' />}
                    className='flex-1'
                    onBlur={(e) => handleFetchMetadata(e.target.value)}
                  />
                  <Button
                    type='button'
                    variant='secondary'
                    disabled={isFetchingMetadata}
                    onClick={() =>
                      handleFetchMetadata(hookForm.getValues('sourceUrl') || '')
                    }
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

              {/* Metadata Preview */}
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

              {/* Tags Section */}
              <div className='space-y-2'>
                <div className='relative'>
                  <label className='text-sm font-medium mb-1.5 block'>
                    Tags
                  </label>
                  <div className='relative'>
                    <Tags className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
                    <input
                      type='text'
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => handleAddTag(e, hookForm, 'tags')}
                      className='flex h-11 w-full rounded-lg border border-border bg-background pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-0'
                      placeholder='Type tag and press Enter...'
                    />
                  </div>
                </div>
                {hookForm.watch('tags')?.length ? (
                  <div className='flex flex-wrap gap-2'>
                    {hookForm.watch('tags')?.map((tag) => (
                      <Badge
                        key={tag}
                        variant='secondary'
                        className='gap-1 pr-1'
                      >
                        {tag}
                        <button
                          type='button'
                          onClick={() => {
                            const current = hookForm.getValues('tags') || [];
                            hookForm.setValue(
                              'tags',
                              current.filter((t) => t !== tag),
                            );
                          }}
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
                  disabled={hookForm.formState.isSubmitting}
                >
                  {hookForm.formState.isSubmitting && (
                    <Loader2 className='w-4 h-4 animate-spin mr-2' />
                  )}
                  Save Hook
                </Button>
              </div>
            </form>
          ) : (
            <form
              onSubmit={scriptForm.handleSubmit(onScriptSubmit)}
              className='space-y-6'
            >
              <FormInput
                control={scriptForm.control}
                name='title'
                label='Script Title'
                placeholder='e.g. 1-Minute Educational Reel'
              />

              <FormSelect
                control={scriptForm.control}
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
                    onClick={() =>
                      appendStep({ step: 'New Step', description: '' })
                    }
                    className='text-xs text-primary font-bold hover:underline'
                  >
                    + Add Step
                  </button>
                </div>
                <div className='space-y-3'>
                  {scriptSteps.map((field, index) => (
                    <div
                      key={field.id}
                      className='flex gap-2 items-start group'
                    >
                      <div className='flex-1 grid grid-cols-12 gap-2'>
                        <div className='col-span-4'>
                          <FormInput
                            control={scriptForm.control}
                            name={`content.${index}.step`}
                            placeholder='Step Name'
                            className='mb-0'
                          />
                        </div>
                        <div className='col-span-8'>
                          <FormInput
                            control={scriptForm.control}
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

              {/* Source URL Section */}
              <div className='space-y-1.5'>
                <div className='flex gap-2 items-end'>
                  <FormInput
                    control={scriptForm.control}
                    name='sourceUrl'
                    label='Source URL'
                    placeholder='Link to inspiration...'
                    leftIcon={<Link className='w-4 h-4' />}
                    className='flex-1'
                  />
                </div>
              </div>

              {/* Tags Section */}
              <div className='space-y-2'>
                <div className='relative'>
                  <label className='text-sm font-medium mb-1.5 block'>
                    Tags
                  </label>
                  <div className='relative'>
                    <Tags className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
                    <input
                      type='text'
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => handleAddTag(e, scriptForm, 'tags')}
                      className='flex h-11 w-full rounded-lg border border-border bg-background pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-0'
                      placeholder='Type tag and press Enter...'
                    />
                  </div>
                </div>
                {scriptForm.watch('tags')?.length ? (
                  <div className='flex flex-wrap gap-2'>
                    {scriptForm.watch('tags')?.map((tag) => (
                      <Badge
                        key={tag}
                        variant='secondary'
                        className='gap-1 pr-1'
                      >
                        {tag}
                        <button
                          type='button'
                          onClick={() => {
                            const current = scriptForm.getValues('tags') || [];
                            scriptForm.setValue(
                              'tags',
                              current.filter((t) => t !== tag),
                            );
                          }}
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
                  disabled={scriptForm.formState.isSubmitting}
                >
                  {scriptForm.formState.isSubmitting && (
                    <Loader2 className='w-4 h-4 animate-spin mr-2' />
                  )}
                  Save Template
                </Button>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </>
  );
}
