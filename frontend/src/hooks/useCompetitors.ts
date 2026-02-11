'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { competitorsSharedApi } from '@/containers/Competitors/api/shared';
import { Competitor } from '@/types/competitor';
import { useToast } from '@/providers/Toast';

export function useCompetitors(watchlistId?: string) {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const competitorsQuery = useQuery({
    queryKey: ['competitors', { watchlistId }],
    queryFn: () => competitorsSharedApi.getAll(watchlistId),
  });

  const deleteMutation = useMutation({
    mutationFn: competitorsSharedApi.delete,
    onSuccess: () => {
      showToast('Competitor removed successfully', 'success');
      queryClient.invalidateQueries({ queryKey: ['competitors'] });
    },
    onError: () => {
      showToast('Failed to remove competitor', 'error');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Competitor>;
    }) => competitorsSharedApi.update(id, updates),
    onSuccess: () => {
      showToast('Competitor updated successfully', 'success');
      queryClient.invalidateQueries({ queryKey: ['competitors'] });
    },
    onError: () => {
      showToast('Failed to update competitor', 'error');
    },
  });

  return {
    competitors: competitorsQuery.data || [],
    isLoading: competitorsQuery.isLoading,
    error: competitorsQuery.error,
    addCompetitor: async () => {
      /* Add logic moved to AddCompetitor controller */
    },
    addCompetitorsBulk: async () => {
      /* Bulk add logic moved to AddCompetitor controller */
    },
    previewCompetitor: async () => {
      /* Preview logic moved to AddCompetitor controller */
    },
    updateCompetitor: (id: string, updates: Partial<Competitor>) =>
      updateMutation.mutate({ id, updates }),
    removeCompetitor: deleteMutation.mutate,
    refresh: competitorsQuery.refetch,
  };
}
