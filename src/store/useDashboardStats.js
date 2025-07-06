import { create } from 'zustand';

export const useDashboardStats = create((set) => ({
  statsDate: new Date(),
  dashboardStats: null,

  setStatsDate: (data) => {
    set({ statsDate: data });
  },
  setDashboardStats: (data) => {
    set({ dashboardStats: data });
  },
}));
