import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Navigation from "./components/Navigation";

const { Content } = Layout;

const App = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Navigation />
      <Content style={{ padding: "24px" }}>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default App;
