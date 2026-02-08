import { useState, useMemo, useEffect } from "react";
import { 
  useGetAutomations, 
  useCreateAutomation, 
  useUpdateAutomation, 
  useDeleteAutomation,
  CreateAutomationDTO,
  UpdateAutomationDTO
} from "../api";
import { getAuthUrl, getMySocialAccounts, SocialAccount } from "../api/social-accounts";

export const useAutomationsController = () => {
  const { data: automations = [], isLoading, refetch } = useGetAutomations();
  const createMutation = useCreateAutomation();
  const updateMutation = useUpdateAutomation();
  const deleteMutation = useDeleteAutomation();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setIsLoadingAccounts(true);
      const accounts = await getMySocialAccounts();
      setSocialAccounts(accounts);
    } catch (err) {
      console.error("Failed to fetch social accounts", err);
    } finally {
      setIsLoadingAccounts(false);
    }
  };

  const connectInstagram = async () => {
    try {
      const { url } = await getAuthUrl();
      window.location.href = url; // Redirect to FB
    } catch (err) {
      console.error("Failed to get auth URL", err);
      alert("Failed to initiate Instagram connection. Check if API is running.");
    }
  };

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
    socialAccounts,
    isLoadingAccounts,
    connectInstagram,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleToggleActive,
    refreshAutomations: refetch
  };
};
