import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  senderName?: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface Conversation {
  id: number;
  name: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  participantNames?: string[];
}

interface ChatState {
  conversations: Conversation[];
  activeConversationId: number | null;
  messages: { [conversationId: number]: Message[] };
  isLoadingConversations: boolean;
  isLoadingMessages: boolean;
  error: string | null;
}

const initialState: ChatState = {
  conversations: [],
  activeConversationId: null,
  messages: {},
  isLoadingConversations: false,
  isLoadingMessages: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload;
      state.isLoadingConversations = false;
    },
    setActiveConversation: (state, action: PayloadAction<number>) => {
      state.activeConversationId = action.payload;
    },
    setMessages: (
      state,
      action: PayloadAction<{ conversationId: number; messages: Message[] }>,
    ) => {
      state.messages[action.payload.conversationId] = action.payload.messages;
      state.isLoadingMessages = false;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      const { conversationId } = action.payload;
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      state.messages[conversationId].push(action.payload);
    },
    messageReceived: (state, action: PayloadAction<Message>) => {
      const { conversationId } = action.payload;
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      // Avoid duplicates
      const exists = state.messages[conversationId].some(
        (m) => m.id === action.payload.id,
      );
      if (!exists) {
        state.messages[conversationId].push(action.payload);
      }
    },
    setLoadingConversations: (state, action: PayloadAction<boolean>) => {
      state.isLoadingConversations = action.payload;
    },
    setLoadingMessages: (state, action: PayloadAction<boolean>) => {
      state.isLoadingMessages = action.payload;
    },
    setChatError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoadingConversations = false;
      state.isLoadingMessages = false;
    },
    clearChat: (state) => {
      state.conversations = [];
      state.activeConversationId = null;
      state.messages = {};
      state.error = null;
    },
  },
});

export const {
  setConversations,
  setActiveConversation,
  setMessages,
  addMessage,
  messageReceived,
  setLoadingConversations,
  setLoadingMessages,
  setChatError,
  clearChat,
} = chatSlice.actions;

export default chatSlice.reducer;
