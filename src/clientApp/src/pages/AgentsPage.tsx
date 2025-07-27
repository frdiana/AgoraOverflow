import React, { useState } from "react";
import {
  Card,
  Typography,
  Row,
  Col,
  Switch,
  Tag,
  Space,
  Button,
  Tooltip,
  Badge,
  Divider,
  Select,
  Input,
} from "antd";
import {
  SettingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SearchOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { useAgentsStore, type Agent } from "../stores/agentsStore";

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

interface AgentCardProps {
  agent: Agent;
  onToggle: (id: string) => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, onToggle }) => {
  const getCategoryColor = (category: string) => {
    const colors = {
      coding: "blue",
      creative: "purple",
      analysis: "green",
      productivity: "orange",
    };
    return colors[category as keyof typeof colors] || "default";
  };

  const formatCreatedDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
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
    <Badge.Ribbon
      text={agent.enabled ? "Active" : "Inactive"}
      color={agent.enabled ? "green" : "gray"}
    >
      <Card
        style={{
          height: "300px",
          transition: "all 0.3s ease",
          border: agent.enabled ? "2px solid #52c41a" : "1px solid #d9d9d9",
          boxShadow: agent.enabled
            ? "0 4px 12px rgba(82, 196, 26, 0.15)"
            : "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
        hoverable
        actions={[
          <Tooltip
            title={agent.enabled ? "Disable Agent" : "Enable Agent"}
            key="toggle"
          >
            <Switch
              checked={agent.enabled}
              onChange={() => onToggle(agent.id)}
              checkedChildren={<CheckCircleOutlined />}
              unCheckedChildren={<CloseCircleOutlined />}
            />
          </Tooltip>,
          <Tooltip title="Agent Settings" key="settings">
            <SettingOutlined />
          </Tooltip>,
        ]}
      >
        <Card.Meta
          avatar={
            <div
              style={{
                fontSize: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "48px",
                height: "48px",
                borderRadius: "8px",
                background: agent.enabled ? "#f6ffed" : "#f5f5f5",
              }}
            >
              {agent.icon}
            </div>
          }
          title={
            <Space direction="vertical" size={0} style={{ width: "100%" }}>
              <Text strong style={{ fontSize: "16px" }}>
                {agent.name}
              </Text>
              <Space size={4}>
                <Tag
                  color={getCategoryColor(agent.category)}
                  style={{ fontSize: "11px" }}
                >
                  {agent.category.toUpperCase()}
                </Tag>
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  Added {formatCreatedDate(agent.createdAt)}
                </Text>
              </Space>
            </Space>
          }
          description={
            <div style={{ height: "80px", overflow: "hidden" }}>
              <Paragraph
                ellipsis={{ rows: 3, tooltip: agent.description }}
                style={{ margin: 0, fontSize: "13px", lineHeight: "1.4" }}
              >
                {agent.description}
              </Paragraph>
            </div>
          }
        />

        <Divider style={{ margin: "12px 0 8px 0" }} />

        <div style={{ marginTop: "8px" }}>
          <Text type="secondary" style={{ fontSize: "12px", fontWeight: 500 }}>
            Capabilities:
          </Text>
          <div style={{ marginTop: "4px" }}>
            {agent.capabilities.slice(0, 2).map((capability, index) => (
              <Tag
                key={index}
                style={{ fontSize: "11px", margin: "2px 4px 2px 0" }}
              >
                {capability}
              </Tag>
            ))}
            {agent.capabilities.length > 2 && (
              <Tooltip title={agent.capabilities.slice(2).join(", ")}>
                <Tag style={{ fontSize: "11px" }}>
                  +{agent.capabilities.length - 2} more
                </Tag>
              </Tooltip>
            )}
          </div>
        </div>
      </Card>
    </Badge.Ribbon>
  );
};

const AgentsPage: React.FC = () => {
  const {
    agents,
    toggleAgent,
    enableAllAgents,
    disableAllAgents,
    getEnabledAgents,
  } = useAgentsStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const enabledCount = getEnabledAgents().length;
  const totalCount = agents.length;

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || agent.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", "coding", "creative", "analysis", "productivity"];

  return (
    <div
      style={{
        background: "#f5f5f5",
        minHeight: "100%",
        padding: "24px",
        borderRadius: "8px",
      }}
    >
      {/* Header Section */}
      <div
        style={{
          background: "#fff",
          padding: "24px",
          borderRadius: "8px",
          marginBottom: "24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: "16px" }}
        >
          <Col>
            <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
              AI Agents Dashboard
            </Title>
            <Text type="secondary">
              Manage and configure your AI assistants ({enabledCount}/
              {totalCount} active)
            </Text>
          </Col>
          <Col>
            <Space>
              <Button
                type="primary"
                onClick={enableAllAgents}
                icon={<CheckCircleOutlined />}
              >
                Enable All
              </Button>
              <Button onClick={disableAllAgents} icon={<CloseCircleOutlined />}>
                Disable All
              </Button>
            </Space>
          </Col>
        </Row>

        {/* Filters and Search */}
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Search
              placeholder="Search agents by name or description..."
              allowClear
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "100%" }}
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col>
            <Select
              value={categoryFilter}
              onChange={setCategoryFilter}
              style={{ width: 150 }}
              suffixIcon={<FilterOutlined />}
            >
              {categories.map((category) => (
                <Option key={category} value={category}>
                  {category === "all"
                    ? "All Categories"
                    : category.charAt(0).toUpperCase() + category.slice(1)}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>

        {/* Stats */}
        <Row gutter={16} style={{ marginTop: "16px" }}>
          <Col span={6}>
            <Card size="small" style={{ textAlign: "center" }}>
              <Text type="secondary">Total Agents</Text>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#1890ff",
                }}
              >
                {totalCount}
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" style={{ textAlign: "center" }}>
              <Text type="secondary">Active Agents</Text>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#52c41a",
                }}
              >
                {enabledCount}
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" style={{ textAlign: "center" }}>
              <Text type="secondary">Categories</Text>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#722ed1",
                }}
              >
                {categories.length - 1}
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" style={{ textAlign: "center" }}>
              <Text type="secondary">Filtered Results</Text>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#fa8c16",
                }}
              >
                {filteredAgents.length}
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Agents Grid */}
      <Row gutter={[24, 24]}>
        {filteredAgents.map((agent) => (
          <Col key={agent.id} xs={24} sm={12} lg={8} xl={8}>
            <AgentCard agent={agent} onToggle={toggleAgent} />
          </Col>
        ))}
      </Row>

      {filteredAgents.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "60px",
            background: "#fff",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Text type="secondary" style={{ fontSize: "16px" }}>
            No agents found matching your criteria
          </Text>
        </div>
      )}
    </div>
  );
};

export default AgentsPage;
