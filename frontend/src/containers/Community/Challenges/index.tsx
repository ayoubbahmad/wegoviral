'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CalendarDays, CheckCircle2, Flame, Lock, Plus, Trophy, Users } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { ProgressBar } from '@/components/ProgressBar';
import { Skeleton } from '@/components/Skeleton';
import { useCan } from '@/providers/Auth';
import { describeLockReason } from '@/lib/access';
import { cn } from '@/lib/utils';
import { ChallengeScope, ChallengeSummary } from '@/types/challenges';
import { useChallenges } from './api';
import { ChallengeFormDialog } from './components/ChallengeFormDialog';
import { describeDates } from './utils';
import { useT } from '@/i18n/provider';

const SCOPES: ChallengeScope[] = ['active', 'upcoming', 'past'];

export const CommunityChallengesContainer = () => {
  const t = useT();
  const can = useCan();
  const router = useRouter();
  const [scope, setScope] = useState<ChallengeScope>('active');
  const [creating, setCreating] = useState(false);
  const { data: challenges = [], isPending, error } = useChallenges(scope);

  return (
    <PageContainer>
      <PageHeader
        helpHref="/community/help/challenges"
        title={t('challenges.title')}
        description={t('challenges.description')}
        actions={
          can('challenges.manage') && (
            <Button variant="primary" onClick={() => setCreating(true)}>
              <Plus className="w-4 h-4" /> {t('challenges.newChallenge')}
            </Button>
          )
        }
      />

      <div role="tablist" aria-label={t('challenges.when')} className="flex gap-4 border-b border-border text-sm font-semibold">
        {SCOPES.map((option) => (
          <button
            key={option}
            role="tab"
            aria-selected={scope === option}
            onClick={() => setScope(option)}
            className={cn('-mb-px border-b-2 pb-2 transition-colors', scope === option ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground')}
          >
            {t(`challenges.scopes.${option}`)}
          </button>
        ))}
      </div>

      {isPending ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <Skeleton key={index} className="h-72 rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-muted-foreground">{error.message}</p>
      ) : challenges.length === 0 ? (
        <EmptyState icon={Trophy} title={t(`challenges.empty.${scope}`)} description={scope === 'active' ? t('challenges.emptyActiveHint') : undefined} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {challenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      )}

      {creating && (
        <ChallengeFormDialog challenge={null} onClose={() => setCreating(false)} onSaved={(saved) => router.push(`/community/challenges/${saved.id}`)} />
      )}
    </PageContainer>
  );
};

const ChallengeCard = ({ challenge }: { challenge: ChallengeSummary }) => {
  const t = useT();
  const { me } = challenge;
  const percent = me ? Math.min(100, Math.round((me.checkInCount / challenge.requiredCheckIns) * 100)) : 0;
  return (
    <Link href={`/community/challenges/${challenge.id}`} className="group block">
      <Card padding="none" hover className={cn('flex h-full flex-col overflow-hidden', challenge.status === 'DRAFT' && 'border-dashed')}>
        <div className="relative">
          {challenge.coverUrl ? (
            <img src={challenge.coverUrl} alt="" className="h-36 w-full object-cover" />
          ) : (
            <div className="flex h-36 items-center justify-center bg-gradient-to-br from-amber-500/20 to-primary/10">
              <Trophy className="w-10 h-10 text-amber-500/70" />
            </div>
          )}
          <div className="absolute start-3 top-3 flex gap-1.5">
            {challenge.status !== 'PUBLISHED' && (
              <span className="rounded-full bg-background/90 px-2.5 py-0.5 text-xs font-bold">{challenge.status === 'DRAFT' ? t('common.draft') : t('common.cancelled')}</span>
            )}
            <span className="rounded-full bg-background/90 px-2.5 py-0.5 text-xs font-bold">
              {challenge.checkInType === 'DAILY' ? t('challenges.days', { count: challenge.totalDays }) : t('challenges.oneTime')}
            </span>
          </div>
          {challenge.access.locked && (
            <span className="absolute end-3 top-3 flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-0.5 text-xs font-bold">
              <Lock className="w-3 h-3" /> {t('common.locked')}
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="space-y-1">
            <h3 className="font-bold leading-snug group-hover:text-primary">{challenge.title}</h3>
            {challenge.description && <p className="line-clamp-2 text-sm text-muted-foreground">{challenge.description}</p>}
          </div>
          <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <CalendarDays className="w-3.5 h-3.5" /> {describeDates(challenge)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> {t('challenges.takingPart', { count: challenge.participantCount })}
            </span>
          </div>
          {challenge.prizes && <p className="text-xs"><span className="font-semibold">🎁 {t('challenges.prize')}</span> {challenge.prizes}</p>}
          {challenge.access.locked ? (
            <p className="text-xs text-amber-600 dark:text-amber-400">{challenge.access.reasons.map((reason) => describeLockReason(reason, t)).join(' · ')}</p>
          ) : me?.winnerRank ? (
            <p className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
              <Trophy className="w-4 h-4" /> {t('challenges.youWon', { rank: me.winnerRank })}
            </p>
          ) : me?.completedAt ? (
            <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> {t('challenges.finished')}
            </p>
          ) : me ? (
            <div className="space-y-1">
              <ProgressBar value={percent} />
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                {t('challenges.checkInsOf', { done: me.checkInCount, total: challenge.requiredCheckIns })}
                {me.currentStreak > 1 && (
                  <span className="flex items-center gap-0.5 font-semibold text-orange-500">
                    <Flame className="w-3.5 h-3.5" /> {me.currentStreak}
                  </span>
                )}
              </p>
            </div>
          ) : null}
        </div>
      </Card>
    </Link>
  );
};
