export const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

export const API_ROUTES = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    LOGOUT: "/api/auth/logout",
  },
  CHAT: {
    CONVERSATIONS: "/api/conversations",
    MESSAGES: (conversationId: string) =>
      `/api/messages/conversation/${conversationId}`,
    SEND_MESSAGE: "/api/messages",
    START_CONVERSATION: "/api/conversations",
  },
  USERS: {
    SEARCH: (query: string) => `/api/Users/search?query=${query}`,
    GET_PROFILE: (id: string) => `/api/Users/${id}`,
    UPDATE_PROFILE: "/api/Users/me",
  },
};

export const APP_ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  CHAT: "/chat",
  ROOT: "/",
};

export const SIGNALR_HUB_URL = `${BACKEND_BASE_URL}/hubs/chat`;
