import { create } from 'zustand';
import {
  MOCK_COMMUNITY_POSTS,
  MOCK_COMMUNITY_EVENTS,
} from '@/lib/mock-data';
import {
  CommunityPost,
  CommunityEvent,
  CommunityUser,
  NewPostInput,
} from '@/types/communityFeed';

export const ALL_SPACES_ID = 'all';

const ME: CommunityUser = {
  id: 'me',
  username: 'you',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
};

const updatePost = (
  posts: CommunityPost[],
  postId: string,
  update: (post: CommunityPost) => CommunityPost,
) => posts.map((post) => (post.id === postId ? update(post) : post));

interface CommunityState {
  posts: CommunityPost[];
  events: CommunityEvent[];
  activeSpaceId: string;
  isCreatePostOpen: boolean;
  isCreateEventModalOpen: boolean;
  createPost: (input: NewPostInput, author?: CommunityUser) => void;
  deletePost: (postId: string) => void;
  toggleLikePost: (postId: string) => void;
  toggleBookmarkPost: (postId: string) => void;
  votePoll: (postId: string, optionId: string) => void;
  setActiveSpaceId: (spaceId: string) => void;
  setIsCreatePostOpen: (open: boolean) => void;
  createEvent: (data: { title: string; date: string; description?: string }) => void;
  setIsCreateEventModalOpen: (open: boolean) => void;
}

// Shared across the community pages so local changes survive navigation
export const useCommunityStore = create<CommunityState>((set) => ({
  posts: MOCK_COMMUNITY_POSTS,
  events: MOCK_COMMUNITY_EVENTS,
  activeSpaceId: ALL_SPACES_ID,
  isCreatePostOpen: false,
  isCreateEventModalOpen: false,
  createPost: (input, author = ME) => {
    if (!input.content.trim() && !input.title?.trim()) return;
    const id = `local-${Date.now()}`;
    const pollOptions = input.pollOptions?.filter((option) => option.trim());
    const newPost: CommunityPost = {
      id,
      spaceId: input.spaceId,
      author,
      title: input.title?.trim() || undefined,
      content: input.content.trim(),
      coverUrl: input.coverUrl,
      images: input.images?.length ? input.images : undefined,
      poll:
        pollOptions && pollOptions.length >= 2
          ? {
              options: pollOptions.map((label, index) => ({
                id: `${id}-o${index}`,
                label: label.trim(),
                votes: 0,
              })),
            }
          : undefined,
      createdAt: new Date().toISOString(),
      likeCount: 0,
      commentCount: 0,
      likedByMe: false,
    };
    set((state) => ({ posts: [newPost, ...state.posts], isCreatePostOpen: false }));
  },
  deletePost: (postId) =>
    set((state) => ({ posts: state.posts.filter((post) => post.id !== postId) })),
  toggleLikePost: (postId) =>
    set((state) => ({
      posts: updatePost(state.posts, postId, (post) => ({
        ...post,
        likedByMe: !post.likedByMe,
        likeCount: post.likedByMe ? post.likeCount - 1 : post.likeCount + 1,
      })),
    })),
  toggleBookmarkPost: (postId) =>
    set((state) => ({
      posts: updatePost(state.posts, postId, (post) => ({
        ...post,
        bookmarkedByMe: !post.bookmarkedByMe,
      })),
    })),
  votePoll: (postId, optionId) =>
    set((state) => ({
      posts: updatePost(state.posts, postId, (post) => {
        if (!post.poll || post.poll.votedOptionId) return post;
        return {
          ...post,
          poll: {
            votedOptionId: optionId,
            options: post.poll.options.map((option) =>
              option.id === optionId ? { ...option, votes: option.votes + 1 } : option,
            ),
          },
        };
      }),
    })),
  setActiveSpaceId: (spaceId) => set({ activeSpaceId: spaceId }),
  setIsCreatePostOpen: (open) => set({ isCreatePostOpen: open }),
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
