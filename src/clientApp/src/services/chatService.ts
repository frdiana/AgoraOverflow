import { apiRequest } from "./apiService";

// API interfaces to match new API response
export interface ApiMessage {
  id: string;
  content: string;
  timestamp: string; // ISO string
  sender: "User" | "Agent";
}

export interface ApiConversation {
  id: string;
  name: string;
  messages: ApiMessage[];
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// API interface for starting a new chat
export interface StartChatResponse {
  chatId: string;
}

// API interface for sending a message
export interface SendMessageRequest {
  userMessage: string;
}

export interface SendMessageResponse {
  reply: string;
  fromAgent: string;
}

// Function to fetch conversations with full data including messages
export const fetchConversations = async (): Promise<ApiConversation[]> => {
  try {
    return await apiRequest<ApiConversation[]>("/conversations/history");
  } catch (error) {
    console.error("Failed to fetch conversations:", error);
    return [];
  }
};

// Function to start a new chat
export const startNewChat = async (): Promise<StartChatResponse | null> => {
  try {
    return await apiRequest<StartChatResponse>("/conversations/start", {
      method: "POST",
    });
  } catch (error) {
    console.error("Failed to start new chat:", error);
    return null;
  }
};

// Function to send a message to a chat
export const sendChatMessage = async (
  conversationId: string,
  userMessage: string
): Promise<SendMessageResponse | null> => {
  try {
    return await apiRequest<SendMessageResponse>(
      `/conversations/${conversationId}/ask`,
      {
        method: "POST",
        body: JSON.stringify({ userMessage }),
      }
    );
  } catch (error) {
    console.error("Failed to send chat message:", error);
    return null;
  }
};
