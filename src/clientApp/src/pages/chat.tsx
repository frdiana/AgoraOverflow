import type { AgentReply } from "@/types/Conversations";

import { useState, useRef, useEffect } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody } from "@heroui/card";
import { Avatar } from "@heroui/avatar";

import {
  PlusIcon,
  SendIcon,
  UserIcon,
  BotIcon,
  ChatIcon,
} from "@/components/icons";
import DefaultLayout from "@/layouts/default";
import { ChatMessage, Conversation, Agent } from "@/types";
import {
  getAllConversations,
  startNewConversation,
  replyToUser,
} from "@/services/ConversationsService";

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Helper function to extract unique agents from conversations
  const extractUniqueAgents = (conversations: Conversation[]): Agent[] => {
    const agentNames = new Set<string>();

    conversations.forEach((conv) => {
      conv.messages.forEach((msg) => {
        if (msg.sender === "agent" && msg.agentName) {
          agentNames.add(msg.agentName);
        }
      });
    });

    // Convert agent names to Agent objects
    return Array.from(agentNames).map((name, index) => ({
      id: `agent-${index + 1}`,
      name: name,
      description: `AI Assistant - ${name}`,
      capabilities: ["chat", "assistance"],
    }));
  };

  // Helper function to get agents involved in a specific conversation
  const getConversationAgents = (
    conversation: Conversation,
    allAgents: Agent[]
  ): Agent[] => {
    const conversationAgentNames = new Set<string>();

    conversation.messages.forEach((msg) => {
      if (msg.sender === "agent" && msg.agentName) {
        conversationAgentNames.add(msg.agentName);
      }
    });

    return allAgents.filter((agent) => conversationAgentNames.has(agent.name));
  };

  // Load all conversations on page load
  useEffect(() => {
    const loadAllConversations = async () => {
      try {
        setIsLoading(true);
        const apiConversations = await getAllConversations();

        // Convert API conversations to UI format
        const uiConversations: Conversation[] = apiConversations.map(
          (apiConv) => ({
            id: apiConv.id,
            title: `Conversation ${apiConv.id.slice(0, 8)}`, // Generate title from ID
            agents: [], // Will be populated after extracting all agents
            lastMessage:
              apiConv.messages.length > 0
                ? new Date(
                    apiConv.messages[apiConv.messages.length - 1].timestamp
                  )
                : new Date(),
            messages: apiConv.messages.map((msg) => ({
              id: msg.id,
              content: msg.content,
              sender: msg.sender.toLowerCase() === "user" ? "user" : "agent",
              timestamp: new Date(msg.timestamp),
              agentName: msg.sender !== "User" ? msg.sender : undefined,
              agentId: msg.sender !== "User" ? "agent-1" : undefined,
            })) as ChatMessage[],
          })
        );

        // Extract all unique agents from conversations
        const allAgents = extractUniqueAgents(uiConversations);

        // Populate agents for each conversation
        const conversationsWithAgents = uiConversations.map((conv) => ({
          ...conv,
          agents: getConversationAgents(conv, allAgents),
        }));

        setConversations(conversationsWithAgents);
        // Set first conversation as active if available
        if (conversationsWithAgents.length > 0) {
          setActiveConversation(conversationsWithAgents[0]);
        }
      } catch (error) {
        console.error("Failed to load conversations:", error);
        // Fallback to empty state if API fails
        setConversations([]);
        setActiveConversation(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllConversations();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !activeConversation) return;

    const currentMessage = inputMessage;

    setInputMessage("");

    // Add user message to the conversation immediately
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      content: currentMessage,
      sender: "user",
      timestamp: new Date(),
    };

    const conversationWithUserMessage = {
      ...activeConversation,
      messages: [...activeConversation.messages, newMessage],
      lastMessage: new Date(),
    };

    setConversations((convs) =>
      convs.map((conv) =>
        conv.id === activeConversation.id ? conversationWithUserMessage : conv
      )
    );
    setActiveConversation(conversationWithUserMessage);

    try {
      // Call replyToUser API with the stored conversation ID
      const agentResponse: AgentReply = await replyToUser(
        activeConversation.id,
        currentMessage
      );

      const agentMessage: ChatMessage = {
        id: `msg-${Date.now()}-agent`,
        content: agentResponse.response,
        sender: "agent",
        agentId: "agent-1",
        agentName: agentResponse.agentName,
        timestamp: new Date(),
      };

      const responseUpdatedConversation = {
        ...conversationWithUserMessage,
        messages: [...conversationWithUserMessage.messages, agentMessage],
        lastMessage: new Date(),
      };

      // Update agents list if a new agent appeared
      const updatedAgents = extractUniqueAgents([responseUpdatedConversation]);

      responseUpdatedConversation.agents = updatedAgents;

      setConversations((convs) =>
        convs.map((conv) =>
          conv.id === activeConversation.id ? responseUpdatedConversation : conv
        )
      );
      setActiveConversation(responseUpdatedConversation);
    } catch (error) {
      console.error("Failed to send message:", error);

      // Show fallback response if API fails
      const fallbackResponse: ChatMessage = {
        id: `msg-${Date.now()}-fallback`,
        content:
          "Sorry, I'm having trouble responding right now. Please try again.",
        sender: "agent",
        agentId: "agent-1",
        agentName: "AgentManager",
        timestamp: new Date(),
      };

      const fallbackUpdatedConversation = {
        ...conversationWithUserMessage,
        messages: [...conversationWithUserMessage.messages, fallbackResponse],
        lastMessage: new Date(),
      };

      setConversations((convs) =>
        convs.map((conv) =>
          conv.id === activeConversation.id ? fallbackUpdatedConversation : conv
        )
      );
      setActiveConversation(fallbackUpdatedConversation);
    }
  };

  const handleNewChat = async () => {
    try {
      // Call startNewConversation API immediately with a default message
      const conversationId = await startNewConversation("user123", "Hello");

      // Ensure conversationId is a string
      const idString =
        typeof conversationId === "string"
          ? conversationId
          : String(conversationId);

      // Create a new conversation with the real ID from API
      const newConversation: Conversation = {
        id: idString,
        title: `Conversation ${idString.slice(0, 8)}`,
        agents: [], // Will be populated when agent messages are received
        messages: [
          {
            id: `msg-${Date.now()}`,
            content: "Hello there! How can I assist you today?",
            sender: "agent",
            agentName: "AgentManager",
            agentId: "agent-1",
            timestamp: new Date(),
          },
        ],
        lastMessage: new Date(),
      };

      // Extract agents from the initial message
      const conversationAgents = extractUniqueAgents([newConversation]);

      newConversation.agents = conversationAgents;

      setConversations([newConversation, ...conversations]);
      setActiveConversation(newConversation);
    } catch (error) {
      console.error("Failed to create new conversation:", error);
      alert("Failed to start new conversation. Please try again.");
    }
  };

  const getAgentIcon = (agentId: string) => {
    switch (agentId) {
      case "agent-1":
        return <BotIcon className="text-blue-500" size={20} />;
      case "agent-2":
        return <BotIcon className="text-green-500" size={20} />;
      case "agent-3":
        return <BotIcon className="text-purple-500" size={20} />;
      default:
        return <BotIcon className="text-gray-500" size={20} />;
    }
  };

  return (
    <DefaultLayout>
      <div className="flex h-[calc(100vh-8rem)] gap-4">
        {/* Sidebar - 30% width */}
        <div className="w-[30%] flex flex-col gap-4">
          {/* New Chat Button */}
          <Button
            className="w-full"
            color="primary"
            startContent={<PlusIcon size={16} />}
            variant="bordered"
            onPress={handleNewChat}
          >
            New Chat
          </Button>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto space-y-2">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
                  <p className="text-sm text-default-500">
                    Loading conversations...
                  </p>
                </div>
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <p className="text-sm text-default-500">
                  No conversations found
                </p>
              </div>
            ) : (
              conversations.map((conversation) => (
                <Card
                  key={conversation.id}
                  isPressable
                  className={`cursor-pointer transition-all hover:scale-[1.02] ${
                    activeConversation?.id === conversation.id
                      ? "border-primary shadow-md"
                      : "hover:shadow-sm"
                  }`}
                  onPress={() => setActiveConversation(conversation)}
                >
                  <CardBody className="px-3 py-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <ChatIcon
                          className="text-default-400 flex-shrink-0"
                          size={16}
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate">
                            {conversation.title}
                          </h3>
                          <p className="text-xs text-default-400 truncate">
                            {conversation.messages.length} messages •{" "}
                            {conversation.lastMessage?.toLocaleDateString()}{" "}
                            {conversation.lastMessage?.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Chat Area - 70% width */}
        <div className="w-[70%] flex flex-col">
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="border-b border-divider p-4">
                <h2 className="font-semibold text-lg">
                  {activeConversation.title}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-default-500">
                    Active agents:
                  </span>
                  {activeConversation.agents.map((agent) => (
                    <div key={agent.id} className="flex items-center gap-1">
                      {getAgentIcon(agent.id)}
                      <span className="text-xs font-medium">{agent.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {activeConversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    {message.sender === "agent" && (
                      <div className="flex-shrink-0">
                        <Avatar
                          className="bg-default-100"
                          icon={getAgentIcon(message.agentId!)}
                          size="sm"
                        />
                      </div>
                    )}
                    <div
                      className={`max-w-[70%] ${
                        message.sender === "user" ? "order-1" : ""
                      }`}
                    >
                      {message.sender === "agent" && (
                        <p className="text-xs text-default-500 mb-1 font-medium">
                          {message.agentName}
                        </p>
                      )}
                      <Card
                        className={`${
                          message.sender === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-default-100"
                        }`}
                      >
                        <CardBody className="p-3">
                          <p className="text-sm whitespace-pre-wrap">
                            {message.content}
                          </p>
                          <p
                            className={`text-xs mt-2 ${
                              message.sender === "user"
                                ? "text-primary-foreground/70"
                                : "text-default-400"
                            }`}
                          >
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </CardBody>
                      </Card>
                    </div>
                    {message.sender === "user" && (
                      <div className="flex-shrink-0">
                        <Avatar
                          className="bg-primary/10 text-primary"
                          icon={<UserIcon size={16} />}
                          size="sm"
                        />
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="border-t border-divider p-4">
                <div className="flex gap-2">
                  <Input
                    className="flex-1"
                    placeholder="Type your message..."
                    value={inputMessage}
                    variant="bordered"
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    onValueChange={setInputMessage}
                  />
                  <Button
                    isIconOnly
                    color="primary"
                    isDisabled={!inputMessage.trim()}
                    onPress={handleSendMessage}
                  >
                    <SendIcon size={16} />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ChatIcon className="mx-auto mb-4 text-default-300" size={48} />
                <h3 className="text-lg font-medium text-default-500 mb-2">
                  No conversation selected
                </h3>
                <p className="text-default-400">
                  Select a conversation or start a new chat
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}
