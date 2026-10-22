'use client';

import { useState } from 'react';
import { Check, Flag, Loader2, RotateCcw, ShieldAlert, Trash2 } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Select } from '@/components/Select';
import { Skeleton } from '@/components/Skeleton';
import { EmptyState } from '@/components/EmptyState';
import { Textarea } from '@/components/Textarea';
import { useCan } from '@/providers/Auth';
import { useToast } from '@/providers/Toast';
import { avatarFor, cn, formatRelativeDate } from '@/lib/utils';
import { REPORT_REASONS } from '@/types/communityFeed';
import {
  useDeleteComment,
  useDeletedContent,
  useHeldContent,
  useReleaseComment,
  useReports,
  useResolveReports,
  useRestoreContent,
  useReviewHeldPost,
} from '../api/moderation';
import { useCommunitySettings, useUpdateSettings } from '../api/joining';
import { ModAuthor, ReportGroup, ReportStatus, ResolveReportsInput } from '../types';
import { useT } from '@/i18n/provider';
import { activeIntl } from '@/i18n/active';

type Tab = 'reports' | 'held' | 'deleted' | 'filter';

const reasonLabel = (reason: string, t: ReturnType<typeof useT>) =>
  REPORT_REASONS.some((r) => r.value === reason) ? t(`feed.reportReasons.${reason as 'SPAM'}`) : reason;

const TabButton = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    role="tab"
    aria-selected={active}
    onClick={onClick}
    className={cn(
      'rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors',
      active ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:text-foreground',
    )}
  >
    {children}
  </button>
);

const AuthorLine = ({ author, when }: { author: ModAuthor; when: string }) => (
  <div className="flex items-center gap-2 text-xs text-muted-foreground">
    <img src={avatarFor(author)} alt="" className="w-6 h-6 rounded-full border border-border" />
    <span className="font-semibold text-foreground">@{author.username}</span>
    <span>· {formatRelativeDate(when)}</span>
  </div>
);

export const AdminModerationContainer = () => {
  const t = useT();
  const can = useCan();
  const [tab, setTab] = useState<Tab>('reports');

  return (
    <PageContainer>
      <PageHeader
        helpHref="/admin/help/handling-reports" title={t('admin.moderation.title')} description={t('admin.moderation.description')} />
      <div className="flex flex-wrap gap-2" role="tablist" aria-label={t('admin.moderation.tabsLabel')}>
        <TabButton active={tab === 'reports'} onClick={() => setTab('reports')}>{t('admin.moderation.tabs.reports')}</TabButton>
        <TabButton active={tab === 'held'} onClick={() => setTab('held')}>{t('admin.moderation.tabs.held')}</TabButton>
        <TabButton active={tab === 'deleted'} onClick={() => setTab('deleted')}>{t('admin.moderation.tabs.deleted')}</TabButton>
        {can('community.settings') && (
          <TabButton active={tab === 'filter'} onClick={() => setTab('filter')}>{t('admin.moderation.tabs.filter')}</TabButton>
        )}
      </div>
      {tab === 'reports' && <ReportsTab />}
      {tab === 'held' && <HeldTab />}
      {tab === 'deleted' && <DeletedTab />}
      {tab === 'filter' && <FilterTab />}
    </PageContainer>
  );
};

// ─── Reports ─────────────────────────────────────────────────────────────────

const ReportsTab = () => {
  const t = useT();
  const [status, setStatus] = useState<ReportStatus>('OPEN');
  const { data, isPending, error } = useReports(status);

  return (
    <div className="space-y-4">
      <div className="w-48">
        <Select
          aria-label={t('admin.moderation.statusLabel')}
          value={status}
          onChange={(event) => setStatus(event.target.value as ReportStatus)}
          options={[
            { value: 'OPEN', label: t('admin.moderation.statuses.OPEN') },
            { value: 'RESOLVED', label: t('admin.moderation.statuses.RESOLVED') },
            { value: 'DISMISSED', label: t('admin.moderation.statuses.DISMISSED') },
          ]}
        />
      </div>
      {isPending ? (
        <Skeleton className="h-40 rounded-2xl" />
      ) : error ? (
        <p className="text-sm text-muted-foreground">{error.message}</p>
      ) : data.length === 0 ? (
        <EmptyState icon={Flag} title={status === 'OPEN' ? t('admin.moderation.noOpen') : t('admin.moderation.nothing')} description={status === 'OPEN' ? t('admin.moderation.reportsShow') : undefined} />
      ) : (
        data.map((group) => <ReportCard key={`${group.targetType}:${group.targetId}`} group={group} isOpen={status === 'OPEN'} />)
      )}
    </div>
  );
};

