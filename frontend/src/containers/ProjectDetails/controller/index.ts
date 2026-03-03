import { useGetProject } from '../api';

export const useProjectDetailsController = (id: string) => {
  const { data: project, isLoading, error } = useGetProject(id);

  return {
    project,
    isLoading,
    error,
  };
};
