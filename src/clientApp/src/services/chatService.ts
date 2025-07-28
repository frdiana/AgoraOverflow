import { apiRequest } from "./apiService";

// API interface for chat history
export interface ChatHistoryItem {
  conversationName: string;
  conversationId: string;
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

// Function to fetch chat history from API
export const fetchChatHistory = async (): Promise<ChatHistoryItem[]> => {
  try {
    return await apiRequest<ChatHistoryItem[]>("/chat/history");
  } catch (error) {
    console.error("Failed to fetch chat history:", error);
    return [];
  }
};

// Function to start a new chat
export const startNewChat = async (): Promise<StartChatResponse | null> => {
  try {
    return await apiRequest<StartChatResponse>("/chat/start", {
      method: "POST",
    });
  } catch (error) {
    console.error("Failed to start new chat:", error);
    return null;
  }
};

// Function to send a message to a chat
export const sendChatMessage = async (
  chatId: string,
  userMessage: string
): Promise<SendMessageResponse | null> => {
  try {
    return await apiRequest<SendMessageResponse>(`/chat/${chatId}/ask`, {
      method: "POST",
      body: JSON.stringify({ userMessage }),
    });
  } catch (error) {
    console.error("Failed to send chat message:", error);
    return null;
  }
};
