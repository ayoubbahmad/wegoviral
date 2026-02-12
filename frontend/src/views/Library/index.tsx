import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { HooksList } from '@/containers/Library/HooksList';
import { ScriptTemplatesList } from '@/containers/Library/ScriptTemplatesList';
import { AddHookContainer } from '@/containers/Library/AddHook';
import { AddScriptContainer } from '@/containers/Library/AddScript';
import { DetailsPanel } from '@/containers/Library/components/DetailsPanel';
import { useLibraryController } from '@/containers/Library/controller';
import { useLibraryStore } from '@/containers/Library/slice';
import { Button } from '@/components/Button';
import { Tabs } from '@/components/Tabs';
import { ViewToggle } from '@/components/ViewToggle';
import { SearchInput } from '@/components/SearchInput';
import { Plus, Anchor, Palette, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export const LibraryView = () => {
  const {
    addHook,
    updateHook,
    addTemplate,
    updateTemplate,
    selectedItem,
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
  } = useLibraryController();

  return (
    <PageContainer>
      <PageHeader
        title='Library'
        description='Manage your creative assets, hooks, and script structures.'
        actions={
          <Button
            onClick={() => setIsAdding(true)}
            leftIcon={<Plus className='w-4 h-4' />}
          >
            Add New Asset
          </Button>
        }
      />

      {activeTab === 'hooks' && (
        <AddHookContainer
          onAddHook={async (data) => {
            try {
              await addHook(data);
              return { success: true };
            } catch (error: any) {
              return { success: false, error: error.message };
            }
          }}
          onUpdateHook={async (id, data) => {
            try {
              await updateHook({ id, data });
              return { success: true };
            } catch (error: any) {
              return { success: false, error: error.message };
            }
          }}
          editItem={selectedItem as any}
        />
      )}

      {activeTab === 'scripts' && (
        <AddScriptContainer
          onAddScript={async (data) => {
            try {
              await addTemplate(data);
              return { success: true };
            } catch (error: any) {
              return { success: false, error: error.message };
            }
          }}
          onUpdateScript={async (id, data) => {
            try {
              await updateTemplate({ id, data });
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
              placeholder='Search assets...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              'flex-1 w-full transition-all duration-300',
              selectedItemId ? 'lg:w-[calc(100%-380px)]' : 'w-full',
            )}
          >
            <Tabs
              items={[
                { id: 'hooks', label: 'Hooks', icon: Anchor },
                { id: 'scripts', label: 'Templates', icon: Palette },
                { id: 'videos', label: 'Videos', icon: Video },
              ]}
              activeId={activeTab}
              onChange={(id) => setActiveTab(id as any)}
              className='mb-8'
            />

            <div className='min-h-[400px]'>
              {activeTab === 'hooks' ? (
                <HooksList />
              ) : activeTab === 'scripts' ? (
                <ScriptTemplatesList />
              ) : (
                <div className='flex flex-col items-center justify-center p-20 border-2 border-dashed border-border rounded-3xl bg-muted/20'>
                  <Video className='w-12 h-12 text-muted-foreground/30 mb-4' />
                  <h3 className='text-lg font-bold'>Videos Tab Coming Soon</h3>
                  <p className='text-sm text-muted-foreground'>
                    Save viral videos directly to your library.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Details Panel - Sticky/Floating on Desktop */}
          <AnimatePresence>
            {selectedItemId && (
              <motion.div
                initial={{ x: 400, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 400, opacity: 0 }}
                className='w-full lg:w-[380px] lg:sticky lg:top-8 shrink-0 z-20'
              >
                <DetailsPanel
                  item={selectedItem || null}
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
