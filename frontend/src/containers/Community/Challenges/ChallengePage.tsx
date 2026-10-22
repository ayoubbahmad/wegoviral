'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CalendarDays, Check, CheckCircle2, Gift, ExternalLink, Flame, ImagePlus, Link2, Loader2, Lock, Pencil, Trash2, Trophy, Users, X } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Skeleton } from '@/components/Skeleton';
import { Textarea } from '@/components/Textarea';
import { MemberBadges } from '@/components/MemberBadges';
import { useAuth } from '@/providers/Auth';
import { useToast } from '@/providers/Toast';
import { describeLockReason } from '@/lib/access';
import { avatarFor, cn, formatRelativeDate } from '@/lib/utils';
import { ChallengeDetail, ChallengeMember } from '@/types/challenges';
import { uploadImage } from '../api';
import {
  useChallenge,
  useChallengeLeaderboard,
  useCheckIn,
  useCheckIns,
  useDeleteChallenge,
  useDeleteCheckIn,
  useJoinChallenge,
  useSetWinners,
} from './api';
import { ChallengeFormDialog } from './components/ChallengeFormDialog';
import { challengeDays, describeDates } from './utils';
import { useT } from '@/i18n/provider';
import { activeIntl } from '@/i18n/active';
import { T } from '@/i18n/T';

const MEDALS = ['🥇', '🥈', '🥉'];
const displayName = (member: { name?: string | null; username: string }) => member.name || `@${member.username}`;

