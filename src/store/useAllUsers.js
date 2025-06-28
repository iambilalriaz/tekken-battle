import { create } from 'zustand';

export const useAllUsers = create((set) => ({
  allUsers: [],

  setAllUsers: (reqs) => {
    set({ allUsers: reqs });
  },
}));
