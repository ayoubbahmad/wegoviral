'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { libraryApi } from '../../api';
import { useLibraryStore } from '../../slice';
import { Hook } from '../../api/types';

export function useHooksListController() {
  const queryClient = useQueryClient();
  const { searchTerm, viewType, selectedItemId, setSelectedItemId } =
    useLibraryStore();

  const { data: hooks = [], isLoading } = useQuery<Hook[]>({
    queryKey: ['hooks'],
    queryFn: libraryApi.getHooks,
  });

  const deleteHookMutation = useMutation({
    mutationFn: libraryApi.deleteHook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hooks'] });
    },
  });

  const filteredHooks = hooks.filter(
    (hook) =>
      hook.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hook.topic?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hook.tags?.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  const handleDeleteHook = async (id: string) => {
    if (confirm('Are you sure you want to delete this hook?')) {
      try {
        await deleteHookMutation.mutateAsync(id);
        if (selectedItemId === id) setSelectedItemId(null);
      } catch (error) {
        console.error('Failed to delete hook', error);
      }
    }
  };

  return {
    hooks: filteredHooks,
    isLoading,
    viewType,
    selectedItemId,
    setSelectedItemId,
    handleDeleteHook,
  };
}
