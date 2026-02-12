'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { libraryApi } from '../../api';
import { useLibraryStore } from '../../slice';
import { ScriptTemplate } from '../../api/types';

export function useScriptTemplatesListController() {
  const queryClient = useQueryClient();
  const { searchTerm, viewType, selectedItemId, setSelectedItemId } =
    useLibraryStore();

  const { data: templates = [], isLoading } = useQuery<ScriptTemplate[]>({
    queryKey: ['templates'],
    queryFn: libraryApi.getTemplates,
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: libraryApi.deleteTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });

  const filteredTemplates = templates.filter(
    (template) =>
      template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags?.some((tag) =>
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
    scripts: filteredTemplates,
    isLoading,
    viewType,
    selectedItemId,
    setSelectedItemId,
    handleDeleteTemplate,
  };
}
