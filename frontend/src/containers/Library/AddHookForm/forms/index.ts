'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Hook } from '../../types';
import { HookSchema, HookFormValues } from './schema';
import { hookApi } from '../api';
import { useT } from '@/i18n/provider';

export function useAddHookForm(editItem?: Hook | null, isOpen?: boolean) {
  const t = useT();
  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);
  const [metadata, setMetadata] = useState<any>(null);
  const [tagInput, setTagInput] = useState('');

  const defaultValues = {
    content: '',
    type: 'Verbal' as const,
    emotion: 'Curiosity' as const,
    topic: '',
    sourceUrl: '',
    tags: [],
  };

  const form = useForm<HookFormValues>({
    resolver: zodResolver(HookSchema(t)),
    defaultValues,
  });

  useEffect(() => {
    if (!isOpen) {
      form.reset();
      setMetadata(null);
      return;
    }

    if (editItem) {
      form.reset({
        content: editItem.content,
        type: editItem.type as any,
        emotion: editItem.emotion as any,
        topic: editItem.topic,
        sourceUrl: editItem.sourceUrl || '',
        tags: editItem.tags || [],
        sourceMetadata: editItem.sourceMetadata,
      });
      setMetadata(editItem.sourceMetadata);
    } else {
      form.reset(defaultValues);
      setMetadata(null);
      setTagInput('');
    }
  }, [isOpen, editItem, form]);

  const handleFetchMetadata = async (url: string) => {
    if (!url || !url.startsWith('http')) return;

    setIsFetchingMetadata(true);
    try {
      const data = (await hookApi.getMetadata(url)) as any;
      setMetadata(data);
      form.setValue('sourceMetadata', data);
      if (!form.getValues('topic')) {
        form.setValue('topic', (data && data.title) || '');
      }
    } catch (error) {
      console.error('Failed to fetch metadata', error);
    } finally {
      setIsFetchingMetadata(false);
    }
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

  return {
    form,
    metadata,
    isFetchingMetadata,
    tagInput,
    setTagInput,
    handleFetchMetadata,
    handleAddTag,
    handleRemoveTag,
  };
}
