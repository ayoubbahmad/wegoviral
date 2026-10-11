'use client';

import { cn } from '@/lib/utils';
import { CommunitySpace } from '@/types/communityFeed';
import { ALL_SPACES_ID } from '../../slice';

interface SpaceChipsProps {
  spaces: CommunitySpace[];
  activeSpaceId: string;
  postCountBySpace: Record<string, number>;
  onChange: (spaceId: string) => void;
}

export const SpaceChips = ({
  spaces,
  activeSpaceId,
  postCountBySpace,
  onChange,
}: SpaceChipsProps) => {
  const chips = [
    { id: ALL_SPACES_ID, name: 'All', emoji: '✨' },
    ...spaces,
  ];

  return (
    <div
      role="tablist"
      aria-label="Filter feed by space"
      className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {chips.map((chip) => {
        const isActive = chip.id === activeSpaceId;
        const count = postCountBySpace[chip.id] ?? 0;

        return (
          <button
            key={chip.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(chip.id)}
            className={cn(
              'flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all active:scale-95 whitespace-nowrap',
              isActive
                ? 'border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                : 'border-border bg-card/50 text-muted-foreground hover:text-foreground hover:border-foreground/20',
            )}
          >
            <span aria-hidden>{chip.emoji}</span>
            {chip.name}
            <span
              className={cn(
                'min-w-5 rounded-full px-1.5 text-[11px] font-bold tabular-nums',
                isActive ? 'bg-primary-foreground/20' : 'bg-secondary',
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
