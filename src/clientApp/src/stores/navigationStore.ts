import { create } from "zustand";

export type PageType = "home" | "chat" | "agents" | "settings";

interface NavigationState {
  isDrawerOpen: boolean;
  currentPage: PageType;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  setCurrentPage: (page: PageType) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  isDrawerOpen: false,
  currentPage: "home",
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
  setCurrentPage: (page: PageType) => set({ currentPage: page }),
}));
