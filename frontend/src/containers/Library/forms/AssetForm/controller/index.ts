'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { libraryApi } from '../../../api';
import { useLibraryStore } from '../../../slice';
import { Hook, ScriptTemplate } from '../../../api/types';
import {
  HookSchema,
  ScriptTemplateSchema,
  HookFormValues,
  ScriptTemplateFormValues,
} from '../schema';

interface UseAssetFormControllerProps {
  editItem?: Hook | ScriptTemplate | null;
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
}

export function useAssetFormController({
  editItem,
  onAddHook,
  onUpdateHook,
  onAddScript,
  onUpdateScript,
}: UseAssetFormControllerProps) {
  const { isAdding, setIsAdding, isEditing, setIsEditing } = useLibraryStore();
  const isOpen = isAdding || isEditing;
  const [activeTab, setActiveTab] = useState<'hook' | 'script'>('hook');

  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);
  const [metadata, setMetadata] = useState<any>(null);
  const [tagInput, setTagInput] = useState('');

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

  useEffect(() => {
    if (!isOpen) {
      hookForm.reset();
      scriptForm.reset();
      setMetadata(null);
      return;
    }

    if (isEditing && editItem) {
      if ('content' in editItem && typeof editItem.content === 'string') {
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
    }
  }, [isOpen, isEditing, editItem, hookForm, scriptForm]);

  const handleFetchMetadata = async (url: string) => {
    if (!url || !url.startsWith('http')) return;

    setIsFetchingMetadata(true);
    try {
      const data = await libraryApi.getMetadata(url);
      setMetadata(data);

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

  const handleClose = () => {
    setIsAdding(false);
    setIsEditing(false);
    setMetadata(null);
  };

  const handleAddTag = (e: React.KeyboardEvent, form: any) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const currentTags = form.getValues('tags') || [];
      if (!currentTags.includes(tagInput.trim())) {
        form.setValue('tags', [...currentTags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string, form: any) => {
    const current = form.getValues('tags') || [];
    form.setValue(
      'tags',
      current.filter((t: string) => t !== tag),
    );
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

  return {
    isOpen,
    isEditing,
    activeTab,
    setActiveTab,
    metadata,
    isFetchingMetadata,
    handleFetchMetadata,
    tagInput,
    setTagInput,
    handleAddTag,
    handleRemoveTag,
    handleClose,
    hookForm,
    scriptForm,
    onHookSubmit,
    onScriptSubmit,
  };
}
