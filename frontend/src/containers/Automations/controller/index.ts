import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  useGetAutomations,
  useCreateAutomation,
  useUpdateAutomation,
  useDeleteAutomation,
  CreateAutomationDTO,
  UpdateAutomationDTO,
} from '../api';
import {
  getAuthUrl,
  getMySocialAccounts,
  SocialAccount,
} from '../api/social-accounts';
import { useAutomationsStore } from '../slice';

export const useAutomationsController = () => {
  const { data: automations = [], isLoading, refetch } = useGetAutomations();
  const createMutation = useCreateAutomation();
  const updateMutation = useUpdateAutomation();
  const deleteMutation = useDeleteAutomation();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);

  // Store integration
  const {
    isAdding,
    editingId,
    viewType,
    formData,
    setIsAdding,
    setEditingId,
    setViewType,
    setFormData,
    resetForm,
  } = useAutomationsStore();

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setIsLoadingAccounts(true);
      const accounts = await getMySocialAccounts();
      setSocialAccounts(accounts);
    } catch (err) {
      console.error('Failed to fetch social accounts', err);
    } finally {
      setIsLoadingAccounts(false);
    }
  };

  const connectInstagram = async () => {
    try {
      const { url } = await getAuthUrl();
      window.location.href = url; // Redirect to FB
    } catch (err) {
      console.error('Failed to get auth URL', err);
      alert(
        'Failed to initiate Instagram connection. Check if API is running.',
      );
    }
  };

  const filteredAutomations = useMemo(() => {
    return automations.filter((automation) => {
      const matchesSearch =
        automation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        automation.triggerKeyword
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesPlatform =
        selectedPlatform === 'all' ||
        (automation.platform || 'instagram').toLowerCase() ===
          selectedPlatform.toLowerCase();

      return matchesSearch && matchesPlatform;
    });
  }, [automations, searchTerm, selectedPlatform]);

  const handleCreate = useCallback(
    async (data: CreateAutomationDTO) => {
      return createMutation.mutateAsync(data);
    },
    [createMutation],
  );

  const handleUpdate = useCallback(
    async (id: string, data: UpdateAutomationDTO) => {
      return updateMutation.mutateAsync({ id, data });
    },
    [updateMutation],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (confirm('Are you sure you want to delete this automation?')) {
        return deleteMutation.mutateAsync(id);
      }
    },
    [deleteMutation],
  );

  const handleToggleActive = useCallback(
    async (id: string, currentActive: boolean) => {
      return updateMutation.mutateAsync({
        id,
        data: { active: !currentActive },
      });
    },
    [updateMutation],
  );

  // Form Logic
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (
        !formData.name ||
        !formData.triggerKeyword ||
        !formData.responseMessage
      )
        return;

      try {
        if (editingId) {
          await handleUpdate(editingId, formData);
        } else {
          await handleCreate(formData);
        }
        resetForm();
      } catch (err) {
        console.error('Failed to save automation', err);
      }
    },
    [formData, editingId, handleUpdate, handleCreate, resetForm],
  );

  const startEdit = useCallback(
    (automation: {
      id: string;
      name: string;
      triggerKeyword: string;
      responseMessage: string;
      commentReplyEnabled: boolean;
      commentReplyMessage?: string | null;
      isGlobal: boolean;
      instagramPostId?: string | null;
    }) => {
      setFormData({
        name: automation.name,
        triggerKeyword: automation.triggerKeyword,
        responseMessage: automation.responseMessage,
        commentReplyEnabled: automation.commentReplyEnabled,
        commentReplyMessage: automation.commentReplyMessage || '',
        isGlobal: automation.isGlobal,
        instagramPostId: automation.instagramPostId || '',
      });
      setEditingId(automation.id);
      setIsAdding(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [setFormData, setEditingId, setIsAdding],
  );

  const cancelEdit = useCallback(() => {
    resetForm();
  }, [resetForm]);

  const toggleAdding = useCallback(() => {
    if (isAdding) {
      cancelEdit();
    } else {
      setIsAdding(true);
    }
  }, [isAdding, cancelEdit, setIsAdding]);

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
    refreshAutomations: refetch,

    // UI State & Logic
    isAdding,
    editingId,
    viewType,
    formData,
    setIsAdding,
    setViewType,
    setFormData,
    handleSubmit,
    startEdit,
    cancelEdit,
    toggleAdding,
  };
};
