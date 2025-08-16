import React, { useState, useRef, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Bubble, Sender } from "@ant-design/x";
import { UserOutlined, RobotOutlined } from "@ant-design/icons";
import { Alert, Flex } from "antd";
import ConversationsSidebar from "../components/ConversationsSidebar";
import { useConversationsStore } from "../stores/conversationsStore";
import "./ChatPage.css";

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
                backgroundColor: isUser
                  ? "linear-gradient(135deg, #52c41a 0%, #73d13d 100%)"
                  : "linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)",
                color: "#ffffff",
                borderRadius: "12px",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
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
    <div className="chat-container" style={{ position: "relative" }}>
      {/* Conversations Sidebar */}
      <ConversationsSidebar />

      {/* Main Chat Area */}
      <div className="chat-main-area">
        {/* Header */}
        <div className="chat-header">
          <h2>
            {conversationsLoading
              ? "Loading conversations..."
              : currentConversation?.title || "Chat Assistant"}
          </h2>
          <p>
            {conversationsLoading
              ? "Please wait while we load your chat history"
              : currentConversation
              ? `${bubbleMessages.length} messages in this conversation`
              : "No conversation selected"}
          </p>
        </div>

        {/* Error Alert */}
        {conversationError && (
          <div className="error-alert-container">
            <Alert
              message="Conversation Not Found"
              description={conversationError}
              type="error"
              showIcon
              closable
              onClose={() => setConversationError(null)}
              style={{
                borderRadius: "12px",
                border: "1px solid #ffccc7",
                background: "linear-gradient(135deg, #fff2f0 0%, #ffffff 100%)",
              }}
            />
          </div>
        )}

        {/* Messages Container */}
        <div className="messages-container">
          {conversationsLoading ? (
            <div className="loading-container">
              <span className="loading-spinner">Loading chat history...</span>
            </div>
          ) : (
            <div style={{ flex: 1, minHeight: 0 }}>
              <div className="messages-scroll-area">
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
        <div className="chat-input-container">
          <Sender
            placeholder={
              conversationsLoading
                ? "Loading conversations..."
                : currentConversation
                ? "Type your message here..."
                : "Select a conversation to start chatting..."
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
