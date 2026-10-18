import { create } from 'zustand';

export const ALL_SPACES_ID = 'all';

// Posts and events live on the server (React Query); this store only keeps UI state
interface CommunityState {
  activeSpaceId: string;
  isCreatePostOpen: boolean;
  setActiveSpaceId: (spaceId: string) => void;
  setIsCreatePostOpen: (open: boolean) => void;
}

export const useCommunityStore = create<CommunityState>((set) => ({
  activeSpaceId: ALL_SPACES_ID,
  isCreatePostOpen: false,
  setActiveSpaceId: (spaceId) => set({ activeSpaceId: spaceId }),
  setIsCreatePostOpen: (open) => set({ isCreatePostOpen: open }),
}));
