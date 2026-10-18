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

type Tab = 'reports' | 'held' | 'deleted' | 'filter';

const reasonLabel = (reason: string) => REPORT_REASONS.find((r) => r.value === reason)?.label ?? reason;

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
  const can = useCan();
  const [tab, setTab] = useState<Tab>('reports');

  return (
    <PageContainer>
      <PageHeader title="Moderation" description="Reports from members, content held by the word filter, and recently deleted content." />
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Moderation">
        <TabButton active={tab === 'reports'} onClick={() => setTab('reports')}>Reports</TabButton>
        <TabButton active={tab === 'held'} onClick={() => setTab('held')}>Held by filter</TabButton>
        <TabButton active={tab === 'deleted'} onClick={() => setTab('deleted')}>Recently deleted</TabButton>
        {can('community.settings') && (
          <TabButton active={tab === 'filter'} onClick={() => setTab('filter')}>Word filter</TabButton>
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
  const [status, setStatus] = useState<ReportStatus>('OPEN');
  const { data, isPending, error } = useReports(status);

  return (
    <div className="space-y-4">
      <div className="w-48">
        <Select
          aria-label="Report status"
          value={status}
          onChange={(event) => setStatus(event.target.value as ReportStatus)}
          options={[
            { value: 'OPEN', label: 'Open' },
            { value: 'RESOLVED', label: 'Action taken' },
            { value: 'DISMISSED', label: 'Dismissed' },
          ]}
        />
      </div>
      {isPending ? (
        <Skeleton className="h-40 rounded-2xl" />
      ) : error ? (
        <p className="text-sm text-muted-foreground">{error.message}</p>
      ) : data.length === 0 ? (
        <EmptyState icon={Flag} title={status === 'OPEN' ? 'No open reports' : 'Nothing here'} description={status === 'OPEN' ? 'Reports from members show up here.' : undefined} />
      ) : (
        data.map((group) => <ReportCard key={`${group.targetType}:${group.targetId}`} group={group} isOpen={status === 'OPEN'} />)
      )}
    </div>
  );
};

const ReportCard = ({ group, isOpen }: { group: ReportGroup; isOpen: boolean }) => {
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
      onSuccess: (result) => showToast(action === 'dismiss' ? 'Reports dismissed' : `Done: ${result.resolution}`),
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
          {group.reports.length} report{group.reports.length === 1 ? '' : 's'}
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{group.targetType}</span>
        {Object.entries(reasonCounts).map(([reasonKey, count]) => (
          <span key={reasonKey} className="rounded-full bg-secondary/60 px-2.5 py-0.5 text-xs">
            {reasonLabel(reasonKey)}{count > 1 ? ` ×${count}` : ''}
          </span>
        ))}
        {content?.deletedAt && <span className="text-xs text-muted-foreground">(already deleted)</span>}
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
            <span className="font-semibold text-foreground">@{report.reporter.username}</span>: {reasonLabel(report.reason)}
            {report.note && <> — “{report.note}”</>}
          </li>
        ))}
      </ul>

      {!isOpen ? (
        <p className="text-xs text-muted-foreground">
          {group.resolution}
          {group.resolvedBy && ` · by @${group.resolvedBy.username}`}
          {group.resolvedAt && ` · ${new Date(group.resolvedAt).toLocaleDateString()}`}
        </p>
      ) : removing ? (
        <div className="space-y-3 rounded-xl border border-border p-4">
          <p className="text-sm font-semibold">Remove this {group.targetType}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <Select
              aria-label="Also"
              value={authorAction}
              onChange={(event) => setAuthorAction(event.target.value as typeof authorAction)}
              options={[
                { value: 'none', label: 'Only remove it' },
                { value: 'warn', label: 'Remove and warn the author' },
                { value: 'mute', label: 'Remove and mute the author' },
                { value: 'suspend', label: 'Remove and suspend the author' },
              ]}
            />
            {(authorAction === 'mute' || authorAction === 'suspend') && (
              <Select
                aria-label="For how long"
                value={days}
                onChange={(event) => setDays(event.target.value)}
                options={[
                  ...[1, 3, 7, 30, 90]
                    .filter((value) => maxDays === null || value <= maxDays)
                    .map((value) => ({ value: String(value), label: `${value} day${value === 1 ? '' : 's'}` })),
                  ...(maxDays === null ? [{ value: 'indefinite', label: 'Until lifted' }] : []),
                ]}
              />
            )}
          </div>
          {authorAction !== 'none' && (
            <Textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Message for the author (they'll see it)"
              maxLength={500}
              className="min-h-[70px]"
            />
          )}
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setRemoving(false)}>Cancel</Button>
            <Button
              variant="primary"
              size="sm"
              disabled={resolve.isPending || (authorAction !== 'none' && reason.trim().length < 3)}
              onClick={() => submit('remove')}
            >
              {resolve.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => submit('dismiss')} disabled={resolve.isPending}>
            <Check className="w-4 h-4" /> Nothing wrong
          </Button>
          <Button variant="primary" size="sm" onClick={() => setRemoving(true)}>
            <Trash2 className="w-4 h-4" /> Remove…
          </Button>
        </div>
      )}
    </Card>
  );
};

