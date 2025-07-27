import { useAgentsStore } from "../stores/agentsStore";

/**
 * Custom hook that provides agents management functionality
 * This demonstrates how to use the agents Zustand store in components
 */
export const useAgents = () => {
  const {
    agents,
    toggleAgent,
    enableAllAgents,
    disableAllAgents,
    getEnabledAgents,
    getAgentsByCategory,
  } = useAgentsStore();

  const enabledAgents = getEnabledAgents();

  const stats = {
    total: agents.length,
    enabled: enabledAgents.length,
    disabled: agents.length - enabledAgents.length,
    byCategory: {
      coding: getAgentsByCategory("coding").length,
      creative: getAgentsByCategory("creative").length,
      analysis: getAgentsByCategory("analysis").length,
      productivity: getAgentsByCategory("productivity").length,
    },
  };

  return {
    // State
    agents,
    enabledAgents,

    // Actions
    toggleAgent,
    enableAllAgents,
    disableAllAgents,
    getAgentsByCategory,

    // Computed
    stats,
    hasEnabledAgents: enabledAgents.length > 0,
    allEnabled: enabledAgents.length === agents.length,
    allDisabled: enabledAgents.length === 0,
  };
};
