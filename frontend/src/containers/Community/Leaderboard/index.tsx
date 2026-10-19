'use client';

import { useState } from 'react';
import { HelpCircle, Lock, Trophy } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { Modal } from '@/components/Modal';
import { ProgressBar } from '@/components/ProgressBar';
import { Skeleton } from '@/components/Skeleton';
import { MemberBadges } from '@/components/MemberBadges';
import { avatarFor, cn } from '@/lib/utils';
import { Leaderboard, LeaderboardEntry, LeaderboardPeriod, MemberLevel } from '@/types/communityFeed';
import { useHowPointsWork, useLeaderboard } from './api';

const PERIODS: { id: LeaderboardPeriod; label: string }[] = [
  { id: '7d', label: 'Last 7 days' },
  { id: '30d', label: 'Last 30 days' },
  { id: 'all', label: 'All time' },
];

const MEDALS = ['🥇', '🥈', '🥉'];

const displayName = (member: { name?: string | null; username: string }) => member.name || `@${member.username}`;

export const CommunityLeaderboardContainer = () => {
  const [period, setPeriod] = useState<LeaderboardPeriod>('30d');
  const [showHelp, setShowHelp] = useState(false);
  const { data, isPending, error } = useLeaderboard(period);

  return (
    <PageContainer>
      <PageHeader
        title="Leaderboard"
        description="Earn points by posting, commenting and showing up. Level up to unlock more of the community."
        actions={
          <Button variant="outline" onClick={() => setShowHelp(true)}>
            <HelpCircle className="w-4 h-4" /> How do points work?
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-4 lg:order-1">
          {data ? <MyLevelCard data={data} /> : <Skeleton className="h-36 rounded-2xl" />}
          <LevelsCard current={data?.me.level} />
        </div>

        <div className="min-w-0 space-y-4">
          <div role="tablist" aria-label="Period" className="flex gap-1 rounded-xl border border-border bg-card p-1">
            {PERIODS.map((option) => (
              <button
                key={option.id}
                role="tab"
                aria-selected={period === option.id}
                onClick={() => setPeriod(option.id)}
                className={cn(
                  'flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
                  period === option.id ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

          {isPending ? (
            <div className="space-y-3">
              <Skeleton className="h-40 rounded-2xl" />
              <Skeleton className="h-64 rounded-2xl" />
            </div>
          ) : error ? (
            <p className="text-sm text-muted-foreground">{error.message}</p>
          ) : data.entries.length === 0 ? (
            <EmptyState icon={Trophy} title="No points yet" description="Be the first: publish a post or join an event to get on the board." />
          ) : (
            <>
              <Podium entries={data.entries.slice(0, 3)} />
              {data.entries.length > 3 && (
                <Card padding="none">
                  <ol className="divide-y divide-border/50">
                    {data.entries.slice(3).map((entry) => (
                      <LeaderboardRow key={entry.member.id} entry={entry} isMe={entry.member.id === data.me.member.id} />
                    ))}
                  </ol>
                </Card>
              )}
            </>
          )}
        </div>
      </div>

      <HowPointsWorkDialog isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </PageContainer>
  );
};

const LevelChip = ({ level }: { level: MemberLevel }) => (
  <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
    Lv {level.level} · {level.name}
  </span>
);

const MyLevelCard = ({ data }: { data: Leaderboard }) => {
  const { member, level, rank, periodPoints } = data.me;
  const span = level.next ? level.next.minPoints - level.minPoints : 1;
  return (
    <Card className="space-y-4">
      <div className="flex items-center gap-3">
        <img src={avatarFor(member)} alt="" className="h-12 w-12 rounded-full border border-border" />
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 font-semibold">
            <span className="truncate">{displayName(member)}</span>
            <MemberBadges badges={member.badges} />
          </p>
          <p className="text-sm text-muted-foreground">
            Level {level.level} · {level.name}
          </p>
        </div>
      </div>
      <div className="space-y-1.5">
        <ProgressBar value={level.next ? member.points - level.minPoints : 1} max={span} />
        <p className="text-xs text-muted-foreground">
          {level.next
            ? `${member.points.toLocaleString()} points · ${level.next.pointsToGo.toLocaleString()} more to reach Level ${level.next.level} (${level.next.name})`
            : `${member.points.toLocaleString()} points · you've reached the top level`}
        </p>
      </div>
      <p className="rounded-lg bg-secondary/50 px-3 py-2 text-sm">
        {rank ? (
          <>
            You&apos;re <span className="font-bold">#{rank}</span> with {periodPoints.toLocaleString()} points in this period.
          </>
        ) : (
          'Earn points in this period to show up on the board.'
        )}
      </p>
    </Card>
  );
};

const LevelsCard = ({ current }: { current?: MemberLevel }) => {
  const { data } = useHowPointsWork();
  if (!data) return null;
  return (
    <Card padding="none">
      <p className="px-5 pt-4 text-sm font-bold">Levels</p>
      <ul className="p-2">
        {data.levels.map((level) => {
          const reached = current ? level.level <= current.level : false;
          return (
            <li
              key={level.level}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm',
                current?.level === level.level && 'bg-primary/10 font-semibold text-primary',
                !reached && 'text-muted-foreground',
              )}
            >
              <span className="w-6 text-center text-xs font-bold">{level.level}</span>
              <span className="flex-1">{level.name}</span>
              {!reached && <Lock className="w-3.5 h-3.5" />}
              <span className="text-xs">{level.minPoints.toLocaleString()} pts</span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
};

const Podium = ({ entries }: { entries: LeaderboardEntry[] }) => (
  <div className="grid gap-3 sm:grid-cols-3">
    {entries.map((entry, index) => (
      <Card key={entry.member.id} className={cn('flex flex-col items-center gap-2 text-center', index === 0 && 'border-amber-500/40 bg-amber-500/5')}>
        <span className="text-2xl" aria-label={`Rank ${entry.rank}`}>
          {MEDALS[entry.rank - 1] ?? `#${entry.rank}`}
        </span>
        <img src={avatarFor(entry.member)} alt="" className="h-14 w-14 rounded-full border border-border" />
        <div className="min-w-0 max-w-full">
          <p className="truncate font-semibold">{displayName(entry.member)}</p>
          <MemberBadges badges={entry.member.badges} className="mt-1 justify-center" />
        </div>
        <LevelChip level={entry.level} />
        <p className="text-lg font-bold">{entry.points.toLocaleString()} pts</p>
      </Card>
    ))}
  </div>
);

const LeaderboardRow = ({ entry, isMe }: { entry: LeaderboardEntry; isMe: boolean }) => (
  <li className={cn('flex items-center gap-3 px-5 py-3', isMe && 'bg-primary/5')}>
    <span className="w-7 shrink-0 text-center text-sm font-bold text-muted-foreground">{entry.rank}</span>
    <img src={avatarFor(entry.member)} alt="" className="h-9 w-9 shrink-0 rounded-full border border-border" />
    <div className="min-w-0 flex-1">
      <p className="flex items-center gap-1.5 text-sm font-medium">
        <span className="truncate">{displayName(entry.member)}</span>
        <MemberBadges badges={entry.member.badges} />
      </p>
      <p className="text-xs text-muted-foreground">
        Level {entry.level.level} · {entry.level.name}
      </p>
    </div>
    <span className="shrink-0 text-sm font-bold">{entry.points.toLocaleString()} pts</span>
  </li>
);

const HowPointsWorkDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { data } = useHowPointsWork(isOpen);
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="How points work" maxWidth="2xl">
      {!data ? (
        <Skeleton className="h-64 rounded-xl" />
      ) : (
        <div className="space-y-6 text-sm">
          <section className="space-y-2">
            <h3 className="font-bold">Earning points</h3>
            <ul className="divide-y divide-border/50 rounded-xl border border-border">
              {data.rules.map((rule) => (
                <li key={rule.action} className="flex items-center gap-3 px-4 py-2.5">
                  <span className="flex-1">{rule.label}</span>
                  {rule.dailyCap && rule.points > 0 && <span className="text-xs text-muted-foreground">up to {rule.dailyCap}/day</span>}
                  <span className={cn('w-14 text-right font-bold', rule.points < 0 ? 'text-red-500' : 'text-emerald-500')}>
                    {rule.points > 0 ? '+' : ''}
                    {rule.points}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground">
              Deleting a post or comment, or taking back a like, also takes back its points. The leaderboard periods count the points earned in that time.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold">Levels</h3>
            <p className="text-muted-foreground">Your level comes from your total points. Some spaces and events open at a level.</p>
            <div className="flex flex-wrap gap-2">
              {data.levels.map((level) => (
                <span key={level.level} className="rounded-full border border-border px-3 py-1 text-xs">
                  <span className="font-bold">{level.level}</span> {level.name} · {level.minPoints.toLocaleString()} pts
                </span>
              ))}
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold">Badges</h3>
            <ul className="grid gap-2 sm:grid-cols-2">
              {data.badges.map((badge) => (
                <li key={badge.id} className="flex items-start gap-3 rounded-xl border border-border p-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg" style={{ backgroundColor: `${badge.color}26` }}>
                    {badge.emoji}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold">{badge.name}</p>
                    {badge.description && <p className="text-xs text-muted-foreground">{badge.description}</p>}
                    <p className="text-xs text-muted-foreground">{badge.howToEarn}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </Modal>
  );
};