// ─── Held by the filter ──────────────────────────────────────────────────────

const HeldTab = () => {
  const { showToast } = useToast();
  const { data, isPending, error } = useHeldContent();
  const reviewPost = useReviewHeldPost();
  const releaseComment = useReleaseComment();
  const deleteComment = useDeleteComment();
  const onError = (err: Error) => showToast(err.message, 'error');

  if (isPending) return <Skeleton className="h-40 rounded-2xl" />;
  if (error) return <p className="text-sm text-muted-foreground">{error.message}</p>;
  if (!data.posts.length && !data.comments.length) {
    return <EmptyState icon={ShieldAlert} title="Nothing held" description="Posts and comments that match the word filter wait here." />;
  }

  return (
    <div className="space-y-3">
      {data.posts.map((post) => (
        <Card key={post.id} className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <AuthorLine author={post.author} when={post.createdAt} />
            <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600">Post · {post.heldReason}</span>
          </div>
          {post.title && <p className="font-bold">{post.title}</p>}
          <p className="text-sm whitespace-pre-wrap break-words line-clamp-6">{post.content}</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => reviewPost.mutate({ id: post.id, decision: 'reject' }, { onSuccess: () => showToast('Post not published'), onError })}>
              Don&apos;t publish
            </Button>
            <Button variant="primary" size="sm" onClick={() => reviewPost.mutate({ id: post.id, decision: 'approve' }, { onSuccess: () => showToast('Post published'), onError })}>
              Publish
            </Button>
          </div>
        </Card>
      ))}
      {data.comments.map((comment) => (
        <Card key={comment.id} className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <AuthorLine author={comment.author} when={comment.createdAt} />
            <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600">Comment · {comment.heldReason}</span>
          </div>
          <p className="text-sm whitespace-pre-wrap break-words">{comment.content}</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => deleteComment.mutate(comment.id, { onSuccess: () => showToast('Comment removed'), onError })}>
              Remove
            </Button>
            <Button variant="primary" size="sm" onClick={() => releaseComment.mutate(comment.id, { onSuccess: () => showToast('Comment released'), onError })}>
              Release
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

// ─── Recently deleted ────────────────────────────────────────────────────────

const DeletedTab = () => {
  const { showToast } = useToast();
  const { data, isPending, error } = useDeletedContent();
  const restore = useRestoreContent();

  if (isPending) return <Skeleton className="h-40 rounded-2xl" />;
  if (error) return <p className="text-sm text-muted-foreground">{error.message}</p>;

  const items = [
    ...data.posts.map((post) => ({ type: 'post' as const, id: post.id, text: post.title || post.content, author: post.author, deletedAt: post.deletedAt, deletedBy: post.deletedBy })),
    ...data.comments.map((comment) => ({ type: 'comment' as const, id: comment.id, text: comment.content, author: comment.author, deletedAt: comment.deletedAt, deletedBy: comment.deletedBy })),
  ].sort((a, b) => new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime());

  if (!items.length) return <EmptyState icon={Trash2} title="Nothing deleted recently" description={`Deleted posts and comments can be restored for ${data.windowDays} days.`} />;

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">Restorable for {data.windowDays} days after deletion.</p>
      {items.map((item) => (
        <Card key={`${item.type}:${item.id}`} padding="sm" className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-sm truncate">
              <span className="mr-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{item.type}</span>
              {item.text}
            </p>
            <p className="text-xs text-muted-foreground">
              by @{item.author.username} · deleted {formatRelativeDate(item.deletedAt)}
              {item.deletedBy && (item.deletedBy.id === item.author.id ? ' by the author' : ` by @${item.deletedBy.username}`)}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={restore.isPending}
            onClick={() =>
              restore.mutate(
                { targetType: item.type, id: item.id },
                { onSuccess: () => showToast(`${item.type === 'post' ? 'Post' : 'Comment'} restored`), onError: (err) => showToast(err.message, 'error') },
              )
            }
          >
            <RotateCcw className="w-3.5 h-3.5" /> Restore
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
  const { showToast } = useToast();
  const update = useUpdateSettings();
  const [draft, setDraft] = useState(words.join('\n'));
  const parsed = [...new Set(draft.split('\n').map((word) => word.trim().toLowerCase()).filter(Boolean))];
  const unchanged = parsed.join('|') === words.join('|');

  return (
    <Card className="space-y-4">
      <div>
        <h2 className="font-bold">Flagged words</h2>
        <p className="text-sm text-muted-foreground">
          Posts and comments containing any of these words or phrases are held for the team before anyone else sees them. One per line;
          capitals and accents don&apos;t matter, and only whole words match. The team&apos;s own posts aren&apos;t filtered.
        </p>
      </div>
      <Textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={'scam\nbuy followers'} className="min-h-[200px] font-mono text-sm" />
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{parsed.length} word{parsed.length === 1 ? '' : 's'}</span>
        <Button
          variant="primary"
          disabled={unchanged || update.isPending}
          onClick={() =>
            update.mutate(
              { flaggedWords: parsed },
              { onSuccess: () => showToast('Word filter saved'), onError: (error) => showToast(error.message, 'error') },
            )
          }
        >
          {update.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
        </Button>
      </div>
    </Card>
  );
};
