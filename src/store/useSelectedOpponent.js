import { create } from 'zustand';

export const useSelectedOpponent = create((set) => ({
  selectedOpponent: '',

  setSelectedOpponent: (opponent) => {
    set({ selectedOpponent: opponent });
  },
}));
