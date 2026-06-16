import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  setActiveConversation,
  setLoadingConversations,
  setConversations,
} from "../../slices/chatSlice";
import { chatService } from "../../services/chatService";
import { userService, type UserProfile } from "../../services/userService";
import { Avatar } from "../atoms/Avatar";
import { LoadingSpinner } from "../atoms/LoadingSpinner";

export const ConversationList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { conversations, activeConversationId, isLoadingConversations } =
    useAppSelector((state) => state.chat);
  const { user: currentUser } = useAppSelector((state) => state.auth);

  const [participantProfiles, setParticipantProfiles] = useState<
    Record<string, UserProfile>
  >({});

  useEffect(() => {
    const fetchConvos = async () => {
      dispatch(setLoadingConversations(true));
      try {
        const data = await chatService.getConversations();
        dispatch(setConversations(data));
      } catch (error) {
        console.error("Failed to load conversations:", error);
      } finally {
        dispatch(setLoadingConversations(false));
      }
    };

    fetchConvos();
  }, [dispatch]);

  useEffect(() => {
    if (conversations.length === 0) return;

    const missingUserIds = Array.from(
      new Set(
        conversations
          .flatMap((c) => c.participantIds || [])
          .filter(
            (id) => id && id !== currentUser?.id && !participantProfiles[id],
          ),
      ),
    );

    if (missingUserIds.length > 0) {
      userService
        .getMultipleUserProfiles(missingUserIds)
        .then((profiles) => {
          setParticipantProfiles((prev) => {
            const newMap = { ...prev };
            profiles.forEach((p) => {
              newMap[p.id] = p;
            });
            return newMap;
          });
        })
        .catch((err) => console.error("Failed to fetch missing profiles", err));
    }
  }, [conversations, currentUser?.id, participantProfiles]);

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
          {conversations.map((conversation) => {
            const otherUserId = conversation.participantIds?.find(
              (id) => id !== currentUser?.id,
            );

            const profile = otherUserId
              ? participantProfiles[otherUserId]
              : null;
            const displayName =
              profile?.displayName ||
              profile?.username ||
              conversation.name ||
              "Unknown";
            const avatarUrl = profile?.avatar;

            return (
              <div
                key={conversation.id}
                onClick={() => handleSelectConversation(conversation.id)}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  activeConversationId === conversation.id ? "bg-blue-100" : ""
                }`}
              >
                <div className="flex items-center space-x-3">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <Avatar name={displayName} />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {displayName}
                    </p>
                    {conversation.lastMessage?.content && (
                      <p className="text-sm text-gray-500 truncate">
                        {conversation.lastMessage.content}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
