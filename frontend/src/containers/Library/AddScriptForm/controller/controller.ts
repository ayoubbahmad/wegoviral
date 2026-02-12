'use client';

import { useLibraryStore } from '../../HooksList/logic';
import { ScriptTemplate } from '../../types';
import { useAddScriptForm, ScriptTemplateFormValues } from '../forms';

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

  const { form, tagInput, setTagInput, handleAddTag, handleRemoveTag } =
    useAddScriptForm(editItem, isOpen);

  const handleClose = () => {
    setIsAdding(false);
    setIsEditing(false);
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
