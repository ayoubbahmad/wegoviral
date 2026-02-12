'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Anchor, Palette, Video } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/Button';
import { Tabs } from '@/components/Tabs';
import { SearchInput } from '@/components/SearchInput';
import { ViewToggle } from '@/components/ViewToggle';
import { useQuery } from '@tanstack/react-query';
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

export const LibraryView = () => {
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

  const selectedItem =
    activeTab === 'hooks'
      ? hooks.find((h: Hook) => h.id === selectedItemId)
      : (templates as ScriptTemplate[]).find(
          (t: ScriptTemplate) => t.id === selectedItemId,
        );

  return (
    <PageContainer>
      <PageHeader
        title='Library'
        description='Manage your creative assets, hooks, and script structures.'
        actions={
          <Button
            onClick={() => setIsAdding(true)}
            leftSection={<Plus className='w-4 h-4' />}
          >
            Add New Asset
          </Button>
        }
      />

      {activeTab === 'hooks' && (
        <AddHookForm
          onAddHook={async (data) => {
            try {
              await hookApi.createHook(data);
              return { success: true };
            } catch (error: any) {
              return { success: false, error: error.message };
            }
          }}
          onUpdateHook={async (id, data) => {
            try {
              await hookApi.updateHook(id, data);
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
              await scriptApi.createTemplate(data);
              return { success: true };
            } catch (error: any) {
              return { success: false, error: error.message };
            }
          }}
          onUpdateScript={async (id, data) => {
            try {
              await scriptApi.updateTemplate(id, data);
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
              placeholder={`Search ${activeTab}...`}
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
                { id: 'hooks', label: 'Hooks', icon: Anchor },
                { id: 'scripts', label: 'Templates', icon: Palette },
                { id: 'videos', label: 'Videos', icon: Video },
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
                <div>Videos Tab Coming Soon</div>
              )}
            </div>
          </div>

          {/* Details Panel - Sticky/Floating on Desktop */}
          <AnimatePresence>
            {selectedItemId && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
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
