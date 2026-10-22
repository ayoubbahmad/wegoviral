'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Anchor, Palette, Video } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/Button';
import { Tabs } from '@/components/Tabs';
import { SearchInput } from '@/components/SearchInput';
import { ViewToggle } from '@/components/ViewToggle';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { scriptListApi } from '@/containers/Library/ScriptTemplatesList/api';
import { cn } from '@/lib/utils';
import { Hook, ScriptTemplate } from '@/containers/Library/types';

// New Granular Containers
import { HooksList } from '@/containers/Library/HooksList';
import { ScriptTemplatesList } from '@/containers/Library/ScriptTemplatesList';
import { AddHookForm } from '@/containers/Library/AddHookForm';
import { AddScriptForm } from '@/containers/Library/AddScriptForm';
import { AssetDetailsPanel } from '@/containers/Library/AssetDetailsPanel';

// Shared Logic (now hosted in HooksList for orchestration)
import { useHooksListController } from '@/containers/Library/HooksList/controller';
import { useLibraryStore } from '@/containers/Library/HooksList/logic';
import { hookApi } from '@/containers/Library/AddHookForm/api';
import { scriptApi } from '@/containers/Library/AddScriptForm/api';
import { useT } from '@/i18n/provider';
import { useLocale } from '@/i18n/provider';

export const LibraryView = () => {
  const t = useT();
  const isRtl = useLocale().locale === 'ar';
  const { hooks = [], isLoading: hooksLoading } = useHooksListController();

  // We need to fetch templates for orchestration as well
  const { data: templates = [], isLoading: templatesLoading } = useQuery({
    queryKey: ['templates'],
    queryFn: scriptListApi.getTemplates,
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
    setIsAdding,
    setIsEditing,
  } = useLibraryStore();

  const queryClient = useQueryClient();

  // Mutations for Hooks
  const createHookMutation = useMutation({
    mutationFn: hookApi.createHook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hooks'] });
    },
  });

  const updateHookMutation = useMutation({
    mutationFn: (data: { id: string; hook: any }) =>
      hookApi.updateHook(data.id, data.hook),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hooks'] });
    },
  });

  // Mutations for Scripts
  const createScriptMutation = useMutation({
    mutationFn: scriptApi.createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });

  const updateScriptMutation = useMutation({
    mutationFn: (data: { id: string; script: any }) =>
      scriptApi.updateTemplate(data.id, data.script),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });

  const selectedItem =
    activeTab === 'hooks'
      ? hooks.find((h: Hook) => h.id === selectedItemId)
      : (templates as ScriptTemplate[]).find(
          (t: ScriptTemplate) => t.id === selectedItemId,
        );

  const handleAddNew = () => {
    setSelectedItemId(null);
    setIsAdding(true);
  };

  return (
    <PageContainer>
      <PageHeader
        title={t('creator.library.title')}
        description={t('creator.library.description')}
        actions={
          <Button
            onClick={handleAddNew}
            leftSection={<Plus className='w-4 h-4' />}
          >
            {t('creator.library.addNew')}
          </Button>
        }
      />

      {activeTab === 'hooks' && (
        <AddHookForm
          onAddHook={async (data) => {
            try {
              await createHookMutation.mutateAsync(data);
              return { success: true };
            } catch (error: any) {
              return { success: false, error: error.message };
            }
          }}
          onUpdateHook={async (id, data) => {
            try {
              await updateHookMutation.mutateAsync({ id, hook: data });
              return { success: true };
            } catch (error: any) {
              return { success: false, error: error.message };
            }
          }}
          editItem={selectedItem as any}
        />
      )}

      {activeTab === 'scripts' && (
        <AddScriptForm
          onAddScript={async (data) => {
            try {
              await createScriptMutation.mutateAsync(data);
              return { success: true };
            } catch (error: any) {
              return { success: false, error: error.message };
            }
          }}
          onUpdateScript={async (id, data) => {
            try {
              await updateScriptMutation.mutateAsync({ id, script: data });
              return { success: true };
            } catch (error: any) {
              return { success: false, error: error.message };
            }
          }}
          editItem={selectedItem as any}
        />
      )}

      <div className='flex flex-col gap-8'>
        {/* Search and Filters */}
        <div className='flex flex-col md:flex-row gap-4 items-center justify-between'>
          <div className='w-full md:max-w-md'>
            <SearchInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t(`creator.library.search.${activeTab}`)}
            />
          </div>

          <div className='flex items-center gap-4'>
            <ViewToggle mode={viewType} onChange={setViewType} />
            <div className='w-px h-6 bg-border/50 hidden md:block' />
          </div>
        </div>

        <div className='flex flex-col lg:flex-row gap-8 items-start relative'>
          {/* Content Column */}
          <div
            className={cn(
              'flex-1 w-full transition-all duration-500',
              selectedItemId ? 'lg:w-[calc(100%-432px)]' : 'w-full',
            )}
          >
            <Tabs
              items={[
                { id: 'hooks', label: t('creator.library.tabs.hooks'), icon: Anchor },
                { id: 'scripts', label: t('creator.library.tabs.scripts'), icon: Palette },
                { id: 'videos', label: t('creator.library.tabs.videos'), icon: Video },
              ]}
              activeId={activeTab}
              onChange={(id: any) => setActiveTab(id)}
              className='mb-8'
            />

            <div className='min-h-[400px]'>
              {activeTab === 'hooks' ? (
                <HooksList />
              ) : activeTab === 'scripts' ? (
                <ScriptTemplatesList />
              ) : (
                <div className='text-sm text-muted-foreground'>{t('creator.library.videosSoon')}</div>
              )}
            </div>
          </div>

          {/* Details Panel - Sticky/Floating on Desktop */}
          <AnimatePresence>
            {selectedItemId && (
              <motion.div
                initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRtl ? -20 : 20 }}
                className='w-full lg:w-auto'
              >
                <AssetDetailsPanel
                  item={(selectedItem as any) || null}
                  type={activeTab}
                  onClose={() => setSelectedItemId(null)}
                  onEdit={() => setIsEditing(true)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageContainer>
  );
};
