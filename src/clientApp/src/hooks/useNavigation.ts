import { useNavigationStore } from "../stores/navigationStore";

/**
 * Custom hook that provides navigation state and actions
 * This demonstrates how to use the Zustand store in components
 */
export const useNavigation = () => {
  const { isDrawerOpen, openDrawer, closeDrawer, toggleDrawer } =
    useNavigationStore();

  return {
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    toggleDrawer,
  };
};
