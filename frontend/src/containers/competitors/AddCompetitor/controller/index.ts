import { useMutation, useQueryClient } from '@tanstack/react-query';
import { competitorsApi } from '../api';
import { useAddCompetitorSlice } from '../slice';
import { useToast } from '@/providers/Toast';
import { getUrlFromRow } from '../forms/utils';
import { WatchlistFormValues } from '../forms/schema';

export function useAddCompetitorController() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const {
    setPrevStep,
    setPreviews,
    reset: resetSlice,
  } = useAddCompetitorSlice();

  const previewMutation = useMutation({
    mutationFn: async (data: WatchlistFormValues) => {
      const results = await Promise.all(
        data.competitors.map(async (row) => {
          try {
            const url = getUrlFromRow(row);
            return await competitorsApi.preview(url);
          } catch (error) {
            console.error('Failed to preview:', error);
            return null;
          }
        }),
      );
      return results.filter((r) => r !== null);
    },
    onSuccess: (data) => {
      setPreviews(data);
      setPrevStep(true);
    },
    onError: () => {
      showToast('Failed to fetch previews', 'error');
    },
  });

  const bulkCreateMutation = useMutation({
    mutationFn: async (data: WatchlistFormValues) => {
      const validUrls = data.competitors
        .filter((r) => r.value.trim() !== '')
        .map((r) => getUrlFromRow(r));

      return competitorsApi.bulkCreate({
        handles: validUrls,
        tags: ['Watchlist'],
        watchlistId: data.watchlistId,
      });
    },
    onSuccess: (result) => {
      if (result?.success) {
        showToast(
          `${result.competitors.length} competitors added successfully!`,
          'success',
        );
        queryClient.invalidateQueries({ queryKey: ['competitors'] });
        return true;
      } else {
        showToast(result?.error || 'Failed to add competitors', 'error');
        return false;
      }
    },
    onError: () => {
      showToast('An unexpected error occurred', 'error');
    },
  });

  return {
    previewMutation,
    bulkCreateMutation,
    resetSlice,
  };
}
