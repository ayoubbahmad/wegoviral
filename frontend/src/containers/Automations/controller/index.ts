import { useState, useMemo } from "react";
import { 
  useGetAutomations, 
  useCreateAutomation, 
  useUpdateAutomation, 
  useDeleteAutomation,
  CreateAutomationDTO,
  UpdateAutomationDTO
} from "../api";

export const useAutomationsController = () => {
  const { data: automations = [], isLoading } = useGetAutomations();
  const createMutation = useCreateAutomation();
  const updateMutation = useUpdateAutomation();
  const deleteMutation = useDeleteAutomation();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("all");

  const filteredAutomations = useMemo(() => {
    return automations.filter(automation => {
      const matchesSearch = automation.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           automation.triggerKeyword.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPlatform = selectedPlatform === "all" || (automation.platform || "instagram").toLowerCase() === selectedPlatform.toLowerCase();
      
      return matchesSearch && matchesPlatform;
    });
  }, [automations, searchTerm, selectedPlatform]);

  const handleCreate = async (data: CreateAutomationDTO) => {
    return createMutation.mutateAsync(data);
  };

  const handleUpdate = async (id: string, data: UpdateAutomationDTO) => {
    return updateMutation.mutateAsync({ id, data });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this automation?")) {
      return deleteMutation.mutateAsync(id);
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    return updateMutation.mutateAsync({ id, data: { active: !currentActive } });
  };

  return {
    automations: filteredAutomations,
    rawAutomations: automations,
    isLoading,
    searchTerm,
    setSearchTerm,
    selectedPlatform,
    setSelectedPlatform,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleToggleActive
  };
};
