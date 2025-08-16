import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Navigation from "./components/Navigation";
import { DarkModeProvider } from "./contexts/DarkModeContext";

const { Content } = Layout;

const App = () => {
  return (
    <DarkModeProvider>
      <Layout style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
        <Navigation />
        <Content style={{ padding: "24px", background: "var(--bg-secondary)" }}>
          <Outlet />
        </Content>
      </Layout>
    </DarkModeProvider>
  );
};

export default App;
