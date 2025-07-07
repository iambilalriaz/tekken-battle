import { create } from 'zustand';

export const useCustomerProfile = create((set) => ({
  updateProfileModal: false,

  toggleUpdateProfileModal: () => {
    set((state) => ({
      updateProfileModal: !state.updateProfileModal,
    }));
  },
}));
