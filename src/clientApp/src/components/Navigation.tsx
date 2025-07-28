import React from "react";
import { Layout, Button, Drawer, Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MenuOutlined,
  MessageOutlined,
  RobotOutlined,
  SettingOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { useNavigation } from "../hooks/useNavigation";

const { Header } = Layout;

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDrawerOpen, openDrawer, closeDrawer } = useNavigation();

  const menuItems = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: "Home",
    },
    {
      key: "/chat",
      icon: <MessageOutlined />,
      label: "Chat",
    },
    {
      key: "/agents",
      icon: <RobotOutlined />,
      label: "Agents",
    },
    {
      key: "/settings",
      icon: <SettingOutlined />,
      label: "Settings",
    },
  ];

  const handleMenuClick = (key: string) => {
    navigate(key);
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
          selectedKeys={[location.pathname]}
          onClick={({ key }) => handleMenuClick(key)}
          style={{ border: "none" }}
        />
      </Drawer>
    </>
  );
};

export default Navigation;
