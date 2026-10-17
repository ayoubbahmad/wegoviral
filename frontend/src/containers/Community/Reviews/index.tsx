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

/** New members' first posts, waiting for a staff member or trusted member to approve them. */
export const CommunityReviewsContainer = () => {
  const { user } = useAuth();
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
        title="Review posts"
        description="New members' first posts wait here until someone checks them."
      />

      <div className="flex items-start gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-4 text-sm">
        <ShieldCheck className="w-5 h-5 shrink-0 text-primary" />
        <p>
          <strong>You vouch for what you approve.</strong> Your name is saved with the post, and the team can see it if
          the post is removed later. When in doubt, leave it for someone else.
        </p>
      </div>

      {!canReview ? (
        <EmptyState icon={ClipboardCheck} title="You can't review posts yet" description="Reviewing opens to members after 30 days and their own first approved posts." />
      ) : isPending ? (
        <div className="space-y-3">
          {[0, 1].map((index) => (
            <Skeleton key={index} className="h-40 rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-muted-foreground">{error.message}</p>
      ) : posts.length === 0 ? (
        <EmptyState icon={ClipboardCheck} title="All caught up" description="No posts are waiting for review." />
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
  const { showToast } = useToast();
  const review = useReviewPost();
  const [rejecting, setRejecting] = useState(false);
  const [note, setNote] = useState('');

  const decide = (decision: 'approve' | 'reject') =>
    review.mutate(
      { postId: post.id, decision, note: note.trim() || undefined },
      {
        onSuccess: () => showToast(decision === 'approve' ? 'Post approved and published' : 'Post not approved'),
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
            In {spaceName} · {formatRelativeDate(post.createdAt)}
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
            placeholder="Tell the author why (they'll see this)"
            maxLength={500}
            className="w-full min-h-[70px] rounded-xl border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setRejecting(false)}>
              Cancel
            </Button>
            <Button variant="outline" size="sm" onClick={() => decide('reject')} disabled={review.isPending}>
              {review.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setRejecting(true)}>
            <X className="w-4 h-4" /> Don&apos;t approve
          </Button>
          <Button variant="primary" size="sm" onClick={() => decide('approve')} disabled={review.isPending}>
            {review.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" /> Approve</>}
          </Button>
        </div>
      )}
    </Card>
  );
};
