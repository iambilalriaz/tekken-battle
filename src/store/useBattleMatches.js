import { create } from 'zustand';

export const useBattleMatches = create((set) => ({
  battleMatches: null,

  setBattleMatches: (data) => {
    set({ battleMatches: data });
  },
}));
