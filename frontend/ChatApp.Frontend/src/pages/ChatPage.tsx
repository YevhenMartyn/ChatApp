import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../slices/authSlice";
import { clearChat } from "../slices/chatSlice";
import { ConversationList } from "../components/organisms/ConversationList";
import { ChatWindow } from "../components/organisms/ChatWindow";
import { Button } from "../components/atoms/Button";
import { APP_ROUTES } from "../constants/routes";

export const ChatPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearChat());
    navigate(APP_ROUTES.LOGIN);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white p-4 shadow-md">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">ChatApp</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-white">
              Welcome, {user?.username}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 flex-shrink-0">
          <ConversationList />
        </div>

        {/* Chat Area */}
        <div className="flex-1">
          <ChatWindow />
        </div>
      </div>
    </div>
  );
};
