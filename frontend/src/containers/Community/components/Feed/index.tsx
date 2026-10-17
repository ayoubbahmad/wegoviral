'use client';

import { useEffect, useRef } from 'react';
import { AlertCircle, Loader2, MessageSquare, VolumeX } from 'lucide-react';
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

interface FeedTabProps {
  feed: FeedController;
}

export const FeedTab = ({ feed }: FeedTabProps) => {
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
  } = feed;

  const spacesById = Object.fromEntries(spaces.map((space) => [space.id, space]));
  const canPostHere = (!activeSpace?.adminOnly || isStaff) && feedCanInteract;

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
        {activeSpace && (
          <p className="px-1 text-sm text-muted-foreground">{activeSpace.description}</p>
        )}

        {isMuted && (
          <div role="status" className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm">
            <VolumeX className="w-4 h-4 mt-0.5 shrink-0 text-amber-500" />
            <div>
              <p className="font-semibold">
                You&apos;re muted{mutedUntil ? ` until ${new Date(mutedUntil).toLocaleString()}` : ''}
              </p>
              <p className="text-muted-foreground">
                You can still read the community, but not post, comment, react or vote.
                {muteReason && <> Reason: {muteReason}</>}
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

        {isLoadingPosts ? (
          <PostSkeletons />
        ) : postsError ? (
          <Card className="flex flex-col items-center gap-3 text-center">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <p className="text-sm text-muted-foreground">{postsError.message}</p>
            <button
              onClick={() => retryPosts()}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Try again
            </button>
          </Card>
        ) : posts.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No posts here yet"
            description={
              canPostHere
                ? 'Be the first to start the conversation in this space.'
                : 'The team will post updates here soon.'
            }
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
              <p className="py-4 text-center text-xs text-muted-foreground">You&apos;re all caught up ✨</p>
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
