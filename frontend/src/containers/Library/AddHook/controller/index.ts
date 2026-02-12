'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { libraryApi } from '../../api';
import { useLibraryStore } from '../../slice';
import { Hook } from '../../api/types';
import { HookSchema, HookFormValues } from '../schema';

interface UseAddHookControllerProps {
  editItem?: Hook | null;
  onAddHook?: (hook: any) => Promise<{ success: boolean; error?: string }>;
  onUpdateHook?: (
    id: string,
    hook: any,
  ) => Promise<{ success: boolean; error?: string }>;
}

export function useAddHookController({
  editItem,
  onAddHook,
  onUpdateHook,
}: UseAddHookControllerProps) {
  const { isAdding, setIsAdding, isEditing, setIsEditing } = useLibraryStore();
  const isOpen =
    (isAdding || isEditing) && (!editItem || 'content' in editItem);

  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);
  const [metadata, setMetadata] = useState<any>(null);
  const [tagInput, setTagInput] = useState('');

  const form = useForm<HookFormValues>({
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

  useEffect(() => {
    if (!isOpen) {
      form.reset();
      setMetadata(null);
      return;
    }

    if (isEditing && editItem && 'content' in editItem) {
      const hook = editItem as Hook;
      form.reset({
        content: hook.content,
        type: hook.type as any,
        emotion: hook.emotion as any,
        topic: hook.topic,
        sourceUrl: hook.sourceUrl || '',
        tags: hook.tags || [],
        sourceMetadata: hook.sourceMetadata,
      });
      setMetadata(hook.sourceMetadata);
    }
  }, [isOpen, isEditing, editItem, form]);

  const handleFetchMetadata = async (url: string) => {
    if (!url || !url.startsWith('http')) return;

    setIsFetchingMetadata(true);
    try {
      const data = await libraryApi.getMetadata(url);
      setMetadata(data);
      form.setValue('sourceMetadata', data);
      if (!form.getValues('topic')) {
        form.setValue('topic', data.title || '');
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

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const currentTags = form.getValues('tags') || [];
      if (!currentTags.includes(tagInput.trim())) {
        form.setValue('tags', [...currentTags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    const current = form.getValues('tags') || [];
    form.setValue(
      'tags',
      current.filter((t: string) => t !== tag),
    );
  };

  const onSubmit = async (data: HookFormValues) => {
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

  return {
    isOpen,
    isEditing,
    metadata,
    isFetchingMetadata,
    handleFetchMetadata,
    tagInput,
    setTagInput,
    handleAddTag,
    handleRemoveTag,
    handleClose,
    form,
    onSubmit,
  };
}
