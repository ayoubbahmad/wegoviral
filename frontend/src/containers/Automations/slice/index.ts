import { create } from 'zustand';

export interface AutomationFormData {
  name: string;
  triggerKeyword: string;
  responseMessage: string;
  commentReplyEnabled: boolean;
  commentReplyMessage: string;
  isGlobal: boolean;
  instagramPostId: string;
}

const initialFormData: AutomationFormData = {
  name: '',
  triggerKeyword: '',
  responseMessage: '',
  commentReplyEnabled: false,
  commentReplyMessage: '',
  isGlobal: true,
  instagramPostId: '',
};

interface AutomationsState {
  isAdding: boolean;
  editingId: string | null;
  viewType: 'grid' | 'table';
  formData: AutomationFormData;

  // Actions
  setIsAdding: (isAdding: boolean) => void;
  setEditingId: (id: string | null) => void;
  setViewType: (viewType: 'grid' | 'table') => void;
  setFormData: (data: Partial<AutomationFormData>) => void;
  resetForm: () => void;
}

export const useAutomationsStore = create<AutomationsState>((set) => ({
  isAdding: false,
  editingId: null,
  viewType: 'grid',
  formData: initialFormData,

  setIsAdding: (isAdding) => set({ isAdding }),
  setEditingId: (editingId) => set({ editingId }),
  setViewType: (viewType) => set({ viewType }),
  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
  resetForm: () =>
    set({
      formData: initialFormData,
      editingId: null,
      isAdding: false,
    }),
}));
