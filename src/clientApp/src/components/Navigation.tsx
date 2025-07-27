import React from "react";
import { Layout, Button, Drawer, Menu } from "antd";
import {
  MenuOutlined,
  MessageOutlined,
  RobotOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useNavigation } from "../hooks/useNavigation";

const { Header } = Layout;

const Navigation: React.FC = () => {
  const { isDrawerOpen, currentPage, openDrawer, closeDrawer, setCurrentPage } =
    useNavigation();

  const menuItems = [
    {
      key: "chat",
      icon: <MessageOutlined />,
      label: "Chat",
    },
    {
      key: "agents",
      icon: <RobotOutlined />,
      label: "Agents",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
    },
  ];

  const handleMenuClick = (key: string) => {
    const pageMap: Record<string, "home" | "chat" | "agents" | "settings"> = {
      chat: "chat",
      agents: "agents",
      settings: "settings",
    };

    const page = pageMap[key];
    if (page) {
      setCurrentPage(page);
    }

    closeDrawer();
  };

  return (
    <>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#fff",
          borderBottom: "1px solid #f0f0f0",
          padding: "0 16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={openDrawer}
            style={{ marginRight: 16 }}
          />
          <h2 style={{ margin: 0, color: "#1890ff" }}>AgoraOverflow</h2>
        </div>
      </Header>

      <Drawer
        title="Navigation"
        placement="left"
        onClose={closeDrawer}
        open={isDrawerOpen}
        width={250}
      >
        <Menu
          mode="vertical"
          items={menuItems}
          selectedKeys={currentPage !== "home" ? [currentPage] : []}
          onClick={({ key }) => handleMenuClick(key)}
          style={{ border: "none" }}
        />
      </Drawer>
    </>
  );
};

export default Navigation;
