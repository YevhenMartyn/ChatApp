import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  setActiveConversation,
  setLoadingConversations,
  setConversations,
} from "../../slices/chatSlice";
import { chatService } from "../../services/chatService";
import { Avatar } from "../atoms/Avatar";
import { LoadingSpinner } from "../atoms/LoadingSpinner";

export const ConversationList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { conversations, activeConversationId, isLoadingConversations } =
    useAppSelector((state) => state.chat);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    dispatch(setLoadingConversations(true));
    try {
      const data = await chatService.getConversations();
      dispatch(setConversations(data));
    } catch (error) {
      console.error("Failed to load conversations:", error);
      dispatch(setLoadingConversations(false));
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    dispatch(setActiveConversation(conversationId));
  };

  if (isLoadingConversations) {
    return <LoadingSpinner />;
  }

  return (
    <div className="h-full bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Conversations</h2>
      </div>

      {conversations.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          No conversations yet
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => handleSelectConversation(conversation.id)}
              className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                activeConversationId === conversation.id ? "bg-blue-100" : ""
              }`}
            >
              <div className="flex items-center space-x-3">
                <Avatar name={conversation.name || "Chat"} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {conversation.name || "New Chat"}
                  </p>
                  {conversation.lastMessage?.content && (
                    <p className="text-sm text-gray-500 truncate">
                      {conversation.lastMessage.content}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
