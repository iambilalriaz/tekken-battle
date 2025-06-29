import { create } from 'zustand';

export const useBattle = create((set) => ({
  battle: null,

  setBattle: (data) => {
    set({ battle: data });
  },
}));
