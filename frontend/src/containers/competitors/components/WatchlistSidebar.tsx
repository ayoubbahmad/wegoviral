'use client';

import { useState, useEffect } from 'react';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { watchlistsApi } from '../api/watchlists';
import {
  Plus,
  List,
  FolderPlus,
  MoreVertical,
  Trash2,
  Edit2,
  Check,
  X,
  Folder,
} from 'lucide-react';
import { useCompetitorsPageSlice } from '../slice/pageSlice';
import { useWatchlistSlice } from '../slice/watchlistSlice';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useT } from '@/i18n/provider';

export function WatchlistSidebar() {
  const t = useT();
  const { selectedWatchlistId, setSelectedWatchlistId } =
    useCompetitorsPageSlice();
  const { setIsCreateModalOpen } = useWatchlistSlice();
  const queryClient = useQueryClient();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const { data: watchlists, isLoading } = useQuery({
    queryKey: ['watchlists'],
    queryFn: watchlistsApi.getAll,
  });

  // Mutations
  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      watchlistsApi.update(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlists'] });
      setEditingId(null);
      setEditName('');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => watchlistsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlists'] });
      if (selectedWatchlistId) {
        setSelectedWatchlistId(null); // Reset selection if deleted
      }
    },
  });

  const handleEdit = (watchlist: any) => {
    setEditingId(watchlist.id);
    setEditName(watchlist.name);
    setMenuOpenId(null);
  };

  const handleSave = (id: string) => {
    if (editName.trim()) {
      updateMutation.mutate({ id, name: editName });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t('creator.competitors.confirmDeleteWatchlist'))) {
      deleteMutation.mutate(id);
    }
    setMenuOpenId(null);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setMenuOpenId(null);
    if (menuOpenId) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [menuOpenId]);

  return (
    <div className='w-64 flex flex-col gap-6'>
      <div className='bg-card rounded-2xl border border-border/50 p-4 space-y-4 shadow-sm h-fit'>
        <div className='flex items-center justify-between px-2'>
          <h3 className='text-xs font-black uppercase tracking-widest text-muted-foreground'>
            {t('creator.competitors.watchlists')}
          </h3>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className='p-1.5 rounded-lg hover:bg-secondary text-primary transition-colors'
            title={t('creator.competitors.createWatchlist')}
            aria-label={t('creator.competitors.createWatchlist')}
          >
            <FolderPlus className='w-4 h-4' />
          </button>
        </div>

        <div className='space-y-1'>
          <button
            onClick={() => setSelectedWatchlistId(null)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
              selectedWatchlistId === null
                ? 'bg-primary/10 text-primary shadow-sm shadow-primary/5'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
            )}
          >
            <List
              className={cn(
                'w-4 h-4 transition-colors',
                selectedWatchlistId === null
                  ? 'text-primary'
                  : 'text-muted-foreground group-hover:text-foreground',
              )}
            />
            <span>{t('creator.competitors.allChannels')}</span>
          </button>

          {isLoading ? (
            <div className='py-4 flex justify-center'>
              <Loader2 className='w-4 h-4 animate-spin text-muted-foreground' />
            </div>
          ) : (
            watchlists?.map((watchlist: any) => (
              <div key={watchlist.id} className='relative group/item'>
                {editingId === watchlist.id ? (
                  <div className='flex items-center gap-2 px-2 py-1.5 rounded-xl bg-secondary/50 border border-primary/20'>
                    <input
                      type='text'
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className='flex-1 bg-transparent text-sm border-none outline-none min-w-0'
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSave(watchlist.id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <button
                      onClick={() => handleSave(watchlist.id)}
                      aria-label={t('creator.competitors.save')}
                      className='text-green-500 hover:text-green-600 p-1'
                    >
                      <Check className='w-3 h-3' />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      aria-label={t('creator.competitors.cancelEdit')}
                      className='text-red-500 hover:text-red-600 p-1'
                    >
                      <X className='w-3 h-3' />
                    </button>
                  </div>
                ) : (
                  <div className='relative'>
                    <button
                      onClick={() => setSelectedWatchlistId(watchlist.id)}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                        selectedWatchlistId === watchlist.id
                          ? 'bg-primary/10 text-primary shadow-sm shadow-primary/5'
                          : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                      )}
                    >
                      <div className='flex items-center gap-3 min-w-0'>
                        <Folder
                          className={cn(
                            'w-4 h-4 transition-colors flex-shrink-0',
                            selectedWatchlistId === watchlist.id
                              ? 'text-primary'
                              : 'text-muted-foreground group-hover:text-foreground',
                          )}
                        />
                        <span className='truncate'>{watchlist.name}</span>
                      </div>
                      {watchlist._count && watchlist._count.competitors > 0 && (
                        <span
                          className={cn(
                            'text-[10px] px-1.5 py-0.5 rounded-md font-bold me-6',
                            selectedWatchlistId === watchlist.id
                              ? 'bg-primary/20 text-primary'
                              : 'bg-secondary text-muted-foreground',
                          )}
                        >
                          {watchlist._count.competitors}
                        </span>
                      )}
                    </button>

                    {/* Action Menu Trigger */}
                    <div className='absolute end-1 top-1/2 -translate-y-1/2'>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpenId(
                            menuOpenId === watchlist.id ? null : watchlist.id,
                          );
                        }}
                        aria-label={t('creator.competitors.moreOptions')}
                        className='p-1.5 rounded-lg hover:bg-background/80 text-muted-foreground hover:text-foreground transition-colors'
                      >
                        <MoreVertical className='w-3 h-3' />
                      </button>
                    </div>

                    {/* Action Menu Dropdown */}
                    {menuOpenId === watchlist.id && (
                      <div
                        className='absolute end-0 top-full mt-1 w-32 bg-popover border border-border rounded-xl shadow-lg z-50 overflow-hidden py-1'
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => handleEdit(watchlist)}
                          className='w-full text-start px-3 py-2 text-xs font-medium hover:bg-secondary flex items-center gap-2 text-foreground'
                        >
                          <Edit2 className='w-3 h-3' /> {t('creator.competitors.rename')}
                        </button>
                        <button
                          onClick={() => handleDelete(watchlist.id)}
                          className='w-full text-start px-3 py-2 text-xs font-medium hover:bg-red-500/10 text-red-500 flex items-center gap-2'
                        >
                          <Trash2 className='w-3 h-3' /> {t('creator.competitors.delete')}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
