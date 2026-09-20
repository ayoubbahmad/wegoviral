'use client';

import { useState } from 'react';
import {
  MOCK_COMMUNITY_POSTS,
  MOCK_COMMUNITY_EVENTS,
  MOCK_LEADERBOARD,
} from '@/lib/mock-data';
import { CommunityPost, CommunityEvent } from '@/types/communityFeed';
import { CommunityTabId } from '../constants';

export const useCommunityController = () => {
  const [activeTab, setActiveTab] = useState<CommunityTabId>('Feed');

  const [posts, setPosts] = useState<CommunityPost[]>(MOCK_COMMUNITY_POSTS);

  const handleCreatePost = (content: string) => {
    if (!content.trim()) return;
    const newPost: CommunityPost = {
      id: `local-${Date.now()}`,
      author: {
        id: 'me',
        username: 'you',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
      },
      content,
      createdAt: new Date().toISOString(),
      likeCount: 0,
      commentCount: 0,
      likedByMe: false,
    };
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              likedByMe: !post.likedByMe,
              likeCount: post.likedByMe
                ? post.likeCount - 1
                : post.likeCount + 1,
            }
          : post,
      ),
    );
  };

  const [events, setEvents] = useState<CommunityEvent[]>(MOCK_COMMUNITY_EVENTS);
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);

  const handleCreateEvent = (data: {
    title: string;
    date: string;
    description?: string;
  }) => {
    if (!data.title.trim() || !data.date) return;
    const newEvent: CommunityEvent = {
      id: `local-${Date.now()}`,
      title: data.title,
      description: data.description,
      date: data.date,
      attendeeCount: 1,
      createdBy: {
        id: 'me',
        username: 'you',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
      },
    };
    setEvents((prev) => [newEvent, ...prev]);
    setIsCreateEventModalOpen(false);
  };

  const leaderboard = MOCK_LEADERBOARD;

  return {
    activeTab,
    setActiveTab,
    posts,
    handleCreatePost,
    handleLikePost,
    events,
    handleCreateEvent,
    isCreateEventModalOpen,
    setIsCreateEventModalOpen,
    leaderboard,
  };
};
