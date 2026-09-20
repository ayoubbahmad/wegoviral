import { Card } from '@/components/Card';
import { LeaderboardEntry } from '@/types/communityFeed';
import { LeaderBoardRow } from './LeaderBoardRow';

interface LeaderBoardTabProps {
  leaderboard: LeaderboardEntry[];
}

export const LeaderBoardTab = ({ leaderboard }: LeaderBoardTabProps) => {
  const sorted = [...leaderboard].sort((a, b) => a.rank - b.rank);

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <div className="divide-y divide-border/50">
          {sorted.map((entry) => (
            <LeaderBoardRow key={entry.rank} entry={entry} />
          ))}
        </div>
      </Card>
    </div>
  );
};
