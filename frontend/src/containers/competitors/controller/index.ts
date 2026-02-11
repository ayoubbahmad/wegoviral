import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { competitorsSharedApi } from '../api/shared';
import { useToast } from '@/providers/Toast';
import { Competitor } from '@/types/competitor';

import { useCompetitorsPageSlice } from '../slice/pageSlice';

export function useCompetitorsController() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const { selectedWatchlistId } = useCompetitorsPageSlice();

  const competitorsQuery = useQuery({
    queryKey: ['competitors', { watchlistId: selectedWatchlistId }],
    queryFn: () =>
      competitorsSharedApi.getAll(selectedWatchlistId || undefined),
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
    deleteCompetitor: deleteMutation.mutate,
    updateCompetitor: updateMutation.mutate,
    refresh: competitorsQuery.refetch,
  };
}
