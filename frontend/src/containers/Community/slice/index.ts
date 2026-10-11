import { create } from 'zustand';
import {
  MOCK_COMMUNITY_POSTS,
  MOCK_COMMUNITY_EVENTS,
} from '@/lib/mock-data';
import { CommunityPost, CommunityEvent } from '@/types/communityFeed';

const ME = {
  id: 'me',
  username: 'you',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
};

interface CommunityState {
  posts: CommunityPost[];
  events: CommunityEvent[];
  isCreateEventModalOpen: boolean;
  createPost: (content: string) => void;
  toggleLikePost: (postId: string) => void;
  createEvent: (data: { title: string; date: string; description?: string }) => void;
  setIsCreateEventModalOpen: (open: boolean) => void;
}

// Shared across the community pages so local changes survive navigation
export const useCommunityStore = create<CommunityState>((set) => ({
  posts: MOCK_COMMUNITY_POSTS,
  events: MOCK_COMMUNITY_EVENTS,
  isCreateEventModalOpen: false,
  createPost: (content) => {
    if (!content.trim()) return;
    const newPost: CommunityPost = {
      id: `local-${Date.now()}`,
      author: ME,
      content,
      createdAt: new Date().toISOString(),
      likeCount: 0,
      commentCount: 0,
      likedByMe: false,
    };
    set((state) => ({ posts: [newPost, ...state.posts] }));
  },
  toggleLikePost: (postId) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              likedByMe: !post.likedByMe,
              likeCount: post.likedByMe ? post.likeCount - 1 : post.likeCount + 1,
            }
          : post,
      ),
    })),
  createEvent: (data) => {
    if (!data.title.trim() || !data.date) return;
    const newEvent: CommunityEvent = {
      id: `local-${Date.now()}`,
      title: data.title,
      description: data.description,
      date: data.date,
      attendeeCount: 1,
      createdBy: ME,
    };
    set((state) => ({
      events: [newEvent, ...state.events],
      isCreateEventModalOpen: false,
    }));
  },
  setIsCreateEventModalOpen: (open) => set({ isCreateEventModalOpen: open }),
}));
