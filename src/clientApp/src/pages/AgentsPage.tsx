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
import "./AgentsPage.css";

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
      coding: "#1890ff",
      creative: "#722ed1",
      analysis: "#52c41a",
      productivity: "#fa8c16",
    };
    return colors[category as keyof typeof colors] || "#8c8c8c";
  };

  const getCategoryBgColor = (category: string) => {
    const colors = {
      coding: "#e6f7ff",
      creative: "#f9f0ff",
      analysis: "#f6ffed",
      productivity: "#fff7e6",
    };
    return colors[category as keyof typeof colors] || "#f5f5f5";
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
    <div style={{ position: "relative", height: "100%" }}>
      <Card
        style={{
          height: "340px",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          border: agent.enabled 
            ? `2px solid ${getCategoryColor(agent.category)}` 
            : "1px solid #f0f0f0",
          borderRadius: "16px",
          boxShadow: agent.enabled
            ? `0 8px 32px ${getCategoryColor(agent.category)}20, 0 4px 16px rgba(0, 0, 0, 0.08)`
            : "0 4px 16px rgba(0, 0, 0, 0.06)",
          background: agent.enabled 
            ? `linear-gradient(135deg, ${getCategoryBgColor(agent.category)} 0%, #ffffff 100%)`
            : "#ffffff",
          overflow: "hidden",
        }}
        hoverable
        className="agent-card"
        bodyStyle={{
          padding: "20px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
        actions={[
          <div 
            key="actions" 
            style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              padding: "0 8px",
              width: "100%"
            }}
          >
            <Tooltip
              title={agent.enabled ? "Disable Agent" : "Enable Agent"}
              placement="bottom"
            >
              <Switch
                checked={agent.enabled}
                onChange={() => onToggle(agent.id)}
                checkedChildren={<CheckCircleOutlined />}
                unCheckedChildren={<CloseCircleOutlined />}
                style={{
                  background: agent.enabled ? getCategoryColor(agent.category) : undefined
                }}
              />
            </Tooltip>
            <Tooltip title="Agent Settings" placement="bottom">
              <Button
                type="text"
                icon={<SettingOutlined />}
                style={{ 
                  color: "#8c8c8c",
                  transition: "all 0.2s"
                }}
                className="settings-btn"
              />
            </Tooltip>
          </div>
        ]}
      >
        {/* Status Badge */}
        <div
          className={agent.enabled ? "status-badge-active" : ""}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: agent.enabled 
              ? getCategoryColor(agent.category)
              : "#bfbfbf",
            color: "#ffffff",
            padding: "4px 12px",
            borderRadius: "12px",
            fontSize: "11px",
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
          }}
        >
          {agent.enabled ? "Active" : "Inactive"}
        </div>

        {/* Header Section */}
        <div style={{ marginTop: "8px", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
            <div
              style={{
                fontSize: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                background: agent.enabled 
                  ? `linear-gradient(135deg, ${getCategoryColor(agent.category)}15, ${getCategoryColor(agent.category)}08)`
                  : "#f8f8f8",
                border: `2px solid ${agent.enabled ? getCategoryColor(agent.category) + "30" : "#f0f0f0"}`,
                flexShrink: 0,
              }}
            >
              {agent.icon}
            </div>
            
            <div style={{ flex: 1, minWidth: 0 }}>
              <Title 
                level={4} 
                style={{ 
                  margin: "0 0 8px 0", 
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#262626",
                  lineHeight: "1.3"
                }}
              >
                {agent.name}
              </Title>
              
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
                <Tag
                  style={{
                    background: getCategoryBgColor(agent.category),
                    color: getCategoryColor(agent.category),
                    border: `1px solid ${getCategoryColor(agent.category)}30`,
                    borderRadius: "8px",
                    fontSize: "11px",
                    fontWeight: "600",
                    padding: "2px 8px",
                    textTransform: "uppercase",
                    letterSpacing: "0.3px",
                  }}
                >
                  {agent.category}
                </Tag>
                <Text 
                  type="secondary" 
                  style={{ 
                    fontSize: "12px",
                    color: "#8c8c8c"
                  }}
                >
                  {formatCreatedDate(agent.createdAt)}
                </Text>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div style={{ flex: 1, marginBottom: "16px" }}>
          <Paragraph
            ellipsis={{ 
              rows: 3, 
              tooltip: {
                title: agent.description,
                placement: "topLeft"
              }
            }}
            style={{ 
              margin: 0, 
              fontSize: "14px", 
              lineHeight: "1.5",
              color: "#595959"
            }}
          >
            {agent.description}
          </Paragraph>
        </div>

        {/* Capabilities */}
        <div>
          <Text 
            strong 
            style={{ 
              fontSize: "13px", 
              color: "#8c8c8c",
              textTransform: "uppercase",
              letterSpacing: "0.3px",
              marginBottom: "8px",
              display: "block"
            }}
          >
            Capabilities
          </Text>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {agent.capabilities.slice(0, 3).map((capability, index) => (
              <Tag
                key={index}
                className="capability-tag"
                style={{
                  fontSize: "12px",
                  borderRadius: "6px",
                  border: "1px solid #f0f0f0",
                  background: "#fafafa",
                  color: "#595959",
                  margin: 0,
                  padding: "2px 8px",
                }}
              >
                {capability}
              </Tag>
            ))}
            {agent.capabilities.length > 3 && (
              <Tooltip 
                title={
                  <div>
                    <div style={{ marginBottom: "4px", fontWeight: "600" }}>All Capabilities:</div>
                    {agent.capabilities.map((cap, idx) => (
                      <div key={idx} style={{ margin: "2px 0" }}>• {cap}</div>
                    ))}
                  </div>
                }
                placement="topLeft"
              >
                <Tag 
                  className="capability-tag"
                  style={{
                    fontSize: "12px",
                    borderRadius: "6px",
                    border: `1px solid ${getCategoryColor(agent.category)}30`,
                    background: getCategoryBgColor(agent.category),
                    color: getCategoryColor(agent.category),
                    margin: 0,
                    padding: "2px 8px",
                    fontWeight: "600",
                  }}
                >
                  +{agent.capabilities.length - 3}
                </Tag>
              </Tooltip>
            )}
          </div>
        </div>
      </Card>
    </div>
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
      <div className="agents-container">
        <Row gutter={[20, 24]}>
          {filteredAgents.map((agent) => (
            <Col key={agent.id} xs={24} sm={12} md={8} lg={6} xl={6}>
              <AgentCard agent={agent} onToggle={toggleAgent} />
            </Col>
          ))}
        </Row>
      </div>

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
