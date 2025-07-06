import { create } from 'zustand';

export const useToggleComparisonModal = create((set) => ({
  comparisonModal: false,
  selectedOpponent: '',

  setSelectedOpponent: (opponent) => {
    set({ selectedOpponent: opponent });
  },

  toggleComparisonModal: () => {
    set((state) => ({
      comparisonModal: !state.comparisonModal,
    }));
  },
}));
