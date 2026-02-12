'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { scriptListApi } from '../api';
import { useLibraryStore } from '../../HooksList/logic';
import { ScriptTemplate } from '../../types';

export function useScriptTemplatesListController() {
  const queryClient = useQueryClient();
  const { searchTerm, viewType, selectedItemId, setSelectedItemId } =
    useLibraryStore();

  const { data: scripts = [], isLoading } = useQuery<ScriptTemplate[]>({
    queryKey: ['templates'],
    queryFn: scriptListApi.getTemplates,
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: scriptListApi.deleteTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });

  const filteredScripts = scripts.filter(
    (script) =>
      script.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      script.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      script.tags?.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  const handleDeleteTemplate = async (id: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      try {
        await deleteTemplateMutation.mutateAsync(id);
        if (selectedItemId === id) setSelectedItemId(null);
      } catch (error) {
        console.error('Failed to delete template', error);
      }
    }
  };

  return {
    scripts: filteredScripts,
    isLoading,
    viewType,
    selectedItemId,
    setSelectedItemId,
    handleDeleteTemplate,
  };
}
