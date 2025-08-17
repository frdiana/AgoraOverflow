import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface Agent {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  avatar?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "agent";
  agentId?: string;
  agentName?: string;
  agentIcon?: React.ReactNode;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  lastMessage?: Date;
  agents: Agent[];
}
