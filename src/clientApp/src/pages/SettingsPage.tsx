import React from "react";
import { Card, Typography } from "antd";

const { Title, Paragraph } = Typography;

const SettingsPage: React.FC = () => {
  return (
    <Card>
      <Title level={2}>Settings</Title>
      <Paragraph>
        This is the settings page where users can configure their preferences.
      </Paragraph>
    </Card>
  );
};

export default SettingsPage;
