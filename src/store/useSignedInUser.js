import { create } from 'zustand';

export const useSignedInUser = create((set) => ({
  loggedInUser: null,

  setLoggedInUser: (user) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('loggedInUser', JSON.stringify(user));
    }
    set({ loggedInUser: user });
  },
  resetLoggedInUser: () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('loggedInUser');
    }

    set({ loggedInUser: null });
  },
}));
