'use client';

import { Competitor } from '@/types/competitor';
import { CompetitorCard } from '../CompetitorCard';

interface CompetitorGridViewProps {
  competitors: Competitor[];
  onDelete: (id: string) => void;
  compact?: boolean;
}

export function CompetitorGridView({
  competitors,
  onDelete,
  compact = false,
}: CompetitorGridViewProps) {
  return (
    <div
      className={
        compact
          ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
          : 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'
      }
    >
      {competitors.map((competitor) => (
        <CompetitorCard
          key={competitor.id}
          competitor={competitor}
          onDelete={onDelete}
          variant={compact ? 'compact' : 'full'}
        />
      ))}
    </div>
  );
}