export const ChallengePage = ({ challengeId }: { challengeId: string }) => {
  const t = useT();
  const { data: challenge, isPending, error } = useChallenge(challengeId);
  const [tab, setTab] = useState<'check-ins' | 'leaderboard'>('check-ins');
  const [editing, setEditing] = useState(false);

  return (
    <PageContainer>
      <Link href="/community/challenges" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4 rtl:rotate-180" /> {t('challenges.page.all')}
      </Link>
      {isPending ? (
        <Skeleton className="h-96 rounded-2xl" />
      ) : error ? (
        <p className="text-sm text-muted-foreground">{error.message}</p>
      ) : (
        <>
          <Header challenge={challenge} onEdit={() => setEditing(true)} />
          <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
            <div className="min-w-0 space-y-4">
              {challenge.winners.length > 0 && <WinnersBanner challenge={challenge} />}
              {challenge.access.locked ? <LockedCard challenge={challenge} /> : <MyProgress challenge={challenge} />}
              {!challenge.access.locked && (
                <>
                  <div role="tablist" aria-label={t('challenges.page.tabs')} className="flex gap-4 border-b border-border text-sm font-semibold">
                    {(['check-ins', 'leaderboard'] as const).map((option) => (
                      <button
                        key={option}
                        role="tab"
                        aria-selected={tab === option}
                        onClick={() => setTab(option)}
                        className={cn('-mb-px border-b-2 pb-2 transition-colors', tab === option ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground')}
                      >
                        {option === 'check-ins' ? t('challenges.page.checkIns') : t('challenges.page.leaderboard')}
                      </button>
                    ))}
                  </div>
                  {tab === 'check-ins' ? <CheckInFeed challengeId={challenge.id} /> : <Leaderboard challenge={challenge} />}
                </>
              )}
            </div>
            <aside className="space-y-4">
              <AboutCard challenge={challenge} />
              {challenge.canManage && challenge.phase === 'ended' && challenge.status === 'PUBLISHED' && <WinnersPicker challenge={challenge} />}
            </aside>
          </div>
          {editing && <ChallengeFormDialog challenge={challenge} onClose={() => setEditing(false)} onSaved={() => setEditing(false)} />}
        </>
      )}
    </PageContainer>
  );
};

const Header = ({ challenge, onEdit }: { challenge: ChallengeDetail; onEdit: () => void }) => {
  const t = useT();
  const router = useRouter();
  const { showToast } = useToast();
  const remove = useDeleteChallenge();
  return (
    <div className="space-y-4">
      {challenge.coverUrl && <img src={challenge.coverUrl} alt="" className="h-48 w-full rounded-2xl object-cover md:h-60" />}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            {challenge.status !== 'PUBLISHED' && (
              <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-bold">{challenge.status === 'DRAFT' ? t('common.draft') : t('common.cancelled')}</span>
            )}
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
              {challenge.checkInType === 'DAILY' ? t('challenges.page.dailyBadge', { count: challenge.totalDays }) : t('challenges.page.oneTimeBadge')}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{challenge.title}</h1>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4" /> {describeDates(challenge)} · {new Date(challenge.startsAt).toLocaleDateString(activeIntl())} – {new Date(challenge.endsAt).toLocaleDateString(activeIntl())}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4" /> {t('challenges.takingPart', { count: challenge.participantCount })}
            </span>
          </p>
        </div>
        {challenge.canManage && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Pencil className="w-4 h-4" /> {t('common.edit')}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:bg-red-500/10"
              disabled={remove.isPending}
              onClick={() =>
                window.confirm(t('challenges.page.deleteConfirm', { title: challenge.title })) &&
                remove.mutate(challenge.id, {
                  onSuccess: () => {
                    showToast(t('challenges.page.deleted'));
                    router.push('/community/challenges');
                  },
                  onError: (err) => showToast(err.message, 'error'),
                })
              }
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const LockedCard = ({ challenge }: { challenge: ChallengeDetail }) => {
  const t = useT();
  return (
    <Card className="space-y-1 border-amber-500/30 bg-amber-500/10 text-sm">
      <p className="flex items-center gap-2 font-semibold">
        <Lock className="w-4 h-4" /> {t('challenges.page.locked')}
      </p>
      {challenge.access.reasons.map((reason, index) => (
        <p key={index} className="text-muted-foreground">{describeLockReason(reason, t)}</p>
      ))}
    </Card>
  );
};

const WinnersBanner = ({ challenge }: { challenge: ChallengeDetail }) => (
  <Card className="space-y-3 border-amber-500/40 bg-amber-500/5">
    <p className="flex items-center gap-2 font-bold">
      <Trophy className="w-5 h-5 text-amber-500" /> <T k={challenge.winners.length === 1 ? 'challenges.page.winner' : 'challenges.page.winners'} />
    </p>
    <ul className="flex flex-wrap gap-4">
      {challenge.winners.map((winner) => (
        <li key={winner.member.id} className="flex items-center gap-2">
          <span className="text-xl">{MEDALS[winner.rank - 1] ?? `#${winner.rank}`}</span>
          <img src={avatarFor(winner.member)} alt="" className="h-8 w-8 rounded-full border border-border" />
          <span className="text-sm font-semibold">{displayName(winner.member)}</span>
        </li>
      ))}
    </ul>
  </Card>
);

const MyProgress = ({ challenge }: { challenge: ChallengeDetail }) => {
  const t = useT();
  const { user } = useAuth();
  const { showToast } = useToast();
  const join = useJoinChallenge();
  const { me } = challenge;
  const canInteract = user?.onboarding.step === 'DONE' && user.status !== 'MUTED';
  const open = challenge.status === 'PUBLISHED' && challenge.phase !== 'ended';

  if (!me) {
    return (
      <Card className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold">{open ? t('challenges.page.ready') : challenge.phase === 'ended' ? t('challenges.page.ended') : t('challenges.page.notOpen')}</p>
          <p className="text-sm text-muted-foreground">
            {challenge.checkInType === 'DAILY'
              ? challenge.requiredCheckIns === challenge.totalDays
                ? t('challenges.page.everyDay')
                : t('challenges.page.someDays', { required: challenge.requiredCheckIns, total: challenge.totalDays })
              : t('challenges.page.oneSubmission')}
          </p>
        </div>
        {open && canInteract && (
          <Button
            variant="primary"
            disabled={join.isPending}
            onClick={() => join.mutate({ id: challenge.id, join: true }, { onSuccess: () => showToast(t('challenges.page.youreIn')), onError: (err) => showToast(err.message, 'error') })}
          >
            {join.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : t('challenges.page.join')}
          </Button>
        )}
      </Card>
    );
  }

  const percent = Math.min(100, Math.round((me.checkInCount / challenge.requiredCheckIns) * 100));
  return (
    <Card className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold">
            {me.winnerRank ? t('challenges.page.wonTitle', { rank: me.winnerRank }) : me.completedAt ? t('challenges.page.finishedTitle') : t('challenges.page.progressTitle')}
          </p>
          <p className="text-sm text-muted-foreground">
            {t('challenges.page.progressLine', { done: me.checkInCount, total: challenge.requiredCheckIns })}
            {challenge.checkInType === 'DAILY' && t('challenges.page.bestStreak', { count: me.bestStreak })}
          </p>
        </div>
        {challenge.checkInType === 'DAILY' && (
          <div className={cn('flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold', me.currentStreak > 0 ? 'bg-orange-500/10 text-orange-500' : 'bg-secondary text-muted-foreground')}>
            <Flame className="w-4 h-4" /> {t('challenges.page.streak', { count: me.currentStreak })}
          </div>
        )}
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div className={cn('h-full rounded-full transition-all', me.completedAt ? 'bg-emerald-500' : 'bg-primary')} style={{ width: `${percent}%` }} />
      </div>
      {challenge.checkInType === 'DAILY' && <DayGrid challenge={challenge} />}
      {open && challenge.phase === 'active' && canInteract && !me.checkedInToday && <CheckInComposer challenge={challenge} />}
      {me.checkedInToday && challenge.phase === 'active' && (
        <p className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="w-4 h-4" /> {challenge.checkInType === 'DAILY' ? t('challenges.page.checkedInToday') : t('challenges.page.submitted')}
        </p>
      )}
      {challenge.phase === 'upcoming' && <p className="text-sm text-muted-foreground">{t('challenges.page.opensAtStart')}</p>}
    </Card>
  );
};

/** One square per day: done, missed, today, or still to come. */
const DayGrid = ({ challenge }: { challenge: ChallengeDetail }) => {
  const t = useT();
  const done = new Set(challenge.myDays);
  const days = challengeDays(challenge.startDay, challenge.totalDays);
  return (
    <div className="flex flex-wrap gap-1.5" aria-label={t('challenges.page.dayGrid')}>
      {days.map((day, index) => {
        const isDone = done.has(day);
        const isToday = day === challenge.today;
        const isPast = day < challenge.today;
        return (
          <span
            key={day}
            title={`${t('challenges.page.dayTitle', { number: index + 1, date: new Date(`${day}T12:00:00Z`).toLocaleDateString(activeIntl(), { month: 'short', day: 'numeric' }) })}${isDone ? t('challenges.page.dayChecked') : ''}`}
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-md text-[10px] font-bold',
              isDone ? 'bg-emerald-500 text-white' : isPast ? 'bg-muted text-muted-foreground/60' : 'border border-border text-muted-foreground',
              isToday && 'ring-2 ring-primary ring-offset-1 ring-offset-background',
            )}
          >
            {index + 1}
          </span>
        );
      })}
    </div>
  );
};

const CheckInComposer = ({ challenge }: { challenge: ChallengeDetail }) => {
  const t = useT();
  const { showToast } = useToast();
  const checkIn = useCheckIn();
  const [content, setContent] = useState('');
  const [link, setLink] = useState('');
  const [showLink, setShowLink] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setUploading(true);
    try {
      setImageUrl(await uploadImage(file));
    } catch (error) {
      showToast(error instanceof Error ? error.message : t('challenges.page.imageFailed'), 'error');
    } finally {
      setUploading(false);
    }
  };

  const submit = () =>
    checkIn.mutate(
      { id: challenge.id, input: { content: content.trim(), imageUrl, link: link.trim() || null } },
      {
        onSuccess: (updated) =>
          showToast(
            updated.me?.completedAt && !challenge.me?.completedAt
              ? t('challenges.page.finishedToast')
              : updated.me && updated.me.currentStreak > 1
                ? t('challenges.page.streakToast', { count: updated.me.currentStreak })
                : t('challenges.page.checkedInToast'),
          ),
        onError: (error) => showToast(error.message, 'error'),
      },
    );

  return (
    <div className="space-y-2 rounded-xl border border-border p-3">
      <Textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder={challenge.checkInType === 'DAILY' ? t('challenges.page.dailyPlaceholder') : t('challenges.page.oncePlaceholder')}
        maxLength={2000}
        className="min-h-[80px]"
      />
      {imageUrl && (
        <div className="relative w-fit">
          <img src={imageUrl} alt="" className="h-24 rounded-lg object-cover" />
          <button aria-label={t('challenges.page.removeImage')} onClick={() => setImageUrl(null)} className="absolute end-1 top-1 rounded bg-background/90 p-1">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      {showLink && <input value={link} onChange={(event) => setLink(event.target.value)} placeholder="https://…" className="w-full h-9 rounded-lg border border-border bg-background px-3 text-sm" />}
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-1">
          <label className="cursor-pointer rounded-lg p-2 text-muted-foreground hover:bg-secondary/50 hover:text-foreground" aria-label={t('challenges.page.addImage')}>
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
            <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleImage} className="hidden" />
          </label>
          <button aria-label={t('challenges.page.addLink')} onClick={() => setShowLink((open) => !open)} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary/50 hover:text-foreground">
            <Link2 className="w-4 h-4" />
          </button>
        </div>
        <Button variant="primary" size="sm" disabled={!content.trim() || checkIn.isPending || uploading} onClick={submit}>
          {checkIn.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : challenge.checkInType === 'DAILY' ? t('challenges.page.checkIn') : t('challenges.page.submit')}
        </Button>
      </div>
    </div>
  );
};

const AboutCard = ({ challenge }: { challenge: ChallengeDetail }) => {
  const t = useT();
  const and = (badge: ChallengeDetail['completionBadge']) => (badge ? t('challenges.page.and', { badge: `${badge.emoji} ${badge.name}` }) : '');
  return (
  <Card className="space-y-4 text-sm">
    {challenge.description && <p>{challenge.description}</p>}
    {challenge.rules && (
      <div className="space-y-1">
        <p className="font-bold">{t('challenges.page.rules')}</p>
        <p className="whitespace-pre-wrap text-muted-foreground">{challenge.rules}</p>
      </div>
    )}
    {challenge.prizes && (
      <div className="space-y-1">
        <p className="flex items-center gap-1.5 font-bold">
          <Gift className="h-4 w-4 text-amber-500" aria-hidden /> {t('challenges.page.prizes')}
        </p>
        <p className="text-muted-foreground">{challenge.prizes}</p>
      </div>
    )}
    <div className="space-y-1">
      <p className="font-bold">{t('challenges.page.rewards')}</p>
      <ul className="space-y-0.5 text-muted-foreground">
        <li>{t('challenges.page.rewardCheckIn')}</li>
        <li>{t('challenges.page.rewardFinish', { extra: and(challenge.completionBadge) })}</li>
        <li>{t('challenges.page.rewardWin', { extra: and(challenge.winnerBadge) })}</li>
      </ul>
    </div>
    <p className="text-xs text-muted-foreground">
      {t('challenges.page.footer', { zone: challenge.timezone.replace('_', ' '), name: displayName(challenge.createdBy) })}
    </p>
  </Card>
  );
};

const CheckInFeed = ({ challengeId }: { challengeId: string }) => {
  const t = useT();
  const { showToast } = useToast();
  const { data, isPending, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useCheckIns(challengeId, true);
  const remove = useDeleteCheckIn();
  const checkIns = data?.pages.flatMap((page) => page.checkIns) ?? [];

  if (isPending) return <Skeleton className="h-40 rounded-2xl" />;
  if (error) return <p className="text-sm text-muted-foreground">{error.message}</p>;
  if (checkIns.length === 0) return <p className="py-6 text-center text-sm text-muted-foreground">{t('challenges.page.noCheckIns')}</p>;

  return (
    <div className="space-y-3">
      {checkIns.map((checkIn) => (
        <Card key={checkIn.id} padding="sm" className="space-y-2">
          <div className="flex items-center gap-2">
            <img src={avatarFor(checkIn.author)} alt="" className="h-8 w-8 rounded-full border border-border" />
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 text-sm font-semibold">
                <span className="truncate">{displayName(checkIn.author)}</span>
                <MemberBadges badges={checkIn.author.badges} />
              </p>
              <p className="text-xs text-muted-foreground">{formatRelativeDate(checkIn.createdAt)}</p>
            </div>
            {checkIn.canDelete && (
              <button
                aria-label={t('challenges.page.removeCheckIn')}
                disabled={remove.isPending}
                onClick={() =>
                  window.confirm(t('challenges.page.removeConfirm')) &&
                  remove.mutate({ id: challengeId, checkInId: checkIn.id }, { onSuccess: () => showToast(t('challenges.page.removed')), onError: (err) => showToast(err.message, 'error') })
                }
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          <p className="whitespace-pre-wrap text-sm">{checkIn.content}</p>
          {checkIn.imageUrl && <img src={checkIn.imageUrl} alt="" className="max-h-80 rounded-xl border border-border object-cover" />}
          {checkIn.link && (
            <a href={checkIn.link} target="_blank" rel="noreferrer" className="inline-flex max-w-full items-center gap-1.5 text-sm text-primary hover:underline">
              <ExternalLink className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{checkIn.link}</span>
            </a>
          )}
        </Card>
      ))}
      {hasNextPage && (
        <Button variant="ghost" size="sm" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? <Loader2 className="w-4 h-4 animate-spin" /> : t('common.loadMore')}
        </Button>
      )}
    </div>
  );
};

const Leaderboard = ({ challenge }: { challenge: ChallengeDetail }) => {
  const t = useT();
  const { data, isPending, error } = useChallengeLeaderboard(challenge.id, true);
  if (isPending) return <Skeleton className="h-40 rounded-2xl" />;
  if (error) return <p className="text-sm text-muted-foreground">{error.message}</p>;
  if (data.entries.length === 0) return <p className="py-6 text-center text-sm text-muted-foreground">{t('challenges.page.nobodyJoined')}</p>;
  return (
    <Card padding="none">
      <ol className="divide-y divide-border/50">
        {data.entries.map((entry) => (
          <li key={entry.member.id} className={cn('flex items-center gap-3 px-5 py-3', entry.member.id === data.me?.member.id && 'bg-primary/5')}>
            <span className="w-7 shrink-0 text-center text-sm font-bold text-muted-foreground">{MEDALS[entry.rank - 1] ?? entry.rank}</span>
            <img src={avatarFor(entry.member)} alt="" className="h-9 w-9 shrink-0 rounded-full border border-border" />
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 text-sm font-medium">
                <span className="truncate">{displayName(entry.member)}</span>
                <MemberBadges badges={entry.member.badges} />
                {entry.winnerRank && <Trophy className="w-3.5 h-3.5 shrink-0 text-amber-500" aria-label={t('challenges.page.winnerLabel')} />}
              </p>
              <p className="text-xs text-muted-foreground">
                {entry.completed ? t('challenges.page.finishedRow') : `${entry.checkInCount} / ${data.required}`}
                {challenge.checkInType === 'DAILY' && t('challenges.page.bestStreak', { count: entry.bestStreak })}
              </p>
            </div>
            {challenge.checkInType === 'DAILY' && entry.currentStreak > 1 && (
              <span className="flex shrink-0 items-center gap-0.5 text-sm font-semibold text-orange-500">
                <Flame className="w-4 h-4" /> {entry.currentStreak}
              </span>
            )}
            <span className="flex w-16 shrink-0 items-center justify-end gap-1 text-sm font-bold">{entry.checkInCount} <Check className="h-3.5 w-3.5 text-emerald-500" aria-hidden /></span>
          </li>
        ))}
      </ol>
    </Card>
  );
};

/** For the team, once the challenge has ended: take the top of the board, or pick by hand. */
const WinnersPicker = ({ challenge }: { challenge: ChallengeDetail }) => {
  const t = useT();
  const { showToast } = useToast();
  const { data } = useChallengeLeaderboard(challenge.id, true);
  const setWinners = useSetWinners();
  const [count, setCount] = useState('3');
  const [picked, setPicked] = useState<string[]>([]);
  const candidates = (data?.entries ?? []).filter((entry) => entry.checkInCount > 0).slice(0, 20);
  const done = (message: string) => ({ onSuccess: () => showToast(message), onError: (err: Error) => showToast(err.message, 'error') });
  const toggle = (member: ChallengeMember) =>
    setPicked((current) => (current.includes(member.id) ? current.filter((id) => id !== member.id) : [...current, member.id]));

  return (
    <Card className="space-y-4">
      <div>
        <h2 className="font-bold">{challenge.winnersPickedAt ? t('challenges.page.changeTitle') : t('challenges.page.pickTitle')}</h2>
        <p className="text-sm text-muted-foreground">{t('challenges.page.pickBody')}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm">{t('challenges.page.top')}</span>
        <input type="number" min={1} max={20} value={count} onChange={(e) => setCount(e.target.value)} aria-label={t('challenges.page.howMany')} className="h-9 w-16 rounded-lg border border-border bg-background px-2 text-sm" />
        <Button
          variant="outline"
          size="sm"
          disabled={setWinners.isPending || !Number(count)}
          onClick={() => setWinners.mutate({ id: challenge.id, input: { mode: 'top', count: Number(count) } }, done(t('challenges.page.picked')))}
        >
          {t('challenges.page.takeTop')}
        </Button>
      </div>
      {candidates.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground">{t('challenges.page.byHand')}</p>
          <ul className="max-h-64 space-y-1 overflow-y-auto">
            {candidates.map((entry) => {
              const position = picked.indexOf(entry.member.id);
              return (
                <li key={entry.member.id}>
                  <button
                    onClick={() => toggle(entry.member)}
                    className={cn('flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-start text-sm', position >= 0 ? 'bg-primary/10' : 'hover:bg-secondary/40')}
                  >
                    <span className="w-6 text-center text-xs font-bold">{position >= 0 ? MEDALS[position] ?? `#${position + 1}` : ''}</span>
                    <span className="min-w-0 flex-1 truncate">{displayName(entry.member)}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">{entry.checkInCount} <Check className="h-3 w-3" aria-hidden /></span>
                  </button>
                </li>
              );
            })}
          </ul>
          <Button
            variant="primary"
            size="sm"
            disabled={!picked.length || setWinners.isPending}
            onClick={() => setWinners.mutate({ id: challenge.id, input: { mode: 'manual', userIds: picked } }, done(t('challenges.page.saved')))}
          >
            {picked.length ? t('challenges.page.save', { count: picked.length }) : t('challenges.page.saveNone')}
          </Button>
        </div>
      )}
      {challenge.winnersPickedAt && (
        <Button
          variant="ghost"
          size="sm"
          disabled={setWinners.isPending}
          onClick={() => window.confirm(t('challenges.page.clearConfirm')) && setWinners.mutate({ id: challenge.id, input: { mode: 'clear' } }, done(t('challenges.page.cleared')))}
        >
          {t('challenges.page.clear')}
        </Button>
      )}
    </Card>
  );
};
