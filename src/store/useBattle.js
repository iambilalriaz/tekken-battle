import { create } from 'zustand';

export const useBattle = create((set) => ({
  battle: null,
  finishBattleModal: false,

  setBattle: (data) => {
    set({ battle: data });
  },

  toggleFinishBattleModal: () => {
    set((state) => ({
      finishBattleModal: !state.finishBattleModal,
    }));
  },
}));
