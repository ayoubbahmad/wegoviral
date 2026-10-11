'use client';

import { useMemo } from 'react';
import { MOCK_COMMUNITY_SPACES, MOCK_LEADERBOARD } from '@/lib/mock-data';
import { ALL_SPACES_ID, useCommunityStore } from '../slice';

export const useCommunityController = () => {
  const {
    posts,
    createPost,
    toggleLikePost,
    activeSpaceId,
    setActiveSpaceId,
    events,
    createEvent,
    isCreateEventModalOpen,
    setIsCreateEventModalOpen,
  } = useCommunityStore();

  const spaces = MOCK_COMMUNITY_SPACES;

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

  const activeSpace = spaces.find((space) => space.id === activeSpaceId) ?? null;

  return {
    spaces,
    activeSpace,
    activeSpaceId,
    setActiveSpaceId,
    postCountBySpace,
    posts: filteredPosts,
    handleCreatePost: createPost,
    handleLikePost: toggleLikePost,
    events,
    handleCreateEvent: createEvent,
    isCreateEventModalOpen,
    setIsCreateEventModalOpen,
    leaderboard: MOCK_LEADERBOARD,
  };
};
