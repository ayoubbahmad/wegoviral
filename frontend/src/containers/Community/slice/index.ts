import { create } from 'zustand';
import { MOCK_COMMUNITY_EVENTS } from '@/lib/mock-data';
import { CommunityEvent, CommunityUser } from '@/types/communityFeed';

export const ALL_SPACES_ID = 'all';

const ME: CommunityUser = {
  id: 'me',
  username: 'you',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
};

// Posts live on the server (React Query); this store only keeps UI state and mock events
interface CommunityState {
  events: CommunityEvent[];
  activeSpaceId: string;
  isCreatePostOpen: boolean;
  isCreateEventModalOpen: boolean;
  setActiveSpaceId: (spaceId: string) => void;
  setIsCreatePostOpen: (open: boolean) => void;
  createEvent: (data: { title: string; date: string; description?: string }) => void;
  setIsCreateEventModalOpen: (open: boolean) => void;
}

export const useCommunityStore = create<CommunityState>((set) => ({
  events: MOCK_COMMUNITY_EVENTS,
  activeSpaceId: ALL_SPACES_ID,
  isCreatePostOpen: false,
  isCreateEventModalOpen: false,
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
