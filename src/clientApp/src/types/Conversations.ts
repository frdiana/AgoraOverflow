export interface ConversationMessage {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  messages: ConversationMessage[];
}

export interface AgentReply {
  response: string;
  agentName: string;
}
