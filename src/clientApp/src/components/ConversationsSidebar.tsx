import React, { useState } from "react";
import {
  List,
  Button,
  Typography,
  Space,
  Popconfirm,
  Input,
  Tooltip,
  Empty,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  MessageOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  useConversationsStore,
  type Conversation,
} from "../stores/conversationsStore";
import "../pages/ChatPage.css";

const { Text } = Typography;

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onUpdateTitle: (title: string) => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isActive,
  onSelect,
  onDelete,
  onUpdateTitle,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(conversation.title);

  const handleSaveTitle = () => {
    if (editTitle.trim()) {
      onUpdateTitle(editTitle.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(conversation.title);
    setIsEditing(false);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <List.Item
      className="conversation-item"
      style={{
        padding: "8px 12px",
        marginBottom: "2px",
        borderRadius: "8px",
        backgroundColor: isActive ? "#2a2a2a" : "transparent",
        border: "none",
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = "#2a2a2a";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = "transparent";
        }
      }}
      onClick={isEditing ? undefined : onSelect}
      actions={
        !isEditing
          ? [
              <Tooltip title="Edit title" key="edit">
                <Button
                  type="text"
                  size="small"
                  icon={<EditOutlined />}
                  style={{
                    borderRadius: "4px",
                    color: "#8e8ea0",
                    transition: "all 0.2s ease",
                    width: "20px",
                    height: "20px",
                    padding: "0",
                    background: "transparent",
                    border: "none",
                    opacity: 0,
                  }}
                  className="conversation-action"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                />
              </Tooltip>,
              <Tooltip title="Delete conversation" key="delete">
                <Popconfirm
                  title="Delete conversation"
                  description="Are you sure you want to delete this conversation?"
                  onConfirm={(e) => {
                    e?.stopPropagation();
                    onDelete();
                  }}
                  okText="Yes"
                  cancelText="No"
                  onCancel={(e) => e?.stopPropagation()}
                >
                  <Button
                    type="text"
                    size="small"
                    icon={<DeleteOutlined />}
                    danger
                    style={{
                      borderRadius: "4px",
                      color: "#8e8ea0",
                      transition: "all 0.2s ease",
                      width: "20px",
                      height: "20px",
                      padding: "0",
                      background: "transparent",
                      border: "none",
                      opacity: 0,
                    }}
                    className="conversation-action"
                    onClick={(e) => e.stopPropagation()}
                  />
                </Popconfirm>
              </Tooltip>,
            ]
          : [
              <Button
                key="save"
                type="text"
                size="small"
                icon={<CheckOutlined />}
                style={{
                  color: "#10a37f",
                  background: "transparent",
                  border: "none",
                  width: "20px",
                  height: "20px",
                  padding: "0",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSaveTitle();
                }}
              />,
              <Button
                key="cancel"
                type="text"
                size="small"
                icon={<CloseOutlined />}
                style={{
                  color: "#8e8ea0",
                  background: "transparent",
                  border: "none",
                  width: "20px",
                  height: "20px",
                  padding: "0",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancelEdit();
                }}
              />,
            ]
      }
    >
      <List.Item.Meta
        avatar={
          <div
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "4px",
              background: isActive ? "#10a37f" : "#404040",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
          >
            <MessageOutlined
              style={{
                color: "#ececec",
                fontSize: "10px",
              }}
            />
          </div>
        }
        title={
          isEditing ? (
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onPressEnter={handleSaveTitle}
              onBlur={handleSaveTitle}
              autoFocus
              size="small"
              onClick={(e) => e.stopPropagation()}
              style={{
                borderRadius: "4px",
                border: "1px solid #404040",
                background: "#2f2f2f",
                color: "#ececec",
                fontSize: "13px",
              }}
            />
          ) : (
            <Text
              style={{
                color: isActive ? "#ececec" : "#b3b3b3",
                fontWeight: isActive ? 500 : 400,
                fontSize: "13px",
                lineHeight: "16px",
              }}
              ellipsis={{ tooltip: conversation.title }}
            >
              {conversation.title}
            </Text>
          )
        }
        description={null}
      />
    </List.Item>
  );
};

const ConversationsSidebar: React.FC = () => {
  const {
    conversations,
    currentConversationId,
    createConversation,
    deleteConversation,
    selectConversation,
    updateConversationTitle,
    isLoading,
  } = useConversationsStore();

  return (
    <div className="chat-sidebar">
      {/* Header */}
      <div
        style={{
          padding: "16px",
          borderBottom: "1px solid #404040",
          background: "#171717",
          position: "relative",
        }}
      >
        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <Typography.Title
            level={4}
            style={{
              margin: 0,
              color: "#ececec",
              fontWeight: 600,
              fontSize: "16px",
            }}
          >
            Conversations
          </Typography.Title>
          <Tooltip title="New conversation">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={createConversation}
              size="small"
              disabled={isLoading}
              style={{
                background: "#2f2f2f",
                border: "1px solid #404040",
                borderRadius: "6px",
                height: "28px",
                fontWeight: 400,
                boxShadow: "none",
                color: "#ececec",
              }}
            >
              New
            </Button>
          </Tooltip>
        </Space>
      </div>

      {/* Conversations List */}
      <div className="conversations-list-container">
        {isLoading ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
              color: "#8e8ea0",
              fontSize: "14px",
              fontWeight: 400,
            }}
          >
            <div
              style={{
                animation: "pulse 1.5s ease-in-out infinite",
                marginBottom: "12px",
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: "#404040",
              }}
            />
            Loading conversations...
          </div>
        ) : conversations.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span style={{ color: "#8e8ea0", fontSize: "14px" }}>
                No conversations yet
              </span>
            }
            style={{ marginTop: "80px" }}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={createConversation}
              style={{
                background: "#2f2f2f",
                border: "1px solid #404040",
                borderRadius: "6px",
                height: "32px",
                fontWeight: 400,
                boxShadow: "none",
                color: "#ececec",
              }}
            >
              Start a conversation
            </Button>
          </Empty>
        ) : (
          <List
            dataSource={conversations}
            split={false}
            style={{
              padding: "4px 8px 8px 8px",
              minHeight: "100%",
            }}
            renderItem={(conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isActive={conversation.id === currentConversationId}
                onSelect={() => selectConversation(conversation.id)}
                onDelete={() => deleteConversation(conversation.id)}
                onUpdateTitle={(title) =>
                  updateConversationTitle(conversation.id, title)
                }
              />
            )}
          />
        )}
      </div>
    </div>
  );
};

export default ConversationsSidebar;
