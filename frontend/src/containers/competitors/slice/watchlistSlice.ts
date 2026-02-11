import { create } from 'zustand';

interface WatchlistState {
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
}

export const useWatchlistSlice = create<WatchlistState>((set) => ({
  isCreateModalOpen: false,
  setIsCreateModalOpen: (open) => set({ isCreateModalOpen: open }),
}));
