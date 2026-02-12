import { create } from 'zustand';

interface LibraryFilters {
  views: 'all' | 'high' | 'low';
  date: 'newest' | 'oldest';
  tags: string[];
}

interface LibraryState {
  activeTab: 'hooks' | 'scripts' | 'videos';
  viewType: 'grid' | 'table';
  selectedItemId: string | null;
  searchTerm: string;
  filters: LibraryFilters;
  isAdding: boolean;
  isEditing: boolean;

  // Actions
  setActiveTab: (tab: 'hooks' | 'scripts' | 'videos') => void;
  setViewType: (view: 'grid' | 'table') => void;
  setSelectedItemId: (id: string | null) => void;
  setSearchTerm: (term: string) => void;
  setFilters: (filters: Partial<LibraryFilters>) => void;
  setIsAdding: (isAdding: boolean) => void;
  setIsEditing: (isEditing: boolean) => void;
  resetFilters: () => void;
}

const initialFilters: LibraryFilters = {
  views: 'all',
  date: 'newest',
  tags: [],
};

export const useLibraryStore = create<LibraryState>((set) => ({
  activeTab: 'hooks',
  viewType: 'grid',
  selectedItemId: null,
  searchTerm: '',
  filters: initialFilters,
  isAdding: false,
  isEditing: false,

  setActiveTab: (activeTab) => set({ activeTab, selectedItemId: null }),
  setViewType: (viewType) => set({ viewType }),
  setSelectedItemId: (selectedItemId) => set({ selectedItemId }),
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),
  setIsAdding: (isAdding) => set({ isAdding, isEditing: false }),
  setIsEditing: (isEditing) => set({ isEditing, isAdding: false }),
  resetFilters: () => set({ filters: initialFilters }),
}));
