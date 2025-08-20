import type { Conversation, AgentReply } from "../types/Conversations";

import axios from "axios";

const BASE_API_PATH = import.meta.env.VITE_API_BASE_PATH;

export const getAllConversations = async (): Promise<Conversation[]> => {
  const response = await axios.get(`${BASE_API_PATH}/conversations/history`);

  // Return array of conversations from API
  return response.data as Conversation[];
};

export const getConversationHistory = async (
  conversationId: string
): Promise<Conversation> => {
  const response = await axios.get(
    `${BASE_API_PATH}/conversations/${conversationId}/history`
  );

  // Directly return as Conversation, assuming API matches TS type
  return response.data as Conversation;
};

export const startNewConversation = async (
  userId: string,
  initialMessage: string
): Promise<string> => {
  const response = await axios.post(`${BASE_API_PATH}/conversations/start`, {
    userId,
    initialMessage,
  });

  // API returns an object with ChatId property
  return response.data.chatId || response.data.ChatId;
};

export const replyToUser = async (
  conversationId: string,
  message: string
): Promise<AgentReply> => {
  const response = await axios.post(
    `${BASE_API_PATH}/conversations/${conversationId}/ask`,
    {
      userMessage: message,
    }
  );

  // Map API response to AgentReply
  return {
    response: response.data.reply,
    agentName: response.data.agentName ?? "Agent",
  };
};