const ReportCard = ({ group, isOpen }: { group: ReportGroup; isOpen: boolean }) => {
  const t = useT();
  const { showToast } = useToast();
  const can = useCan();
  const resolve = useResolveReports();
  const [removing, setRemoving] = useState(false);
  const [authorAction, setAuthorAction] = useState<'none' | 'warn' | 'mute' | 'suspend'>('none');
  const [reason, setReason] = useState('');
  const [days, setDays] = useState('3');
  const content = group.post ?? group.comment;
  const maxDays = can('members.ban') ? null : 7;

  const submit = (action: 'dismiss' | 'remove') => {
    const input: ResolveReportsInput = { targetType: group.targetType, targetId: group.targetId, action };
    if (action === 'remove' && authorAction !== 'none') {
      input.authorAction = {
        type: authorAction,
        reason: reason.trim(),
        durationDays: authorAction === 'warn' ? undefined : days === 'indefinite' ? null : Number(days),
      };
    }
    resolve.mutate(input, {
      onSuccess: (result) => showToast(action === 'dismiss' ? t('admin.moderation.dismissed') : t('admin.moderation.done', { resolution: result.resolution ?? '' })),
      onError: (error) => showToast(error.message, 'error'),
    });
  };

  const reasonCounts = group.reports.reduce<Record<string, number>>((counts, report) => {
    counts[report.reason] = (counts[report.reason] ?? 0) + 1;
    return counts;
  }, {});

  return (
    <Card className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-bold text-red-500">
          {t('admin.moderation.reports', { count: group.reports.length })}
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t(`admin.moderation.types.${group.targetType}`)}</span>
        {Object.entries(reasonCounts).map(([reasonKey, count]) => (
          <span key={reasonKey} className="rounded-full bg-secondary/60 px-2.5 py-0.5 text-xs">
            {reasonLabel(reasonKey, t)}{count > 1 ? ` ×${count}` : ''}
          </span>
        ))}
        {content?.deletedAt && <span className="text-xs text-muted-foreground">{t('admin.moderation.alreadyDeleted')}</span>}
      </div>

      {content && (
        <div className="space-y-2 rounded-xl border border-border bg-secondary/10 p-4">
          <AuthorLine author={content.author} when={content.createdAt} />
          {group.post?.title && <p className="font-bold">{group.post.title}</p>}
          <p className="text-sm whitespace-pre-wrap break-words line-clamp-6">{content.content}</p>
        </div>
      )}

      <ul className="space-y-1 text-xs text-muted-foreground">
        {group.reports.map((report) => (
          <li key={report.id}>
            <span className="font-semibold text-foreground">@{report.reporter.username}</span>: {reasonLabel(report.reason, t)}
            {report.note && <> — “{report.note}”</>}
          </li>
        ))}
      </ul>

      {!isOpen ? (
        <p className="text-xs text-muted-foreground">
          {group.resolution}
          {group.resolvedBy && t('admin.moderation.resolvedBy', { username: group.resolvedBy.username })}
          {group.resolvedAt && ` · ${new Date(group.resolvedAt).toLocaleDateString(activeIntl())}`}
        </p>
      ) : removing ? (
        <div className="space-y-3 rounded-xl border border-border p-4">
          <p className="text-sm font-semibold">{t(`admin.moderation.removeThis.${group.targetType}`)}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <Select
              aria-label={t('admin.moderation.also')}
              value={authorAction}
              onChange={(event) => setAuthorAction(event.target.value as typeof authorAction)}
              options={[
                { value: 'none', label: t('admin.moderation.onlyRemove') },
                { value: 'warn', label: t('admin.moderation.removeWarn') },
                { value: 'mute', label: t('admin.moderation.removeMute') },
                { value: 'suspend', label: t('admin.moderation.removeSuspend') },
              ]}
            />
            {(authorAction === 'mute' || authorAction === 'suspend') && (
              <Select
                aria-label={t('admin.moderation.howLong')}
                value={days}
                onChange={(event) => setDays(event.target.value)}
                options={[
                  ...[1, 3, 7, 30, 90]
                    .filter((value) => maxDays === null || value <= maxDays)
                    .map((value) => ({ value: String(value), label: t('admin.panel.days', { count: value }) })),
                  ...(maxDays === null ? [{ value: 'indefinite', label: t('admin.panel.untilLiftedOption') }] : []),
                ]}
              />
            )}
          </div>
          {authorAction !== 'none' && (
            <Textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder={t('admin.moderation.authorMessage')}
              maxLength={500}
              className="min-h-[70px]"
            />
          )}
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setRemoving(false)}>{t('common.cancel')}</Button>
            <Button
              variant="primary"
              size="sm"
              disabled={resolve.isPending || (authorAction !== 'none' && reason.trim().length < 3)}
              onClick={() => submit('remove')}
            >
              {resolve.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : t('admin.moderation.confirm')}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => submit('dismiss')} disabled={resolve.isPending}>
            <Check className="w-4 h-4" /> {t('admin.moderation.nothingWrong')}
          </Button>
          <Button variant="primary" size="sm" onClick={() => setRemoving(true)}>
            <Trash2 className="w-4 h-4" /> {t('admin.moderation.remove')}
          </Button>
        </div>
      )}
    </Card>
  );
};

