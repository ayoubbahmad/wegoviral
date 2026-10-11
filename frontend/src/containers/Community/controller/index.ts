'use client';

import { useMemo, useState } from 'react';
import { MOCK_COMMUNITY_SPACES, MOCK_LEADERBOARD } from '@/lib/mock-data';
import { useAuth } from '@/providers/Auth';
import { useToast } from '@/providers/Toast';
import { CommunityPost, CommunityUser, NewPostInput } from '@/types/communityFeed';
import { ALL_SPACES_ID, useCommunityStore } from '../slice';

export const useCommunityController = () => {
  const {
    posts,
    createPost,
    deletePost,
    toggleLikePost,
    toggleBookmarkPost,
    votePoll,
    isCreatePostOpen,
    setIsCreatePostOpen,
    activeSpaceId,
    setActiveSpaceId,
    events,
    createEvent,
    isCreateEventModalOpen,
    setIsCreateEventModalOpen,
  } = useCommunityStore();

  const { user } = useAuth();
  const { showToast } = useToast();

  const spaces = MOCK_COMMUNITY_SPACES;

  const currentUser: CommunityUser | undefined = user
    ? {
        id: user.id,
        username: user.username,
        avatarUrl:
          user.avatarUrl ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`,
      }
    : undefined;

  const handleCreatePost = (input: NewPostInput) => {
    createPost(input, currentUser);
    showToast('Post published');
  };

  const handleDeletePost = (postId: string) => {
    deletePost(postId);
    showToast('Post deleted', 'info');
  };

  const handleCopyPostLink = async (post: CommunityPost) => {
    const url = `${window.location.origin}/community/feed#post-${post.id}`;
    try {
      await navigator.clipboard.writeText(url);
      showToast('Link copied');
    } catch {
      showToast('Could not copy the link', 'error');
    }
  };

  const postCountBySpace = useMemo(() => {
    const counts: Record<string, number> = { [ALL_SPACES_ID]: posts.length };
    posts.forEach((post) => {
      counts[post.spaceId] = (counts[post.spaceId] ?? 0) + 1;
    });
    return counts;
  }, [posts]);

  const filteredPosts = useMemo(
    () =>
      activeSpaceId === ALL_SPACES_ID
        ? posts
        : posts.filter((post) => post.spaceId === activeSpaceId),
    [posts, activeSpaceId],
  );

  // Captured once per mount: "upcoming" doesn't need to tick live
  const [now] = useState(() => Date.now());

  const upcomingEvents = useMemo(() => {
    return events
      .filter((event) => new Date(event.date).getTime() >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);
  }, [events, now]);

  // Comments weigh more than likes: they signal a real conversation
  const topPosts = useMemo(
    () =>
      [...posts]
        .sort(
          (a, b) =>
            b.likeCount + b.commentCount * 2 - (a.likeCount + a.commentCount * 2),
        )
        .slice(0, 5),
    [posts],
  );

  const activeSpace = spaces.find((space) => space.id === activeSpaceId) ?? null;

  return {
    spaces,
    activeSpace,
    activeSpaceId,
    setActiveSpaceId,
    postCountBySpace,
    posts: filteredPosts,
    currentUser,
    isCreatePostOpen,
    setIsCreatePostOpen,
    handleCreatePost,
    handleDeletePost,
    handleCopyPostLink,
    handleLikePost: toggleLikePost,
    handleBookmarkPost: toggleBookmarkPost,
    handleVotePoll: votePoll,
    events,
    upcomingEvents,
    topPosts,
    handleCreateEvent: createEvent,
    isCreateEventModalOpen,
    setIsCreateEventModalOpen,
    leaderboard: MOCK_LEADERBOARD,
  };
};
