import { useState } from 'react';
import { useToast } from '@/providers/Toast';
import { Competitor } from '@/types/competitor';
import { useGetCompetitor } from '../api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { watchlistsApi } from '../../api/watchlists';
import {
  useGetCreators,
  useLinkCompetitor,
  useUnlinkCompetitor,
  useCreateCreator,
  useGetCreator,
} from '../../api/creators';
import { useT } from '@/i18n/provider';

export const useCompetitorDetailController = (id: string) => {
  const { showToast } = useToast();
  const t = useT();
  const queryClient = useQueryClient();
  const [savedHooks, setSavedHooks] = useState<string[]>([]);
  const [savedStructures, setSavedStructures] = useState<string[]>([]);

  const { data: competitor, isLoading, error } = useGetCompetitor(id);

  // Creator data
  const { data: allCreators } = useGetCreators();
  const { data: linkedCreator } = useGetCreator(competitor?.creatorId || null);

  const { mutate: linkCompetitor } = useLinkCompetitor();
  const { mutate: unlinkCompetitor } = useUnlinkCompetitor();
  const { mutate: createCreator } = useCreateCreator();

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
      showToast(t('creator.competitor.addedToWatchlist'), 'success');
    },
    onError: () => showToast(t('creator.competitor.addToWatchlistFailed'), 'error'),
  });

  const removeMutation = useMutation({
    mutationFn: (watchlistId: string) =>
      watchlistsApi.removeCompetitor(watchlistId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competitor', id] });
      queryClient.invalidateQueries({ queryKey: ['watchlists'] });
      showToast(t('creator.competitor.removedFromWatchlist'), 'success');
    },
    onError: () => showToast(t('creator.competitor.removeFromWatchlistFailed'), 'error'),
  });

  const posts = competitor?.posts || [];

  const handleSave = (postId: string, type: 'hook' | 'structure') => {
    if (type === 'hook') {
      setSavedHooks((prev) => [...prev, postId]);
      showToast(t('creator.competitor.hookSaved'), 'success');
    } else {
      setSavedStructures((prev) => [...prev, postId]);
      showToast(t('creator.competitor.structureSaved'), 'success');
    }
  };

  const handleLinkCreator = (creatorId: string) => {
    linkCompetitor(
      { competitorId: id, creatorId },
      {
        onSuccess: () => showToast(t('creator.competitor.linked'), 'success'),
      },
    );
  };

  const handleUnlinkCreator = () => {
    unlinkCompetitor(id, {
      onSuccess: () => showToast(t('creator.competitor.unlinked'), 'success'),
    });
  };

  const handleCreateAndLinkCreator = (name: string) => {
    createCreator(name, {
      onSuccess: (newCreator) => {
        handleLinkCreator(newCreator.id);
      },
    });
  };

  return {
    competitor,
    linkedCreator,
    allCreators: allCreators || [],
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
    linkCreator: handleLinkCreator,
    unlinkCreator: handleUnlinkCreator,
    createAndLinkCreator: handleCreateAndLinkCreator,
  };
};
