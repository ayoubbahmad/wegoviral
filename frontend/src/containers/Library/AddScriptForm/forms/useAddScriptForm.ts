'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ScriptTemplate } from '../../types';
import { ScriptTemplateSchema, ScriptTemplateFormValues } from './schema';
import { useT } from '@/i18n/provider';

export function useAddScriptForm(
  editItem?: ScriptTemplate | null,
  isOpen?: boolean,
) {
  const t = useT();
  const [tagInput, setTagInput] = useState('');

  const defaultValues = {
    title: '',
    category: 'Educational' as const,
    content: [{ step: t('creator.library.firstStep'), description: '' }],
    sourceUrl: '',
    tags: [],
  };

  const form = useForm<ScriptTemplateFormValues>({
    resolver: zodResolver(ScriptTemplateSchema(t)),
    defaultValues,
  });

  useEffect(() => {
    if (!isOpen) {
      form.reset();
      return;
    }

    if (
      editItem &&
      !('content' in editItem && typeof editItem.content === 'string')
    ) {
      form.reset({
        title: editItem.title,
        category: editItem.category as any,
        content: editItem.content,
        sourceUrl: editItem.sourceUrl || '',
        tags: editItem.tags || [],
        sourceMetadata: editItem.sourceMetadata,
      });
    } else {
      form.reset(defaultValues);
      setTagInput('');
    }
  }, [isOpen, editItem, form]);

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
    tagInput,
    setTagInput,
    handleAddTag,
    handleRemoveTag,
  };
}
