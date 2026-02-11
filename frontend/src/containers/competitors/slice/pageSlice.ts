import { create } from 'zustand';

interface CompetitorsPageState {
  isModalOpen: boolean;
  searchQuery: string;
  viewMode: 'grid' | 'table';
  selectedWatchlistId: string | null;
  setIsModalOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setViewMode: (mode: 'grid' | 'table') => void;
  setSelectedWatchlistId: (id: string | null) => void;
}

export const useCompetitorsPageSlice = create<CompetitorsPageState>((set) => ({
  isModalOpen: false,
  searchQuery: '',
  viewMode: 'grid',
  selectedWatchlistId: null,
  setIsModalOpen: (open) => set({ isModalOpen: open }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setSelectedWatchlistId: (id) => set({ selectedWatchlistId: id }),
}));
