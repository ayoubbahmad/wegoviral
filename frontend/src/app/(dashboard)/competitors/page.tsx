'use client';

import { CompetitorCard } from '@/containers/Competitors/CompetitorCard';
import { CompetitorsSkeleton } from '@/containers/Competitors/CompetitorsSkeleton';
import { Plus, Search } from 'lucide-react';
import { AddCompetitorModal } from '@/containers/Competitors/AddCompetitor';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/Button';
import { PageContainer } from '@/components/PageContainer';
import { useCompetitorsController } from '@/containers/Competitors/controller';
import { useCompetitorsPageSlice } from '@/containers/Competitors/slice/pageSlice';

export default function CompetitorsPage() {
  const { competitors, isLoading, deleteCompetitor } =
    useCompetitorsController();
  const { isModalOpen, setIsModalOpen, searchQuery, setSearchQuery } =
    useCompetitorsPageSlice();

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
        title='Competitor Tracking'
        description='Monitor top creators in your niche and analyze their winning strategies.'
        actions={
          <Button
            variant='primary'
            size='md'
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className='w-4 h-4' /> Add Competitor
          </Button>
        }
      />

      <div className='space-y-12 pb-32'>
        <AddCompetitorModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

        <div className='flex items-center gap-2 p-3 bg-secondary/20 border border-border/50 rounded-2xl shadow-sm max-w-md focus-within:ring-1 focus-within:ring-primary/30 transition-all'>
          <Search className='w-4 h-4 text-muted-foreground/50' />
          <input
            type='text'
            placeholder='Search competitors...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground/50 font-medium'
          />
        </div>

        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {filteredCompetitors.map((competitor) => (
            <CompetitorCard
              key={competitor.id}
              competitor={competitor}
              onDelete={deleteCompetitor}
            />
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
