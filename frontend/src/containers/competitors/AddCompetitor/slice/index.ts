import { create } from 'zustand';

interface AddCompetitorState {
  prevStep: boolean;
  previews: any[];
  setPrevStep: (value: boolean) => void;
  setPreviews: (value: any[]) => void;
  reset: () => void;
}

export const useAddCompetitorSlice = create<AddCompetitorState>((set) => ({
  prevStep: false,
  previews: [],
  setPrevStep: (value) => set({ prevStep: value }),
  setPreviews: (value) => set({ previews: value }),
  reset: () => set({ prevStep: false, previews: [] }),
}));
