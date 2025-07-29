import React, { useState, useRef, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Bubble, Sender } from "@ant-design/x";
import { UserOutlined, RobotOutlined } from "@ant-design/icons";
import { Alert, Flex } from "antd";
import ConversationsSidebar from "../components/ConversationsSidebar";
import { useConversationsStore } from "../stores/conversationsStore";

const ChatPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [conversationError, setConversationError] = useState<string | null>(
    null
  );
  const [inputValue, setInputValue] = useState("");
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

  // Convert internal messages to Bubble format
  const bubbleMessages = useMemo(() => {
    if (!currentConversation?.messages) return [];

    return currentConversation.messages.map((message, index) => {
      const isUser = message.role === "user";
      const prevMessage =
        index > 0 ? currentConversation.messages[index - 1] : null;
      const isSameRoleAsPrevious = prevMessage?.role === message.role;

      return {
        key: message.key,
        placement: isUser ? ("end" as const) : ("start" as const),
        content: message.content,
        avatar: isSameRoleAsPrevious
          ? {} // Empty avatar for consecutive messages from same role
          : {
              icon: isUser ? <UserOutlined /> : <RobotOutlined />,
              style: {
                backgroundColor: isUser ? "#52c41a" : "#1890ff",
                color: "#fff",
              },
            },
        styles: isSameRoleAsPrevious
          ? {
              avatar: { visibility: "hidden" as const },
            }
          : undefined,
        timestamp: message.timestamp,
      };
    });
  }, [currentConversation?.messages]);

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
  }, [bubbleMessages, loading]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    setLoading(true);
    try {
      await sendMessage(content);
      setInputValue(""); // Clear the input after successful message sending
    } catch (error) {
      console.error("Error sending message:", error);
      throw error; // Re-throw to prevent clearing input on error
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
              ? `${bubbleMessages.length} messages in this conversation`
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
            display: "flex",
            flexDirection: "column",
            minHeight: 0, // Allows flex child to shrink
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
            <div style={{ flex: 1, minHeight: 0 }}>
              <div
                style={{
                  height: "100%",
                  padding: "16px 24px",
                  overflowY: "auto",
                }}
              >
                <Flex gap="small" vertical>
                  {bubbleMessages.map((bubble) => (
                    <Bubble
                      key={bubble.key}
                      placement={bubble.placement}
                      content={bubble.content}
                      avatar={bubble.avatar}
                      styles={bubble.styles}
                    />
                  ))}
                </Flex>
              </div>
              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>
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
            placeholder={
              conversationsLoading
                ? "Loading conversations..."
                : "Type your message here..."
            }
            value={inputValue}
            onChange={(text) => setInputValue(text)}
            onSubmit={async (text) => {
              await handleSendMessage(text);
            }}
            loading={loading}
            disabled={conversationsLoading || !currentConversation}
            style={{ width: "100%" }}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
