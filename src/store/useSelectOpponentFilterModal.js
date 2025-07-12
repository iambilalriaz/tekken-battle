import { create } from 'zustand';

export const useSelectOpponentFilterModal = create((set) => ({
  selectOpponentFilterModal: false,

  toggleOpponentFilterSelectionModal: () => {
    set((state) => ({
      selectOpponentFilterModal: !state.selectOpponentFilterModal,
    }));
  },
}));
