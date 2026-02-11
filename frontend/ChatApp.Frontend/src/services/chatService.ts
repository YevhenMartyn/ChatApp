import { messagingAxios } from "./axiosInstance";
import { API_ROUTES } from "../constants/routes";
import type { Conversation, Message } from "../slices/chatSlice";

export interface SendMessageRequest {
  content: string;
  conversationId: number;
}

export const chatService = {
  getConversations: async (): Promise<Conversation[]> => {
    const response = await messagingAxios.get<Conversation[]>(
      API_ROUTES.CHAT.CONVERSATIONS,
    );
    return response.data;
  },

  getMessages: async (conversationId: number): Promise<Message[]> => {
    const response = await messagingAxios.get<Message[]>(
      API_ROUTES.CHAT.MESSAGES(conversationId),
    );
    return response.data;
  },

  sendMessage: async (
    conversationId: number,
    content: string,
  ): Promise<Message> => {
    const response = await messagingAxios.post<Message>(
      API_ROUTES.CHAT.SEND_MESSAGE(conversationId),
      { content },
    );
    return response.data;
  },
};
