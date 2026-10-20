'use client';

import { useMemo } from 'react';
import { useAuth, useCan } from '@/providers/Auth';
import { useToast } from '@/providers/Toast';
import { CommunityPost, CommunityUser, NewPostDraft } from '@/types/communityFeed';
import { ALL_SPACES_ID, useCommunityStore } from '../../slice';
import { useEvents } from '../../Events/api';
import {
  useBookmarkPost,
  useCreatePost,
  useDeletePost,
  useFeedPosts,
  useLikePost,
  usePinPost,
  useSpaces,
  useTopPosts,
  useVotePoll,
} from '../../api';
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
  const deletePost = useDeletePost();
  const pinPost = usePinPost();
  const likePost = useLikePost();
  const bookmarkPost = useBookmarkPost();
  const votePoll = useVotePoll();

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

  const currentUser: CommunityUser | undefined = user
    ? { id: user.id, username: user.username, avatarUrl: user.avatarUrl, role: user.role }
    : undefined;

  const reportError = (error: unknown, fallback: string) =>
    showToast(error instanceof Error ? error.message : fallback, 'error');

  const handleCreatePost = async (draft: NewPostDraft) => {
    const post = await createPost.mutateAsync(draft);
    setIsCreatePostOpen(false);
    showToast(
      post.reviewStatus === 'PENDING'
        ? t('feed.toasts.sentForReview')
        : t('feed.toasts.published'),
    );
  };

  const handleDeletePost = (postId: string) => {
    if (!window.confirm(t('feed.toasts.deleteConfirm'))) return;
    deletePost.mutate(postId, {
      onSuccess: () => showToast(t('feed.toasts.deleted'), 'info'),
      onError: (error) => reportError(error, t('feed.toasts.deleteFailed')),
    });
  };

  const handlePinPost = (post: CommunityPost) => {
    pinPost.mutate(
      { postId: post.id, pinned: !post.pinned },
      {
        onSuccess: () => showToast(post.pinned ? t('feed.toasts.unpinned') : t('feed.toasts.pinned')),
        onError: (error) => reportError(error, t('feed.toasts.pinFailed')),
      },
    );
  };

  const handleLikePost = (post: CommunityPost) =>
    likePost.mutate(
      { postId: post.id, liked: !post.likedByMe },
      { onError: (error) => reportError(error, t('feed.toasts.likeFailed')) },
    );

  const handleBookmarkPost = (post: CommunityPost) =>
    bookmarkPost.mutate(
      { postId: post.id, bookmarked: !post.bookmarkedByMe },
      {
        onSuccess: () => showToast(post.bookmarkedByMe ? t('feed.toasts.unbookmarked') : t('feed.toasts.bookmarked')),
        onError: (error) => reportError(error, t('feed.toasts.bookmarkFailed')),
      },
    );

  const handleVotePoll = (postId: string, optionId: string) =>
    votePoll.mutate(
      { postId, optionId },
      { onError: (error) => reportError(error, t('feed.toasts.voteFailed')) },
    );

  const handleCopyPostLink = async (post: CommunityPost) => {
    const url = `${window.location.origin}/community/feed#post-${post.id}`;
    try {
      await navigator.clipboard.writeText(url);
      showToast(t('feed.toasts.linkCopied'));
    } catch {
      showToast(t('feed.referral.copyFailed'), 'error');
    }
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
