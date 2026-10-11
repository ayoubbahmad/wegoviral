import { cn, avatarFor } from '@/lib/utils';
import { LeaderboardEntry } from '@/types/communityFeed';

interface LeaderBoardRowProps {
  entry: LeaderboardEntry;
}

const RANK_STYLES: Record<number, string> = {
  1: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20 dark:text-yellow-400',
  2: 'bg-zinc-400/10 text-zinc-500 border-zinc-400/20 dark:text-zinc-300',
  3: 'bg-orange-500/10 text-orange-600 border-orange-500/20 dark:text-orange-400',
};

export const LeaderBoardRow = ({ entry }: LeaderBoardRowProps) => {
  const rankClasses =
    RANK_STYLES[entry.rank] ?? 'bg-secondary text-muted-foreground border-border';

  return (
    <div className="flex items-center gap-4 py-3">
      <span
        className={cn(
          'w-7 h-7 shrink-0 flex items-center justify-center rounded-full border text-xs font-bold',
          rankClasses,
        )}
      >
        {entry.rank}
      </span>
      <img
        src={avatarFor(entry.user)}
        alt={entry.user.username}
        className="w-8 h-8 rounded-full border border-border"
      />
      <span className="flex-1 text-sm font-medium truncate">
        @{entry.user.username}
      </span>
      <span className="text-sm font-bold text-foreground">
        {entry.points.toLocaleString()} pts
      </span>
    </div>
  );
};
