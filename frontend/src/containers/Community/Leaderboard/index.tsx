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
import { useT } from '@/i18n/provider';
import { T } from '@/i18n/T';
import { howToEarn } from '@/lib/badges';
import { MemberLink } from '@/components/MemberLink';

const PERIODS: LeaderboardPeriod[] = ['7d', '30d', 'all'];

const MEDALS = ['🥇', '🥈', '🥉'];

const displayName = (member: { name?: string | null; username: string }) => member.name || `@${member.username}`;

export const CommunityLeaderboardContainer = () => {
  const t = useT();
  const [period, setPeriod] = useState<LeaderboardPeriod>('30d');
  const [showHelp, setShowHelp] = useState(false);
  const { data, isPending, error } = useLeaderboard(period);

  return (
    <PageContainer>
      <PageHeader
        helpHref="/community/help/points-levels-badges"
        title={t('leaderboard.title')}
        description={t('leaderboard.description')}
        actions={
          <Button variant="outline" onClick={() => setShowHelp(true)}>
            <HelpCircle className="w-4 h-4" /> {t('leaderboard.howPoints')}
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-4 lg:order-1">
          {data ? <MyLevelCard data={data} /> : <Skeleton className="h-36 rounded-2xl" />}
          <LevelsCard current={data?.me.level} />
        </div>

        <div className="min-w-0 space-y-4">
          <div role="tablist" aria-label={t('leaderboard.period')} className="flex gap-1 rounded-xl border border-border bg-card p-1">
            {PERIODS.map((option) => (
              <button
                key={option}
                role="tab"
                aria-selected={period === option}
                onClick={() => setPeriod(option)}
                className={cn(
                  'flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
                  period === option ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {t(`leaderboard.periods.${option}`)}
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
            <EmptyState icon={Trophy} title={t('leaderboard.emptyTitle')} description={t('leaderboard.emptyBody')} />
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
    <T k="leaderboard.levelChip" vars={{ level: level.level, name: level.name }} />
  </span>
);

const MyLevelCard = ({ data }: { data: Leaderboard }) => {
  const t = useT();
  const { member, level, rank, periodPoints } = data.me;
  const span = level.next ? level.next.minPoints - level.minPoints : 1;
  return (
    <Card className="space-y-4">
      <div className="flex items-center gap-3">
        <img src={avatarFor(member)} alt="" className="h-12 w-12 rounded-full border border-border" />
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 font-semibold">
            <MemberLink username={member.username} className="truncate">{displayName(member)}</MemberLink>
            <MemberBadges badges={member.badges} />
          </p>
          <p className="text-sm text-muted-foreground">{t('leaderboard.levelLine', { level: level.level, name: level.name })}</p>
        </div>
      </div>
      <div className="space-y-1.5">
        <ProgressBar value={level.next ? member.points - level.minPoints : 1} max={span} />
        <p className="text-xs text-muted-foreground">
          {level.next
            ? t('leaderboard.progressNext', { points: member.points, toGo: level.next.pointsToGo, level: level.next.level, name: level.next.name })
            : t('leaderboard.progressTop', { points: member.points })}
        </p>
      </div>
      <p className="rounded-lg bg-secondary/50 px-3 py-2 text-sm">
        {rank ? t('leaderboard.myRank', { rank, points: periodPoints }) : t('leaderboard.notRanked')}
      </p>
    </Card>
  );
};

const LevelsCard = ({ current }: { current?: MemberLevel }) => {
  const t = useT();
  const { data } = useHowPointsWork();
  if (!data) return null;
  return (
    <Card padding="none">
      <p className="px-5 pt-4 text-sm font-bold">{t('leaderboard.levels')}</p>
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
              <span className="text-xs">{t('leaderboard.pts', { count: level.minPoints })}</span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
};

const Podium = ({ entries }: { entries: LeaderboardEntry[] }) => {
  const t = useT();
  return (
  <div className="grid gap-3 sm:grid-cols-3">
    {entries.map((entry, index) => (
      <Card key={entry.member.id} className={cn('flex flex-col items-center gap-2 text-center', index === 0 && 'border-amber-500/40 bg-amber-500/5')}>
        <span className="text-2xl" aria-label={t('leaderboard.rank', { rank: entry.rank })}>
          {MEDALS[entry.rank - 1] ?? `#${entry.rank}`}
        </span>
        <img src={avatarFor(entry.member)} alt="" className="h-14 w-14 rounded-full border border-border" />
        <div className="min-w-0 max-w-full">
          <MemberLink username={entry.member.username} className="block truncate font-semibold">{displayName(entry.member)}</MemberLink>
          <MemberBadges badges={entry.member.badges} className="mt-1 justify-center" />
        </div>
        <LevelChip level={entry.level} />
        <p className="text-lg font-bold">{t('leaderboard.pts', { count: entry.points })}</p>
      </Card>
    ))}
  </div>
  );
};

const LeaderboardRow = ({ entry, isMe }: { entry: LeaderboardEntry; isMe: boolean }) => (
  <li className={cn('flex items-center gap-3 px-5 py-3', isMe && 'bg-primary/5')}>
    <span className="w-7 shrink-0 text-center text-sm font-bold text-muted-foreground">{entry.rank}</span>
    <img src={avatarFor(entry.member)} alt="" className="h-9 w-9 shrink-0 rounded-full border border-border" />
    <div className="min-w-0 flex-1">
      <p className="flex items-center gap-1.5 text-sm font-medium">
        <MemberLink username={entry.member.username} className="truncate">{displayName(entry.member)}</MemberLink>
        <MemberBadges badges={entry.member.badges} />
      </p>
      <p className="text-xs text-muted-foreground">
        <T k="leaderboard.levelLine" vars={{ level: entry.level.level, name: entry.level.name }} />
      </p>
    </div>
    <span className="shrink-0 text-sm font-bold"><T k="leaderboard.pts" vars={{ count: entry.points }} /></span>
  </li>
);

const HowPointsWorkDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const t = useT();
  const { data } = useHowPointsWork(isOpen);
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('leaderboard.dialogTitle')} maxWidth="2xl">
      {!data ? (
        <Skeleton className="h-64 rounded-xl" />
      ) : (
        <div className="space-y-6 text-sm">
          <section className="space-y-2">
            <h3 className="font-bold">{t('leaderboard.earning')}</h3>
            <ul className="divide-y divide-border/50 rounded-xl border border-border">
              {data.rules.map((rule) => (
                <li key={rule.action} className="flex items-center gap-3 px-4 py-2.5">
                  <span className="flex-1">{t(`points.actions.${rule.action as 'POST_PUBLISHED'}`)}</span>
                  {rule.dailyCap && rule.points > 0 && <span className="text-xs text-muted-foreground">{t('leaderboard.upToPerDay', { count: rule.dailyCap })}</span>}
                  <span className={cn('w-14 text-end font-bold', rule.points < 0 ? 'text-red-500' : 'text-emerald-500')}>
                    {rule.points > 0 ? '+' : ''}
                    {rule.points}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground">
              {t('leaderboard.earningNote')}
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold">{t('leaderboard.levels')}</h3>
            <p className="text-muted-foreground">{t('leaderboard.levelsNote')}</p>
            <div className="flex flex-wrap gap-2">
              {data.levels.map((level) => (
                <span key={level.level} className="rounded-full border border-border px-3 py-1 text-xs">
                  <span className="font-bold">{level.level}</span> {level.name} · {t('leaderboard.pts', { count: level.minPoints })}
                </span>
              ))}
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold">{t('leaderboard.badges')}</h3>
            <ul className="grid gap-2 sm:grid-cols-2">
              {data.badges.map((badge) => (
                <li key={badge.id} className="flex items-start gap-3 rounded-xl border border-border p-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg" style={{ backgroundColor: `${badge.color}26` }}>
                    {badge.emoji}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold">{badge.name}</p>
                    {badge.description && <p className="text-xs text-muted-foreground">{badge.description}</p>}
                    <p className="text-xs text-muted-foreground">{howToEarn(badge.autoRule, t)}</p>
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
