import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

import { Project } from '../../Projects/api/types';

export const useGetProject = (id: string) => {
  return useQuery<Project>({
    queryKey: ['projects', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/projects/${id}`);
      return data;
    },
  });
};
