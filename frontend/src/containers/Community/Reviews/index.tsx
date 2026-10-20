'use client';

import { useState } from 'react';
import { Check, ClipboardCheck, Loader2, ShieldCheck, X } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { Skeleton } from '@/components/Skeleton';
import { useAuth } from '@/providers/Auth';
import { useToast } from '@/providers/Toast';
import { avatarFor, formatRelativeDate } from '@/lib/utils';
import { CommunityPost } from '@/types/communityFeed';
import { usePendingReviews, useReviewPost, useSpaces } from '../api';
import { useT } from '@/i18n/provider';

/** New members' first posts, waiting for a staff member or trusted member to approve them. */
export const CommunityReviewsContainer = () => {
  const { user } = useAuth();
  const t = useT();
  const canReview = Boolean(user?.onboarding.canReviewPosts);
  const { data: posts, isPending, error } = usePendingReviews(canReview);
  const { data: spaces = [] } = useSpaces();
  const spaceName = (id: string) => {
    const space = spaces.find((s) => s.id === id);
    return space ? `${space.emoji} ${space.name}` : id;
  };

  return (
    <PageContainer>
      <PageHeader
        title={t('feed.reviews.title')}
        description={t('feed.reviews.description')}
      />

      <div className="flex items-start gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-4 text-sm">
        <ShieldCheck className="w-5 h-5 shrink-0 text-primary" />
        <p>
          <strong>{t('feed.reviews.vouchTitle')}</strong> {t('feed.reviews.vouchBody')}
        </p>
      </div>

      {!canReview ? (
        <EmptyState icon={ClipboardCheck} title={t('feed.reviews.cantTitle')} description={user?.onboarding.reviewBlockedReason ?? t('feed.reviews.cantBody')} />
      ) : isPending ? (
        <div className="space-y-3">
          {[0, 1].map((index) => (
            <Skeleton key={index} className="h-40 rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-muted-foreground">{error.message}</p>
      ) : posts.length === 0 ? (
        <EmptyState icon={ClipboardCheck} title={t('feed.reviews.doneTitle')} description={t('feed.reviews.doneBody')} />
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <ReviewCard key={post.id} post={post} spaceName={spaceName(post.spaceId)} />
          ))}
        </div>
      )}
    </PageContainer>
  );
};

const ReviewCard = ({ post, spaceName }: { post: CommunityPost; spaceName: string }) => {
  const t = useT();
  const { showToast } = useToast();
  const review = useReviewPost();
  const [rejecting, setRejecting] = useState(false);
  const [note, setNote] = useState('');

  const decide = (decision: 'approve' | 'reject') =>
    review.mutate(
      { postId: post.id, decision, note: note.trim() || undefined },
      {
        onSuccess: () => showToast(decision === 'approve' ? t('feed.reviews.approved') : t('feed.reviews.rejected')),
        onError: (error) => showToast(error.message, 'error'),
      },
    );

  return (
    <Card className="space-y-4">
      <div className="flex items-center gap-3">
        <img src={avatarFor(post.author)} alt="" className="w-10 h-10 rounded-full border border-border" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold truncate">@{post.author.username}</p>
          <p className="text-xs text-muted-foreground">
            {t('feed.reviews.inSpace', { space: spaceName })} · {formatRelativeDate(post.createdAt)}
          </p>
        </div>
      </div>

      {post.coverUrl && <img src={post.coverUrl} alt="" className="max-h-56 w-full rounded-xl object-cover" />}
      {post.title && <h2 className="text-lg font-bold">{post.title}</h2>}
      {post.content && <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{post.content}</p>}
      {post.images && (
        <div className="flex flex-wrap gap-2">
          {post.images.map((src) => (
            <a key={src} href={src} target="_blank" rel="noreferrer">
              <img src={src} alt="" className="h-24 w-24 rounded-lg border border-border object-cover" />
            </a>
          ))}
        </div>
      )}
      {post.poll && (
        <ul className="space-y-1 text-sm">
          {post.poll.options.map((option) => (
            <li key={option.id} className="rounded-lg border border-border px-3 py-1.5">
              {option.label}
            </li>
          ))}
        </ul>
      )}

      {rejecting ? (
        <div className="space-y-2">
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder={t('feed.reviews.notePlaceholder')}
            maxLength={500}
            className="w-full min-h-[70px] rounded-xl border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setRejecting(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="outline" size="sm" onClick={() => decide('reject')} disabled={review.isPending}>
              {review.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : t('feed.reviews.confirm')}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setRejecting(true)}>
            <X className="w-4 h-4" /> {t('feed.reviews.dontApprove')}
          </Button>
          <Button variant="primary" size="sm" onClick={() => decide('approve')} disabled={review.isPending}>
            {review.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" /> {t('feed.reviews.approve')}</>}
          </Button>
        </div>
      )}
    </Card>
  );
};
