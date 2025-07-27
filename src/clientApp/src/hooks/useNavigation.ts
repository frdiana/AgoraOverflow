import { useNavigationStore } from "../stores/navigationStore";

/**
 * Custom hook that provides navigation state and actions
 * This demonstrates how to use the Zustand store in components
 */
export const useNavigation = () => {
  const {
    isDrawerOpen,
    currentPage,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    setCurrentPage,
  } = useNavigationStore();

  return {
    isDrawerOpen,
    currentPage,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    setCurrentPage,
  };
};
