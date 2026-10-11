'use client';

import { MOCK_LEADERBOARD } from '@/lib/mock-data';
import { useCommunityStore } from '../slice';

export const useCommunityController = () => {
  const {
    posts,
    createPost,
    toggleLikePost,
    events,
    createEvent,
    isCreateEventModalOpen,
    setIsCreateEventModalOpen,
  } = useCommunityStore();

  return {
    posts,
    handleCreatePost: createPost,
    handleLikePost: toggleLikePost,
    events,
    handleCreateEvent: createEvent,
    isCreateEventModalOpen,
    setIsCreateEventModalOpen,
    leaderboard: MOCK_LEADERBOARD,
  };
};
