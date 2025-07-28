import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../pages/HomePage";
import ChatPage from "../pages/ChatPage";
import AgentsPage from "../pages/AgentsPage";
import SettingsPage from "../pages/SettingsPage";
import ErrorPage from "../pages/ErrorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/chat",
        element: <ChatPage />,
      },
      {
        path: "/chat/:chatId",
        element: <ChatPage />,
      },
      {
        path: "/agents",
        element: <AgentsPage />,
      },
      {
        path: "/settings",
        element: <SettingsPage />,
      },
    ],
  },
]);
