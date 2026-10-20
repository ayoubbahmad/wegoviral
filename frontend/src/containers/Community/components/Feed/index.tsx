'use client';

import { useEffect, useRef } from 'react';
import { AlertCircle, Loader2, Lock, MessageSquare, VolumeX } from 'lucide-react';
import { describeLockReason } from '@/lib/access';
import { EmptyState } from '@/components/EmptyState';
import { Skeleton } from '@/components/Skeleton';
import { Card } from '@/components/Card';
import { TopPost } from '@/types/communityFeed';
import type { FeedController } from '../../Feed/controller';
import { ALL_SPACES_ID } from '../../slice';
import { StartPostCard } from './StartPostCard';
import { CreatePostModal } from './CreatePostModal';
import { PostCard } from './PostCard';
import { SpaceChips } from './SpaceChips';
import { UpcomingEventsCard } from './UpcomingEventsCard';
import { TopPostsCard } from './TopPostsCard';
import { ReferralCard } from '@/containers/Onboarding/ReferralCard';
import { useT } from '@/i18n/provider';
import { activeIntl } from '@/i18n/active';

interface FeedTabProps {
  feed: FeedController;
}

export const FeedTab = ({ feed }: FeedTabProps) => {
  const t = useT();
  const {
    spaces,
    activeSpace,
    activeSpaceId,
    setActiveSpaceId,
    postCountBySpace,
    posts,
    isLoadingPosts,
    postsError,
    retryPosts,
    hasMorePosts,
    isLoadingMorePosts,
    loadMorePosts,
    topPosts,
    upcomingEvents,
    currentUser,
    isStaff,
    isMuted,
    canInteract: feedCanInteract,
    muteReason,
    mutedUntil,
    probation,
  } = feed;

  const spacesById = Object.fromEntries(spaces.map((space) => [space.id, space]));
  const isLocked = Boolean(activeSpace?.access.locked);
  const canPostHere = (!activeSpace?.adminOnly || isStaff) && feedCanInteract && !isLocked;

  // Load the next page when the sentinel below the list scrolls into view
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMorePosts) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoadingMorePosts) loadMorePosts();
      },
      { rootMargin: '600px' },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMorePosts, isLoadingMorePosts, loadMorePosts]);

  // Show the post in the full feed, then bring it into view if it's loaded
  const handleSelectTopPost = (post: TopPost) => {
    setActiveSpaceId(ALL_SPACES_ID);
    requestAnimationFrame(() => {
      document
        .getElementById(`post-${post.id}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_340px] items-start">
      <div className="min-w-0 space-y-4">
        <SpaceChips
          spaces={spaces}
          activeSpaceId={activeSpaceId}
          postCountBySpace={postCountBySpace}
          onChange={setActiveSpaceId}
        />
        {activeSpace?.coverUrl && (
          <img src={activeSpace.coverUrl} alt="" className="h-32 w-full rounded-2xl border border-border object-cover" />
        )}
        {activeSpace && (
          <p className="px-1 text-sm text-muted-foreground">{activeSpace.description}</p>
        )}

        {isMuted && (
          <div role="status" className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm">
            <VolumeX className="w-4 h-4 mt-0.5 shrink-0 text-amber-500" />
            <div>
              <p className="font-semibold">
                {mutedUntil ? t('feed.mutedUntil', { date: new Date(mutedUntil).toLocaleString(activeIntl()) }) : t('feed.muted')}
              </p>
              <p className="text-muted-foreground">
                {t('feed.mutedBody')}
                {muteReason && <> {t('feed.reason', { reason: muteReason })}</>}
              </p>
            </div>
          </div>
        )}

        {canPostHere && (
          <StartPostCard
            currentUser={currentUser}
            onOpen={() => feed.setIsCreatePostOpen(true)}
          />
        )}
        {canPostHere && probation?.onProbation && (
          <p className="px-1 text-xs text-muted-foreground">
            {t('feed.probation', { required: probation.required, approved: probation.approvedPosts })}
            {probation.pendingPosts > 0 && t('feed.probationWaiting', { count: probation.pendingPosts })}
          </p>
        )}

        {isLocked && activeSpace ? (
          <Card className="space-y-3 text-center">
            <div className="mx-auto inline-flex rounded-2xl bg-secondary/60 p-4">
              <Lock className="w-7 h-7 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-bold">
              {t('feed.spaceLocked', { space: `${activeSpace.emoji} ${activeSpace.name}` })}
            </h2>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {activeSpace.access.reasons.map((reason, index) => (
                <li key={index}>{describeLockReason(reason, t)}</li>
              ))}
            </ul>
            {activeSpace.access.reasons.some((reason) => reason.type === 'tier') && (
              <p className="text-xs text-muted-foreground">{t('feed.upgradeSoon')}</p>
            )}
          </Card>
        ) : isLoadingPosts ? (
          <PostSkeletons />
        ) : postsError ? (
          <Card className="flex flex-col items-center gap-3 text-center">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <p className="text-sm text-muted-foreground">{postsError.message}</p>
            <button
              onClick={() => retryPosts()}
              className="text-sm font-semibold text-primary hover:underline"
            >
              {t('feed.tryAgain')}
            </button>
          </Card>
        ) : posts.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title={t('feed.emptyTitle')}
            description={canPostHere ? t('feed.emptyCanPost') : t('feed.emptyTeam')}
          />
        ) : (
          <>
            {posts.map((post) => (
              <div key={post.id} id={`post-${post.id}`} className="scroll-mt-8">
                <PostCard
                  post={post}
                  space={spacesById[post.spaceId]}
                  currentUser={currentUser}
                  isStaff={isStaff}
                  onLike={feed.handleLikePost}
                  onBookmark={feed.handleBookmarkPost}
                  onVote={feed.handleVotePoll}
                  onCopyLink={feed.handleCopyPostLink}
                  onPin={feed.handlePinPost}
                  onDelete={feed.handleDeletePost}
                  onSpaceClick={setActiveSpaceId}
                />
              </div>
            ))}
            <div ref={sentinelRef} />
            {isLoadingMorePosts && (
              <div className="flex justify-center py-4">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            )}
            {!hasMorePosts && posts.length > 5 && (
              <p className="py-4 text-center text-xs text-muted-foreground">{t('feed.caughtUp')}</p>
            )}
          </>
        )}
      </div>

      <aside className="hidden lg:block sticky top-8 space-y-6">
        <UpcomingEventsCard events={upcomingEvents} />
        <TopPostsCard posts={topPosts} spacesById={spacesById} onSelect={handleSelectTopPost} />
        <ReferralCard />
      </aside>

      <CreatePostModal
        isOpen={feed.isCreatePostOpen}
        onClose={() => feed.setIsCreatePostOpen(false)}
        spaces={spaces}
        activeSpace={activeSpace}
        canPostInAdminSpaces={isStaff}
        onSubmit={feed.handleCreatePost}
      />
    </div>
  );
};

const PostSkeletons = () => (
  <>
    {[0, 1, 2].map((index) => (
      <Card key={index} className="space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </Card>
    ))}
  </>
);
