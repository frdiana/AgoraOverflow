import { create } from "zustand";
import {
  fetchConversations,
  startNewChat,
  sendChatMessage,
  type ApiConversation,
  type ApiMessage,
} from "../services";

export interface Message {
  key: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

interface ConversationsState {
  conversations: Conversation[];
  currentConversationId: string | null;
  isLoading: boolean;
  navigationCallback?: (chatId: string) => void;
  setNavigationCallback: (callback: (chatId: string) => void) => void;
  createConversation: () => Promise<void>;
  deleteConversation: (id: string) => void;
  selectConversation: (id: string) => void;
  selectConversationWithoutNavigation: (id: string) => void;
  addMessageToCurrentConversation: (message: Message) => void;
  updateConversationTitle: (id: string, title: string) => void;
  getCurrentConversation: () => Conversation | null;
  loadConversationsFromHistory: () => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
}

// Helper function to convert API message to internal format
const convertApiMessage = (apiMessage: ApiMessage): Message => ({
  key: apiMessage.id,
  role: apiMessage.sender === "User" ? "user" : "assistant",
  content: apiMessage.content,
  timestamp: new Date(apiMessage.timestamp).getTime(),
});

// Helper function to convert API conversation to internal format
const convertApiConversation = (
  apiConversation: ApiConversation
): Conversation => ({
  id: apiConversation.id,
  title: apiConversation.name,
  messages: apiConversation.messages.map(convertApiMessage),
  createdAt: new Date(apiConversation.createdAt).getTime(),
  updatedAt: new Date(apiConversation.updatedAt).getTime(),
});

// Helper function to generate a title from the first user message
const generateConversationTitle = (messages: Message[]): string => {
  const firstUserMessage = messages.find((m) => m.role === "user");
  if (firstUserMessage) {
    const content = firstUserMessage.content;
    return content.length > 30 ? content.substring(0, 30) + "..." : content;
  }
  return "New Conversation";
};

export const useConversationsStore = create<ConversationsState>((set, get) => {
  return {
    conversations: [],
    currentConversationId: null,
    isLoading: false,
    navigationCallback: undefined,

    setNavigationCallback: (callback: (chatId: string) => void) => {
      set({ navigationCallback: callback });
    },

    loadConversationsFromHistory: async () => {
      set({ isLoading: true });
      try {
        const apiConversations = await fetchConversations();

        // Convert API response to internal format
        const conversations: Conversation[] = apiConversations.map(
          convertApiConversation
        );

        set({
          conversations,
          isLoading: false,
        });
      } catch (error) {
        console.error("Error loading conversations from history:", error);
        set({ isLoading: false });
      }
    },

    createConversation: async () => {
      try {
        const response = await startNewChat();
        if (response?.chatId) {
          const newConversation: Conversation = {
            id: response.chatId,
            title: "New Conversation",
            messages: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };

          set((state) => ({
            conversations: [newConversation, ...state.conversations],
            currentConversationId: newConversation.id,
          }));

          // Navigate to the new conversation with full path
          const state = get();
          if (state.navigationCallback) {
            state.navigationCallback(`/chat/${newConversation.id}`);
          }
        } else {
          console.error("Failed to start new chat - no chatId received");
        }
      } catch (error) {
        console.error("Error creating new conversation:", error);
      }
    },

    deleteConversation: (id: string) => {
      set((state) => {
        const updatedConversations = state.conversations.filter(
          (c) => c.id !== id
        );
        let newCurrentId = state.currentConversationId;

        // If we deleted the current conversation, select another one
        if (state.currentConversationId === id) {
          newCurrentId =
            updatedConversations.length > 0 ? updatedConversations[0].id : null;
        }

        return {
          conversations: updatedConversations,
          currentConversationId: newCurrentId,
        };
      });
    },

    selectConversation: (id: string) => {
      set({ currentConversationId: id });

      // Navigate to the conversation with full path (only if not already there)
      const state = get();
      if (state.navigationCallback) {
        // Don't navigate if we're already on this conversation's URL
        const currentPath = window.location.pathname;
        const targetPath = `/chat/${id}`;
        if (currentPath !== targetPath) {
          state.navigationCallback(targetPath);
        }
      }
    },

    selectConversationWithoutNavigation: (id: string) => {
      set({ currentConversationId: id });
    },

    addMessageToCurrentConversation: (message: Message) => {
      set((state) => {
        const updatedConversations = state.conversations.map((conv) => {
          if (conv.id === state.currentConversationId) {
            const updatedMessages = [...conv.messages, message];
            return {
              ...conv,
              messages: updatedMessages,
              title:
                conv.title === "New Conversation"
                  ? generateConversationTitle(updatedMessages)
                  : conv.title,
              updatedAt: Date.now(),
            };
          }
          return conv;
        });

        return { conversations: updatedConversations };
      });
    },

    updateConversationTitle: (id: string, title: string) => {
      set((state) => ({
        conversations: state.conversations.map((conv) =>
          conv.id === id ? { ...conv, title, updatedAt: Date.now() } : conv
        ),
      }));
    },

    getCurrentConversation: () => {
      const state = get();
      return (
        state.conversations.find((c) => c.id === state.currentConversationId) ||
        null
      );
    },

    sendMessage: async (content: string) => {
      const state = get();
      const currentConversation = state.conversations.find(
        (c) => c.id === state.currentConversationId
      );

      if (!currentConversation) {
        console.error("No current conversation selected");
        return;
      }

      // Add user message to current conversation
      const userMessage: Message = {
        key: Date.now().toString(),
        role: "user",
        content: content.trim(),
        timestamp: Date.now(),
      };

      // Add user message to store
      get().addMessageToCurrentConversation(userMessage);

      try {
        // Send message to API
        const response = await sendChatMessage(
          currentConversation.id,
          content.trim()
        );

        if (response?.reply) {
          // Add assistant response to conversation
          const assistantMessage: Message = {
            key: (Date.now() + 1).toString(),
            role: "assistant",
            content: response.reply,
            timestamp: Date.now(),
          };

          get().addMessageToCurrentConversation(assistantMessage);
        } else {
          console.error("No reply received from API");
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
  };
});
