import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Project } from './types';
import { apiClient } from '@/lib/api-client';
import { TProjectType } from '../types';

// API Endpoints
export const PROJECTS_ENDPOINTS = {
  GET_LIST: '/projects',
  CREATE: '/projects',
};

// Tanstack Query Hooks
export const useGetProjects = () => {
  return useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data } = await apiClient.get(PROJECTS_ENDPOINTS.GET_LIST);
      return data;
    },
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newProject: {
      name: string;
      type: TProjectType;
      description?: string;
    }) => {
      const { data } = await apiClient.post(
        PROJECTS_ENDPOINTS.CREATE,
        newProject,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};
