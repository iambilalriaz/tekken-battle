import { create } from 'zustand';

export const useSelectOpponentModal = create((set) => ({
  showOpponentSelectionModal: false,

  toggleOpponentSelectionModal: () => {
    set((state) => ({
      showOpponentSelectionModal: !state.showOpponentSelectionModal,
    }));
  },
}));
