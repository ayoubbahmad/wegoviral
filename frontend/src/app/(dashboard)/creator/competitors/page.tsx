'use client';

import { LayoutGrid, List, Search, Plus } from 'lucide-react';
import { AddCompetitorModal } from '@/containers/competitors/AddCompetitor';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/Button';
import { PageContainer } from '@/components/PageContainer';
import { useCompetitorsController } from '@/containers/competitors/controller';
import { useCompetitorsPageSlice } from '@/containers/competitors/slice/pageSlice';
import { CompetitorGridView } from '@/containers/competitors/components/CompetitorGridView';
import { CompetitorTableView } from '@/containers/competitors/components/CompetitorTableView';
import { WatchlistSidebar } from '@/containers/competitors/components/WatchlistSidebar';
import { CreateWatchlistModal } from '@/containers/competitors/components/CreateWatchlistModal';
import { CompetitorsSkeleton } from '@/containers/competitors/CompetitorsSkeleton';
import { useT } from '@/i18n/provider';

export default function CompetitorsPage() {
  const t = useT();
  const { competitors, isLoading, deleteCompetitor } =
    useCompetitorsController();
  const {
    isModalOpen,
    setIsModalOpen,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
  } = useCompetitorsPageSlice();

  const filteredCompetitors = competitors.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.handle.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (isLoading) {
    return <CompetitorsSkeleton />;
  }

  return (
    <PageContainer>
      <PageHeader
        title={t('creator.competitors.title')}
        description={t('creator.competitors.description')}
        actions={
          <div className='flex items-center gap-3'>
            <div className='flex items-center bg-secondary/20 p-1 rounded-xl border border-border/50'>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-background text-primary shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title={t('creator.competitors.gridView')}
                aria-label={t('creator.competitors.gridView')}
              >
                <LayoutGrid className='w-4 h-4' />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'table'
                    ? 'bg-background text-primary shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title={t('creator.competitors.tableView')}
                aria-label={t('creator.competitors.tableView')}
              >
                <List className='w-4 h-4' />
              </button>
            </div>
            <Button
              variant='primary'
              size='md'
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className='w-4 h-4' /> {t('creator.competitors.add')}
            </Button>
          </div>
        }
      />

      <div className='flex gap-8 pb-32'>
        <div className='flex-1 space-y-8'>
          <div className='flex items-center gap-2 p-3 bg-secondary/20 border border-border/50 rounded-2xl shadow-sm max-w-md focus-within:ring-1 focus-within:ring-primary/30 transition-all'>
            <Search className='w-4 h-4 text-muted-foreground/50' />
            <input
              type='text'
              placeholder={t('creator.competitors.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground/50 font-medium'
            />
          </div>

          {viewMode === 'grid' ? (
            <CompetitorGridView
              competitors={filteredCompetitors}
              onDelete={deleteCompetitor}
              compact // Compact by default in this view as requested
            />
          ) : (
            <CompetitorTableView
              competitors={filteredCompetitors}
              onDelete={deleteCompetitor}
            />
          )}
        </div>

        <WatchlistSidebar />
      </div>

      <AddCompetitorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <CreateWatchlistModal />
    </PageContainer>
  );
}
