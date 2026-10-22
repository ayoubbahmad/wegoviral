import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { scriptsApi } from "../api";
import { Script } from "../api/types";
import { useT } from '@/i18n/provider';

export const useScriptsController = () => {
  const t = useT();
  const queryClient = useQueryClient();

  // Fetch Scripts
  const { data: scripts = [], isLoading, error } = useQuery<Script[]>({
    queryKey: ["scripts"],
    queryFn: scriptsApi.getScripts,
  });

  // Delete Script Mutation
  const deleteMutation = useMutation({
    mutationFn: scriptsApi.deleteScript,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scripts"] });
    },
  });

  const handleDeleteScript = async (id: string) => {
    if (confirm(t('creator.scripts.confirmDelete'))) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err) {
        console.error("Failed to delete script:", err);
        alert("Failed to delete script. Please try again.");
      }
    }
  };

  return {
    scripts,
    isLoading,
    error,
    handleDeleteScript,
    isDeleting: deleteMutation.isPending,
  };
};
