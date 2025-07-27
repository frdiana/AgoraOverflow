import { useConversationsStore } from "../stores/conversationsStore";

/**
 * Custom hook that provides conversation management functionality
 * This demonstrates how to use the conversations Zustand store in components
 */
export const useConversations = () => {
  const {
    conversations,
    currentConversationId,
    createConversation,
    deleteConversation,
    selectConversation,
    addMessageToCurrentConversation,
    updateConversationTitle,
    getCurrentConversation,
  } = useConversationsStore();

  const currentConversation = getCurrentConversation();

  return {
    // State
    conversations,
    currentConversationId,
    currentConversation,

    // Actions
    createConversation,
    deleteConversation,
    selectConversation,
    addMessageToCurrentConversation,
    updateConversationTitle,

    // Computed
    hasConversations: conversations.length > 0,
    messagesCount: currentConversation?.messages.length || 0,
  };
};
