import { useState } from 'react';
import { useToast } from '@/providers/Toast';
import { Competitor } from '@/types/competitor';
import { useGetCompetitor } from '../api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { watchlistsApi } from '../../api/watchlists';

export const useCompetitorDetailController = (id: string) => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [savedHooks, setSavedHooks] = useState<string[]>([]);
  const [savedStructures, setSavedStructures] = useState<string[]>([]);

  const { data: competitor, isLoading, error } = useGetCompetitor(id);

  const { data: allWatchlists } = useQuery({
    queryKey: ['watchlists'],
    queryFn: watchlistsApi.getAll,
  });

  const addMutation = useMutation({
    mutationFn: (watchlistId: string) =>
      watchlistsApi.addCompetitor(watchlistId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competitor', id] });
      queryClient.invalidateQueries({ queryKey: ['watchlists'] });
      showToast('Added to watchlist', 'success');
    },
    onError: () => showToast('Failed to add to watchlist', 'error'),
  });

  const removeMutation = useMutation({
    mutationFn: (watchlistId: string) =>
      watchlistsApi.removeCompetitor(watchlistId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competitor', id] });
      queryClient.invalidateQueries({ queryKey: ['watchlists'] });
      showToast('Removed from watchlist', 'success');
    },
    onError: () => showToast('Failed to remove from watchlist', 'error'),
  });

  const posts = competitor?.posts || [];

  const handleSave = (postId: string, type: 'hook' | 'structure') => {
    if (type === 'hook') {
      setSavedHooks((prev) => [...prev, postId]);
      showToast('Hook saved to Library!', 'success');
    } else {
      setSavedStructures((prev) => [...prev, postId]);
      showToast('Script Structure saved to Library!', 'success');
    }
  };

  return {
    competitor,
    posts,
    isLoading,
    error,
    savedHooks,
    savedStructures,
    handleSave,
    allWatchlists: allWatchlists || [],
    addToWatchlist: addMutation.mutate,
    removeFromWatchlist: removeMutation.mutate,
    isUpdatingWatchlist: addMutation.isPending || removeMutation.isPending,
  };
};
