import { create } from "zustand";

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
  createConversation: () => void;
  deleteConversation: (id: string) => void;
  selectConversation: (id: string) => void;
  addMessageToCurrentConversation: (message: Message) => void;
  updateConversationTitle: (id: string, title: string) => void;
  getCurrentConversation: () => Conversation | null;
}

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
  // Initial conversations with demo data
  const initialConversations: Conversation[] = [
    {
      id: "1",
      title: "Welcome to AgoraOverflow",
      messages: [
        {
          key: "1",
          role: "assistant",
          content:
            "Hello! Welcome to AgoraOverflow. I'm your AI assistant. How can I help you today?",
          timestamp: Date.now() - 120000, // 2 minutes ago
        },
        {
          key: "2",
          role: "user",
          content: "What is AgoraOverflow?",
          timestamp: Date.now() - 60000, // 1 minute ago
        },
        {
          key: "3",
          role: "assistant",
          content:
            "AgoraOverflow is an AI-powered chat platform built with React, Ant Design, and Zustand. It features multiple conversations, real-time messaging, and a clean, modern interface.",
          timestamp: Date.now() - 30000, // 30 seconds ago
        },
      ],
      createdAt: Date.now() - 180000, // 3 minutes ago
      updatedAt: Date.now() - 30000,
    },
    {
      id: "2",
      title: "React Development Tips",
      messages: [
        {
          key: "4",
          role: "assistant",
          content: "Hello! I can help you with React development questions.",
          timestamp: Date.now() - 86400000, // 1 day ago
        },
        {
          key: "5",
          role: "user",
          content: "What are the best practices for React state management?",
          timestamp: Date.now() - 86300000,
        },
        {
          key: "6",
          role: "assistant",
          content:
            "Great question! For React state management, I recommend: 1) Use local state (useState) for component-specific data, 2) Use Zustand or Redux for global state, 3) Consider React Query for server state, and 4) Keep state as close to where it's used as possible.",
          timestamp: Date.now() - 86200000,
        },
      ],
      createdAt: Date.now() - 86400000,
      updatedAt: Date.now() - 86200000,
    },
    {
      id: "3",
      title: "TypeScript Best Practices",
      messages: [
        {
          key: "7",
          role: "assistant",
          content: "I'm here to help with TypeScript questions!",
          timestamp: Date.now() - 172800000, // 2 days ago
        },
      ],
      createdAt: Date.now() - 172800000,
      updatedAt: Date.now() - 172800000,
    },
  ];

  return {
    conversations: initialConversations,
    currentConversationId: "1",

    createConversation: () => {
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title: "New Conversation",
        messages: [
          {
            key: Date.now().toString(),
            role: "assistant",
            content: "Hello! How can I help you today?",
            timestamp: Date.now(),
          },
        ],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      set((state) => ({
        conversations: [newConversation, ...state.conversations],
        currentConversationId: newConversation.id,
      }));
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
  };
});
