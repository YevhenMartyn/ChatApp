import { messagingAxios } from "./axiosInstance";
import { API_ROUTES } from "../constants/routes";
import type { Conversation, Message } from "../slices/chatSlice";

// Backend response interfaces
interface BackendConversation {
  id: string;
  createdAt: string;
  lastMessageAt?: string;
  participantIds: string[];
  lastMessage?: {
    content: string;
    sentAt: string;
  };
}

interface BackendMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  sentAt: string;
}

export interface SendMessageRequest {
  conversationId: string;
  content: string;
}

export const chatService = {
  getConversations: async (): Promise<Conversation[]> => {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const currentUserId = currentUser.id;

    const response = await messagingAxios.get<BackendConversation[]>(
      API_ROUTES.CHAT.CONVERSATIONS,
    );

    // Map backend response to frontend Conversation interface
    return response.data.map((c) => {
      const otherUserId =
        c.participantIds.find((id: string) => id !== currentUserId) ||
        "Unknown";

      return {
        id: c.id,
        name: `Chat ${otherUserId.substring(0, 8)}`,
        createdAt: c.createdAt,
        lastMessageAt: c.lastMessageAt,
        participantIds: c.participantIds,
        lastMessage: c.lastMessage,
      };
    });
  },

  getMessages: async (conversationId: string): Promise<Message[]> => {
    const response = await messagingAxios.get<BackendMessage[]>(
      API_ROUTES.CHAT.MESSAGES(conversationId),
    );

    // Backend already returns the correct format
    return response.data;
  },

  sendMessage: async (
    conversationId: string,
    content: string,
  ): Promise<Message> => {
    const response = await messagingAxios.post<BackendMessage>(
      API_ROUTES.CHAT.SEND_MESSAGE,
      {
        conversationId,
        content,
      },
    );

    return response.data;
  },
};
