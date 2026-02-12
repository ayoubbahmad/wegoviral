'use client';

import { useLibraryStore } from '../../HooksList/logic';
import { Hook } from '../../types';
import { useAddHookForm } from '../forms';
import { HookFormValues } from '../forms/schema';

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

  const {
    form,
    metadata,
    isFetchingMetadata,
    tagInput,
    setTagInput,
    handleFetchMetadata,
    handleAddTag,
    handleRemoveTag,
  } = useAddHookForm(editItem, isOpen);

  const handleClose = () => {
    setIsAdding(false);
    setIsEditing(false);
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
