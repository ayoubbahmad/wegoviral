'use client';

import { useMemo } from 'react';
import { useAuth, useCan } from '@/providers/Auth';
import { useToast } from '@/providers/Toast';
import { NewPostDraft } from '@/types/communityFeed';
import { ALL_SPACES_ID, useCommunityStore } from '../../slice';
import { useEvents } from '../../Events/api';
import { useCreatePost, useFeedPosts, useSpaces, useTopPosts } from '../../api';
import { usePostActions } from './postActions';
import { useT } from '@/i18n/provider';

export const useFeedController = () => {
  const { user } = useAuth();
  const can = useCan();
  const t = useT();
  const { showToast } = useToast();
  const { activeSpaceId, setActiveSpaceId, isCreatePostOpen, setIsCreatePostOpen } =
    useCommunityStore();
  const { data: upcomingEvents = [] } = useEvents('upcoming', undefined, 3);

  const spaceFilter = activeSpaceId === ALL_SPACES_ID ? undefined : activeSpaceId;
  const spacesQuery = useSpaces();
  // A locked space has nothing to load: the feed explains how to unlock it instead
  const selectedSpace = spacesQuery.data?.find((space) => space.id === spaceFilter);
  const postsQuery = useFeedPosts(spaceFilter, !selectedSpace?.access.locked);
  const topPostsQuery = useTopPosts();

  const createPost = useCreatePost();

  const spaces = useMemo(() => spacesQuery.data ?? [], [spacesQuery.data]);
  const posts = useMemo(
    () => postsQuery.data?.pages.flatMap((page) => page.posts) ?? [],
    [postsQuery.data],
  );

  const postCountBySpace = useMemo(() => {
    const counts: Record<string, number> = {};
    let total = 0;
    spaces.forEach((space) => {
      counts[space.id] = space.postCount;
      total += space.postCount;
    });
    counts[ALL_SPACES_ID] = total;
    return counts;
  }, [spaces]);

  const activeSpace = spaces.find((space) => space.id === activeSpaceId) ?? null;
  const isStaff = can('community.moderate');
  const isMuted = user?.status === 'MUTED';
  // Members who still have to accept the guide or pass the quiz can read but not post
  const canInteract = !isMuted && user?.onboarding.step === 'DONE';

  const { currentUser, reportError, handleDeletePost, handlePinPost, handleLikePost, handleBookmarkPost, handleVotePoll, handleCopyPostLink } =
    usePostActions();

  const handleCreatePost = async (draft: NewPostDraft) => {
    const post = await createPost.mutateAsync(draft);
    setIsCreatePostOpen(false);
    showToast(
      post.reviewStatus === 'PENDING'
        ? t('feed.toasts.sentForReview')
        : t('feed.toasts.published'),
    );
  };

  return {
    spaces,
    activeSpace,
    activeSpaceId,
    setActiveSpaceId,
    postCountBySpace,
    posts,
    isLoadingPosts: postsQuery.isPending,
    postsError: postsQuery.error,
    retryPosts: postsQuery.refetch,
    hasMorePosts: Boolean(postsQuery.hasNextPage),
    isLoadingMorePosts: postsQuery.isFetchingNextPage,
    loadMorePosts: postsQuery.fetchNextPage,
    topPosts: topPostsQuery.data ?? [],
    upcomingEvents,
    currentUser,
    isStaff,
    isMuted,
    canInteract,
    probation: user?.onboarding.probation,
    muteReason: user?.statusReason ?? null,
    mutedUntil: user?.statusUntil ?? null,
    isCreatePostOpen,
    setIsCreatePostOpen,
    handleCreatePost,
    handleDeletePost,
    handlePinPost,
    handleLikePost,
    handleBookmarkPost,
    handleVotePoll,
    handleCopyPostLink,
  };
};

export type FeedController = ReturnType<typeof useFeedController>;
