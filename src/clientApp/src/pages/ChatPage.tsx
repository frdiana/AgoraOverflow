import React, { useState, useRef, useEffect, useMemo } from "react";
import { Sender } from "@ant-design/x";
import { UserOutlined, RobotOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import ConversationsSidebar from "../components/ConversationsSidebar";
import {
  useConversationsStore,
  type Message,
} from "../stores/conversationsStore";

const ChatPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use conversations store instead of local state
  const { getCurrentConversation, addMessageToCurrentConversation } =
    useConversationsStore();

  const currentConversation = getCurrentConversation();
  const messages = useMemo(
    () => currentConversation?.messages || [],
    [currentConversation?.messages]
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Add user message to current conversation
    const userMessage: Message = {
      key: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: Date.now(),
    };

    addMessageToCurrentConversation(userMessage);
    setLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "That's an interesting question! Let me help you with that.",
        "I understand what you're asking. Here's what I think...",
        "Great question! Based on what you've shared, I'd suggest...",
        "Thanks for sharing that. Here's my perspective on this topic.",
        "I can definitely help you with that. Let me explain...",
      ];

      const assistantMessage: Message = {
        key: (Date.now() + 1).toString(),
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: Date.now(),
      };

      addMessageToCurrentConversation(assistantMessage);
      setLoading(false);
    }, 1500);
  };

  return (
    <div
      style={{
        height: "calc(100vh - 120px)",
        display: "flex",
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        overflow: "hidden",
        minWidth: 0, // Prevents flex items from overflowing
      }}
    >
      {/* Conversations Sidebar */}
      <ConversationsSidebar />

      {/* Main Chat Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0, // Prevents overflow
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 24px",
            borderBottom: "1px solid #f0f0f0",
            background: "#fafafa",
            flexShrink: 0,
          }}
        >
          <h2 style={{ margin: 0, color: "#1890ff" }}>
            {currentConversation?.title || "Chat Assistant"}
          </h2>
          <p style={{ margin: "4px 0 0 0", color: "#666" }}>
            {currentConversation
              ? `${messages.length} messages in this conversation`
              : "No conversation selected"}
          </p>
        </div>

        {/* Messages Container */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px 24px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {messages.map((message) => (
            <div
              key={message.key}
              style={{
                display: "flex",
                marginBottom: "16px",
                alignItems: "flex-start",
                gap: "12px",
                justifyContent:
                  message.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              {message.role === "assistant" && (
                <Avatar
                  icon={<RobotOutlined />}
                  style={{ backgroundColor: "#1890ff" }}
                />
              )}

              <div
                style={{
                  maxWidth: "70%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  backgroundColor:
                    message.role === "user" ? "#1890ff" : "#f5f5f5",
                  color: message.role === "user" ? "white" : "#000",
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 500,
                    marginBottom: "4px",
                  }}
                >
                  {message.role === "user" ? "You" : "Assistant"}
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 400,
                      marginLeft: "8px",
                      opacity: 0.7,
                    }}
                  >
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <div>{message.content}</div>
              </div>

              {message.role === "user" && (
                <Avatar
                  icon={<UserOutlined />}
                  style={{ backgroundColor: "#52c41a" }}
                />
              )}
            </div>
          ))}

          {loading && (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Avatar
                icon={<RobotOutlined />}
                style={{ backgroundColor: "#1890ff" }}
              />
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: "12px",
                  backgroundColor: "#f5f5f5",
                  color: "#666",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <span>Assistant is typing</span>
                <span
                  style={{
                    animation: "pulse 1.5s ease-in-out infinite",
                    display: "inline-block",
                  }}
                >
                  ⋯
                </span>
              </div>
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar - Sticky to bottom */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid #f0f0f0",
            background: "#fff",
            flexShrink: 0,
          }}
        >
          <Sender
            placeholder="Type your message here..."
            onSubmit={(text) => {
              handleSendMessage(text);
              return Promise.resolve();
            }}
            loading={loading}
            style={{ width: "100%" }}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
