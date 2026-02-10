import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { libraryApi } from '../api';
import {
  Hook,
  ScriptTemplate,
  CreateHookDTO,
  UpdateHookDTO,
  CreateScriptTemplateDTO,
  UpdateScriptTemplateDTO,
} from '../api/types';
import { useLibraryStore } from '../slice';

export const useLibraryController = () => {
  const queryClient = useQueryClient();

  // Hooks Query
  const { data: hooks = [], isLoading: hooksLoading } = useQuery<Hook[]>({
    queryKey: ['hooks'],
    queryFn: libraryApi.getHooks,
  });

  // Templates Query
  const { data: templates = [], isLoading: templatesLoading } = useQuery<
    ScriptTemplate[]
  >({
    queryKey: ['templates'],
    queryFn: libraryApi.getTemplates,
  });

  // Hook Mutations
  const createHookMutation = useMutation({
    mutationFn: libraryApi.createHook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hooks'] });
    },
  });

  const updateHookMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateHookDTO }) =>
      libraryApi.updateHook(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hooks'] });
    },
  });

  const deleteHookMutation = useMutation({
    mutationFn: libraryApi.deleteHook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hooks'] });
    },
  });

  // Template Mutations
  const createTemplateMutation = useMutation({
    mutationFn: libraryApi.createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });

  const updateTemplateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateScriptTemplateDTO }) =>
      libraryApi.updateTemplate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: libraryApi.deleteTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });

  const {
    activeTab,
    setActiveTab,
    viewType,
    setViewType,
    selectedItemId,
    setSelectedItemId,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    isAdding,
    setIsAdding,
    isEditing,
    setIsEditing,
  } = useLibraryStore();

  return {
    hooks,
    templates,
    isLoading: hooksLoading || templatesLoading,
    addHook: createHookMutation.mutateAsync,
    updateHook: updateHookMutation.mutateAsync,
    removeHook: deleteHookMutation.mutateAsync,
    addTemplate: createTemplateMutation.mutateAsync,
    updateTemplate: updateTemplateMutation.mutateAsync,
    removeTemplate: deleteTemplateMutation.mutateAsync,
    // UI State
    activeTab,
    setActiveTab,
    viewType,
    setViewType,
    selectedItemId,
    setSelectedItemId,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    isAdding,
    setIsAdding,
    isEditing,
    setIsEditing,
    selectedItem:
      activeTab === 'hooks'
        ? hooks.find((h) => h.id === selectedItemId)
        : templates.find((t) => t.id === selectedItemId),
  };
};
