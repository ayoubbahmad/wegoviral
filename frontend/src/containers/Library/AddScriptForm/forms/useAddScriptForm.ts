'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ScriptTemplate } from '../../types';
import { ScriptTemplateSchema, ScriptTemplateFormValues } from './schema';

export function useAddScriptForm(
  editItem?: ScriptTemplate | null,
  isOpen?: boolean,
) {
  const [tagInput, setTagInput] = useState('');

  const form = useForm<ScriptTemplateFormValues>({
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
