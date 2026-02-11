'use client';

import { Tabs } from '@/components/Tabs';
import { HookCard } from './components/HookCard';
import { ScriptTemplateList } from './components/ScriptTemplateList';
import { useLibraryController } from './controller';
import { ViewToggle } from '@/components/ViewToggle';
import { DetailsPanel } from './components/DetailsPanel';
import { SearchInput } from '@/components/SearchInput';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Anchor, Palette, Video, Trash2 } from 'lucide-react';
import { Badge } from '@/components/Badge';

export const LibraryContainer = () => {
  const {
    hooks,
    templates,
    isLoading,
    activeTab,
    setActiveTab,
    viewType,
    setViewType,
    selectedItemId,
    setSelectedItemId,
    searchTerm,
    setSearchTerm,
    selectedItem,
    removeHook,
    removeTemplate,
    setIsEditing,
  } = useLibraryController();

  const handleDeleteHook = async (id: string) => {
    try {
      if (confirm('Are you sure you want to delete this hook?')) {
        await removeHook(id);
        if (selectedItemId === id) setSelectedItemId(null);
      }
    } catch (error) {
      console.error('Failed to delete hook', error);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      if (confirm('Are you sure you want to delete this template?')) {
        await removeTemplate(id);
        if (selectedItemId === id) setSelectedItemId(null);
      }
    } catch (error) {
      console.error('Failed to delete template', error);
    }
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin' />
      </div>
    );
  }

  return (
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
              viewType === 'grid' ? (
                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
                  {hooks.map((hook) => (
                    <HookCard
                      key={hook.id}
                      hook={hook}
                      isActive={selectedItemId === hook.id}
                      onClick={() => setSelectedItemId(hook.id)}
                      onDelete={handleDeleteHook}
                    />
                  ))}
                </div>
              ) : (
                <div className='rounded-2xl border border-border bg-card overflow-hidden'>
                  <table className='w-full text-left'>
                    <thead>
                      <tr className='border-b border-border bg-muted/30'>
                        <th className='px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground'>
                          Hook
                        </th>
                        <th className='px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground'>
                          Type
                        </th>
                        <th className='px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right'>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-border/50'>
                      {hooks.map((hook) => (
                        <tr
                          key={hook.id}
                          className={cn(
                            'hover:bg-muted/5 transition-colors cursor-pointer group',
                            selectedItemId === hook.id &&
                              'bg-primary/5 border-l-2 border-primary',
                          )}
                          onClick={() => setSelectedItemId(hook.id)}
                        >
                          <td className='px-6 py-4'>
                            <p className='text-sm font-medium line-clamp-1'>
                              "{hook.content}"
                            </p>
                          </td>
                          <td className='px-6 py-4'>
                            <Badge variant='secondary' className='text-[10px]'>
                              {hook.type}
                            </Badge>
                          </td>
                          <td className='px-6 py-4 text-right'>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteHook(hook.id);
                              }}
                              className='p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-muted-foreground hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100'
                            >
                              <Trash2 className='w-4 h-4' />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : activeTab === 'scripts' ? (
              <ScriptTemplateList
                scripts={templates}
                viewType={viewType}
                selectedId={selectedItemId}
                onSelect={(id) => setSelectedItemId(id)}
                onDelete={handleDeleteTemplate}
              />
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
  );
};
