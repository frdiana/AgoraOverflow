import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import AgentsPage from "@/pages/agents";
import ChatPage from "@/pages/chat";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<AgentsPage />} path="/agents" />
      <Route element={<ChatPage />} path="/chat" />
    </Routes>
  );
}

export default App;