// ─── Held by the filter ──────────────────────────────────────────────────────

const HeldTab = () => {
  const t = useT();
  const { showToast } = useToast();
  const { data, isPending, error } = useHeldContent();
  const reviewPost = useReviewHeldPost();
  const releaseComment = useReleaseComment();
  const deleteComment = useDeleteComment();
  const onError = (err: Error) => showToast(err.message, 'error');

  if (isPending) return <Skeleton className="h-40 rounded-2xl" />;
  if (error) return <p className="text-sm text-muted-foreground">{error.message}</p>;
  if (!data.posts.length && !data.comments.length) {
    return <EmptyState icon={ShieldAlert} title={t('admin.moderation.nothingHeld')} description={t('admin.moderation.heldBody')} />;
  }

  return (
    <div className="space-y-3">
      {data.posts.map((post) => (
        <Card key={post.id} className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <AuthorLine author={post.author} when={post.createdAt} />
            <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600">{t('admin.moderation.types.post')} · {post.heldReason}</span>
          </div>
          {post.title && <p className="font-bold">{post.title}</p>}
          <p className="text-sm whitespace-pre-wrap break-words line-clamp-6">{post.content}</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => reviewPost.mutate({ id: post.id, decision: 'reject' }, { onSuccess: () => showToast(t('admin.moderation.postRejected')), onError })}>
              {t('admin.moderation.dontPublish')}
            </Button>
            <Button variant="primary" size="sm" onClick={() => reviewPost.mutate({ id: post.id, decision: 'approve' }, { onSuccess: () => showToast(t('admin.moderation.postPublished')), onError })}>
              {t('admin.moderation.publish')}
            </Button>
          </div>
        </Card>
      ))}
      {data.comments.map((comment) => (
        <Card key={comment.id} className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <AuthorLine author={comment.author} when={comment.createdAt} />
            <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600">{t('admin.moderation.types.comment')} · {comment.heldReason}</span>
          </div>
          <p className="text-sm whitespace-pre-wrap break-words">{comment.content}</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => deleteComment.mutate(comment.id, { onSuccess: () => showToast(t('admin.moderation.commentRemoved')), onError })}>
              {t('admin.moderation.removeButton')}
            </Button>
            <Button variant="primary" size="sm" onClick={() => releaseComment.mutate(comment.id, { onSuccess: () => showToast(t('admin.moderation.commentReleased')), onError })}>
              {t('admin.moderation.release')}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

// ─── Recently deleted ────────────────────────────────────────────────────────

const DeletedTab = () => {
  const t = useT();
  const { showToast } = useToast();
  const { data, isPending, error } = useDeletedContent();
  const restore = useRestoreContent();

  if (isPending) return <Skeleton className="h-40 rounded-2xl" />;
  if (error) return <p className="text-sm text-muted-foreground">{error.message}</p>;

  const items = [
    ...data.posts.map((post) => ({ type: 'post' as const, id: post.id, text: post.title || post.content, author: post.author, deletedAt: post.deletedAt, deletedBy: post.deletedBy })),
    ...data.comments.map((comment) => ({ type: 'comment' as const, id: comment.id, text: comment.content, author: comment.author, deletedAt: comment.deletedAt, deletedBy: comment.deletedBy })),
  ].sort((a, b) => new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime());

  if (!items.length) return <EmptyState icon={Trash2} title={t('admin.moderation.nothingDeleted')} description={t('admin.moderation.restoreWindow', { count: data.windowDays })} />;

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">Restorable for {data.windowDays} days after deletion.</p>
      {items.map((item) => (
        <Card key={`${item.type}:${item.id}`} padding="sm" className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-sm truncate">
              <span className="me-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t(`admin.moderation.types.${item.type}`)}</span>
              {item.text}
            </p>
            <p className="text-xs text-muted-foreground">
              {t('admin.moderation.deletedBy', { author: item.author.username, when: formatRelativeDate(item.deletedAt) })}
              {item.deletedBy && (item.deletedBy.id === item.author.id ? t('admin.moderation.byAuthor') : t('admin.moderation.byUser', { username: item.deletedBy.username }))}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={restore.isPending}
            onClick={() =>
              restore.mutate(
                { targetType: item.type, id: item.id },
                { onSuccess: () => showToast(t(`admin.moderation.restored.${item.type}`)), onError: (err) => showToast(err.message, 'error') },
              )
            }
          >
            <RotateCcw className="w-3.5 h-3.5" /> {t('admin.moderation.restore')}
          </Button>
        </Card>
      ))}
    </div>
  );
};

// ─── Word filter ─────────────────────────────────────────────────────────────

const FilterTab = () => {
  const { data: settings, isPending } = useCommunitySettings();
  if (isPending || !settings) return <Skeleton className="h-40 rounded-2xl" />;
  return <FilterEditor key={settings.flaggedWords.join('|')} words={settings.flaggedWords} />;
};

const FilterEditor = ({ words }: { words: string[] }) => {
  const t = useT();
  const { showToast } = useToast();
  const update = useUpdateSettings();
  const [draft, setDraft] = useState(words.join('\n'));
  const parsed = [...new Set(draft.split('\n').map((word) => word.trim().toLowerCase()).filter(Boolean))];
  const unchanged = parsed.join('|') === words.join('|');

  return (
    <Card className="space-y-4">
      <div>
        <h2 className="font-bold">{t('admin.moderation.flaggedTitle')}</h2>
        <p className="text-sm text-muted-foreground">{t('admin.moderation.flaggedBody')}</p>
      </div>
      <Textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={'scam\nbuy followers'} className="min-h-[200px] font-mono text-sm" />
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{t('admin.moderation.words', { count: parsed.length })}</span>
        <Button
          variant="primary"
          disabled={unchanged || update.isPending}
          onClick={() =>
            update.mutate(
              { flaggedWords: parsed },
              { onSuccess: () => showToast(t('admin.moderation.filterSaved')), onError: (error) => showToast(error.message, 'error') },
            )
          }
        >
          {update.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : t('common.save')}
        </Button>
      </div>
    </Card>
  );
};
