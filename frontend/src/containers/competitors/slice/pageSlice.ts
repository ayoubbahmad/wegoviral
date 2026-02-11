import { create } from 'zustand';

interface CompetitorsPageState {
  isModalOpen: boolean;
  searchQuery: string;
  setIsModalOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
}

export const useCompetitorsPageSlice = create<CompetitorsPageState>((set) => ({
  isModalOpen: false,
  searchQuery: '',
  setIsModalOpen: (open) => set({ isModalOpen: open }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
