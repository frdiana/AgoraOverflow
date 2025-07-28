import React, { useState, useRef, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Sender } from "@ant-design/x";
import { UserOutlined, RobotOutlined } from "@ant-design/icons";
import { Avatar, Alert } from "antd";
import ConversationsSidebar from "../components/ConversationsSidebar";
import { useConversationsStore } from "../stores/conversationsStore";

const ChatPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [conversationError, setConversationError] = useState<string | null>(
    null
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();

  // Use conversations store instead of local state
  const {
    conversations,
    getCurrentConversation,
    loadConversationsFromHistory,
    sendMessage,
    selectConversation,
    selectConversationWithoutNavigation,
    setNavigationCallback,
    isLoading: conversationsLoading,
  } = useConversationsStore();

  const currentConversation = getCurrentConversation();
  const messages = useMemo(
    () => currentConversation?.messages || [],
    [currentConversation?.messages]
  );

  // Load conversations from API on component mount
  useEffect(() => {
    setConversationError(null); // Clear any previous error when loading
    loadConversationsFromHistory();
  }, [loadConversationsFromHistory]);

  // Handle chatId parameter from URL - only after conversations are loaded
  useEffect(() => {
    // Only proceed if we have a chatId and conversations have finished loading
    if (chatId && !conversationsLoading) {
      if (conversations.length === 0) {
        // No conversations available
        setConversationError(
          `No conversations available. Unable to load conversation "${chatId}".`
        );
        return;
      }

      // Check if the conversation exists in our loaded conversations
      const conversationExists = conversations.some(
        (conv) => conv.id === chatId
      );

      if (conversationExists) {
        selectConversationWithoutNavigation(chatId); // Use non-navigation method since we're already on the URL
        setConversationError(null); // Clear any previous error
      } else {
        // Conversation doesn't exist, show error but DON'T redirect
        setConversationError(`Conversation "${chatId}" not found.`);
      }
    }
  }, [
    chatId,
    selectConversationWithoutNavigation,
    conversations,
    conversationsLoading,
  ]);

  // Set up navigation callback for the store
  useEffect(() => {
    setNavigationCallback(navigate);
  }, [navigate, setNavigationCallback]);

  // Auto-select first conversation when there's no chatId in URL and conversations are loaded
  useEffect(() => {
    if (
      !chatId &&
      conversations.length > 0 &&
      !conversationsLoading &&
      !conversationError
    ) {
      const firstConversation = conversations[0];
      selectConversation(firstConversation.id);
    }
  }, [
    chatId,
    conversations,
    conversationsLoading,
    conversationError,
    selectConversation,
  ]);

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

    setLoading(true);
    try {
      await sendMessage(content);
      setInputValue(""); // Clear the input field
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
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
            {conversationsLoading
              ? "Loading conversations..."
              : currentConversation?.title || "Chat Assistant"}
          </h2>
          <p style={{ margin: "4px 0 0 0", color: "#666" }}>
            {conversationsLoading
              ? "Please wait while we load your chat history"
              : currentConversation
              ? `${messages.length} messages in this conversation`
              : "No conversation selected"}
          </p>
        </div>

        {/* Error Alert */}
        {conversationError && (
          <div style={{ padding: "0 24px 16px 24px" }}>
            <Alert
              message="Conversation Not Found"
              description={conversationError}
              type="error"
              showIcon
              closable
              onClose={() => setConversationError(null)}
            />
          </div>
        )}

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
          {conversationsLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                color: "#666",
              }}
            >
              Loading chat history...
            </div>
          ) : (
            <>
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
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
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
            </>
          )}
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
            value={inputValue}
            onChange={setInputValue}
            placeholder={
              conversationsLoading
                ? "Loading conversations..."
                : "Type your message here..."
            }
            onSubmit={(text) => {
              handleSendMessage(text);
              return Promise.resolve();
            }}
            loading={loading}
            disabled={conversationsLoading}
            style={{ width: "100%" }}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
