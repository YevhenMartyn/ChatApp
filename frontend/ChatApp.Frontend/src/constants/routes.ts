// Backend service URLs
export const AUTH_BASE_URL =
  import.meta.env.VITE_AUTH_BASE_URL || "https://localhost:7269";
export const MESSAGING_BASE_URL =
  import.meta.env.VITE_MESSAGING_BASE_URL || "https://localhost:7228";
export const REALTIME_BASE_URL =
  import.meta.env.VITE_REALTIME_BASE_URL || "https://localhost:7298";

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
  },
};

export const APP_ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  CHAT: "/chat",
  ROOT: "/",
};

export const SIGNALR_HUB_URL = `${REALTIME_BASE_URL}/hubs/chat`;
