'use client';

import { useAuth } from '@/providers/Auth';
import { useToast } from '@/providers/Toast';
import { CommunityPost, CommunityUser } from '@/types/communityFeed';
import { useBookmarkPost, useDeletePost, useLikePost, usePinPost, useVotePoll } from '../../api';
import { useT } from '@/i18n/provider';

/** What a member can do with a post card, wherever posts are listed (timeline, profiles). */
export const usePostActions = () => {
  const { user } = useAuth();
  const t = useT();
  const { showToast } = useToast();
  const deletePost = useDeletePost();
  const pinPost = usePinPost();
  const likePost = useLikePost();
  const bookmarkPost = useBookmarkPost();
  const votePoll = useVotePoll();

  const currentUser: CommunityUser | undefined = user
    ? { id: user.id, username: user.username, avatarUrl: user.avatarUrl, role: user.role }
    : undefined;

  const reportError = (error: unknown, fallback: string) =>
    showToast(error instanceof Error ? error.message : fallback, 'error');

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


  return { currentUser, reportError, handleDeletePost, handlePinPost, handleLikePost, handleBookmarkPost, handleVotePoll, handleCopyPostLink };
};
