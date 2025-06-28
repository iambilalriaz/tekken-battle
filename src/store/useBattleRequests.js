import { create } from 'zustand';

export const useBattleRequests = create((set) => ({
  battleRequests: [],

  setBattleRequests: (reqs) => {
    set({ battleRequests: reqs });
  },
  concatBattleRequest: (req) => {
    set((state) => ({ battleRequests: [req, ...state.battleRequests] }));
  },
}));
