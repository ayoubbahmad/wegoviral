import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { scriptsApi } from "../api";
import { Script } from "../api/types";

export const useScriptsController = () => {
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
    if (confirm("Are you sure you want to delete this script?")) {
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
