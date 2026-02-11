import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Backend Message contract
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  sentAt: string;
}

// Backend Conversation contract
export interface Conversation {
  id: string;
  name?: string; // Generated on frontend from participantIds
  createdAt: string;
  lastMessageAt?: string;
  participantIds: string[];
  lastMessage?: {
    content: string;
    sentAt: string;
  };
}

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: { [conversationId: string]: Message[] };
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
    setActiveConversation: (state, action: PayloadAction<string>) => {
      state.activeConversationId = action.payload;
    },
    setMessages: (
      state,
      action: PayloadAction<{ conversationId: string; messages: Message[] }>,
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
