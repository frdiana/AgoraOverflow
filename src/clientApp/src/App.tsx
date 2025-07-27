import { Layout } from "antd";
import Navigation from "./components/Navigation";
import ChatPage from "./pages/ChatPage";
import AgentsPage from "./pages/AgentsPage";
import SettingsPage from "./pages/SettingsPage";
import { useNavigation } from "./hooks/useNavigation";

const { Content } = Layout;

const HomePage = () => (
  <div
    style={{
      background: "#fff",
      padding: "24px",
      borderRadius: "8px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    }}
  >
    <h1>Welcome to AgoraOverflow</h1>
    <p>Select an option from the navigation menu to get started.</p>
  </div>
);

const App = () => {
  const { currentPage } = useNavigation();

  const renderPage = () => {
    switch (currentPage) {
      case "chat":
        return <ChatPage />;
      case "agents":
        return <AgentsPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Navigation />
      <Content style={{ padding: "24px" }}>{renderPage()}</Content>
    </Layout>
  );
};

export default App;
