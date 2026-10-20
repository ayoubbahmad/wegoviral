'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CommunityPoll } from '@/types/communityFeed';
import { useT } from '@/i18n/provider';

interface PostPollProps {
  poll: CommunityPoll;
  onVote: (optionId: string) => void;
}

export const PostPoll = ({ poll, onVote }: PostPollProps) => {
  const t = useT();
  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
  const hasVoted = Boolean(poll.votedOptionId);

  return (
    <div className="space-y-2">
      {poll.options.map((option) => {
        const percent = totalVotes ? Math.round((option.votes / totalVotes) * 100) : 0;
        const isMine = option.id === poll.votedOptionId;

        return (
          <button
            key={option.id}
            onClick={() => onVote(option.id)}
            disabled={hasVoted}
            className={cn(
              'relative flex w-full items-center justify-between overflow-hidden rounded-xl border px-4 py-2.5 text-start text-sm transition-colors',
              hasVoted
                ? 'cursor-default border-border'
                : 'border-border hover:border-primary/50 hover:bg-primary/5',
              isMine && 'border-primary/60',
            )}
          >
            {hasVoted && (
              <span
                className={cn(
                  'absolute inset-y-0 start-0 transition-all duration-500',
                  isMine ? 'bg-primary/15' : 'bg-secondary/50',
                )}
                style={{ width: `${percent}%` }}
              />
            )}
            <span className="relative flex items-center gap-2 font-medium">
              {option.label}
              {isMine && <Check className="w-3.5 h-3.5 text-primary" />}
            </span>
            {hasVoted && (
              <span className="relative text-xs font-bold tabular-nums">{percent}%</span>
            )}
          </button>
        );
      })}
      <p className="text-xs text-muted-foreground">
        {t('feed.poll.votes', { count: totalVotes })}
        {!hasVoted && t('feed.poll.voteToSee')}
      </p>
    </div>
  );
};
