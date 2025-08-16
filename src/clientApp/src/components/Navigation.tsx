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
          background: "#171717",
          borderBottom: "1px solid #404040",
          padding: "0 16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={openDrawer}
            style={{
              marginRight: 16,
              color: "#ececec",
              background: "transparent",
              border: "none",
            }}
          />
          <h2 style={{ margin: 0, color: "#ececec" }}>AgoraOverflow</h2>
        </div>
      </Header>

      <Drawer
        title="Navigation"
        placement="left"
        onClose={closeDrawer}
        open={isDrawerOpen}
        width={250}
        styles={{
          body: {
            background: "#171717",
            padding: 0,
          },
          header: {
            background: "#171717",
            borderBottom: "1px solid #404040",
            color: "#ececec",
          },
        }}
        closeIcon={<span style={{ color: "#ececec" }}>×</span>}
      >
        <Menu
          mode="vertical"
          items={menuItems}
          selectedKeys={[location.pathname]}
          onClick={({ key }) => handleMenuClick(key)}
          style={{
            border: "none",
            background: "#171717",
            color: "#ececec",
          }}
        />
      </Drawer>
    </>
  );
};

export default Navigation;
