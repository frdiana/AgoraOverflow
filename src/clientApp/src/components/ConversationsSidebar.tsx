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
      style={{
        padding: "12px 16px",
        margin: "4px 8px",
        borderRadius: "8px",
        backgroundColor: isActive ? "#e6f7ff" : "transparent",
        border: isActive ? "1px solid #91d5ff" : "1px solid transparent",
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = "#f5f5f5";
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
          <MessageOutlined style={{ color: isActive ? "#1890ff" : "#666" }} />
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
            />
          ) : (
            <Text
              style={{
                color: isActive ? "#1890ff" : "#000",
                fontWeight: isActive ? 500 : 400,
              }}
              ellipsis={{ tooltip: conversation.title }}
            >
              {conversation.title}
            </Text>
          )
        }
        description={
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {conversation.messages.length} messages •{" "}
            {formatDate(conversation.updatedAt)}
          </Text>
        }
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
  } = useConversationsStore();

  return (
    <div
      style={{
        width: "320px",
        height: "100%",
        borderRight: "1px solid #f0f0f0",
        background: "#fafafa",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px",
          borderBottom: "1px solid #f0f0f0",
          background: "#fff",
        }}
      >
        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            Conversations
          </Typography.Title>
          <Tooltip title="New conversation">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={createConversation}
              size="small"
            >
              New
            </Button>
          </Tooltip>
        </Space>
      </div>

      {/* Conversations List */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {conversations.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No conversations yet"
            style={{ marginTop: "60px" }}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={createConversation}
            >
              Start a conversation
            </Button>
          </Empty>
        ) : (
          <List
            dataSource={conversations}
            split={false}
            style={{ padding: "8px 0" }}
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
