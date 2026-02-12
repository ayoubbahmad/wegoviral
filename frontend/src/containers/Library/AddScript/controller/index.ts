'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { libraryApi } from '../../api';
import { useLibraryStore } from '../../slice';
import { ScriptTemplate } from '../../api/types';
import { ScriptTemplateSchema, ScriptTemplateFormValues } from '../schema';

interface UseAddScriptControllerProps {
  editItem?: ScriptTemplate | null;
  onAddScript?: (script: any) => Promise<{ success: boolean; error?: string }>;
  onUpdateScript?: (
    id: string,
    script: any,
  ) => Promise<{ success: boolean; error?: string }>;
}

export function useAddScriptController({
  editItem,
  onAddScript,
  onUpdateScript,
}: UseAddScriptControllerProps) {
  const { isAdding, setIsAdding, isEditing, setIsEditing } = useLibraryStore();
  const isOpen =
    (isAdding || isEditing) &&
    (!editItem || !('content' in editItem) || Array.isArray(editItem.content));

  const [metadata, setMetadata] = useState<any>(null);
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
      setMetadata(null);
      return;
    }

    if (
      isEditing &&
      editItem &&
      !('content' in editItem && typeof editItem.content === 'string')
    ) {
      const script = editItem as ScriptTemplate;
      form.reset({
        title: script.title,
        category: script.category as any,
        content: script.content,
        sourceUrl: script.sourceUrl || '',
        tags: script.tags || [],
        sourceMetadata: script.sourceMetadata,
      });
      setMetadata(script.sourceMetadata);
    }
  }, [isOpen, isEditing, editItem, form]);

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

  const onSubmit = async (data: ScriptTemplateFormValues) => {
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
    tagInput,
    setTagInput,
    handleAddTag,
    handleRemoveTag,
    handleClose,
    form,
    onSubmit,
  };
}
