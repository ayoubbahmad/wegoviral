import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { competitorsSharedApi } from './shared';

export const useGetCreators = () => {
  return useQuery({
    queryKey: ['creators'],
    queryFn: () => competitorsSharedApi.getCreators(),
  });
};

export const useGetCreator = (id: string | null) => {
  return useQuery({
    queryKey: ['creator', id],
    queryFn: () => competitorsSharedApi.getCreator(id!),
    enabled: !!id,
  });
};

export const useCreateCreator = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => competitorsSharedApi.createCreator(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creators'] });
    },
  });
};

export const useLinkCompetitor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      competitorId,
      creatorId,
    }: {
      competitorId: string;
      creatorId: string;
    }) => competitorsSharedApi.linkCompetitor(competitorId, creatorId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['competitor', variables.competitorId],
      });
      queryClient.invalidateQueries({ queryKey: ['creators'] });
      queryClient.invalidateQueries({ queryKey: ['creator'] });
    },
  });
};

export const useUnlinkCompetitor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (competitorId: string) =>
      competitorsSharedApi.unlinkCompetitor(competitorId),
    onSuccess: (_, competitorId) => {
      queryClient.invalidateQueries({ queryKey: ['competitor', competitorId] });
      queryClient.invalidateQueries({ queryKey: ['creators'] });
      queryClient.invalidateQueries({ queryKey: ['creator'] });
    },
  });
};
