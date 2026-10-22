'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hookListApi } from '../api';
import { useLibraryStore } from '../logic';
import { Hook } from '../../types';
import { useT } from '@/i18n/provider';

export function useHooksListController() {
  const t = useT();
  const queryClient = useQueryClient();
  const { searchTerm, viewType, selectedItemId, setSelectedItemId } =
    useLibraryStore();

  const { data: hooks = [], isLoading } = useQuery<Hook[]>({
    queryKey: ['hooks'],
    queryFn: hookListApi.getHooks,
  });

  const deleteHookMutation = useMutation({
    mutationFn: hookListApi.deleteHook,
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
    if (confirm(t('creator.library.confirmDeleteHook'))) {
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
