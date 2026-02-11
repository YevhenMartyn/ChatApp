import { authAxios } from "./axiosInstance";
import { API_ROUTES } from "../constants/routes";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

// 1. Define what the Backend ACTUALLY returns (The Source)
interface BackendAuthResponse {
  id: string;
  token: string;
  username: string;
  expiresAt: string;
}

// 2. Define what the Frontend NEEDS (The Destination)
// We removed 'email' because the backend doesn't send it.
export interface AuthResponse {
  user: {
    id: string;
    username: string;
  };
  token: string;
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    // Fetch raw data from backend
    const response = await authAxios.post<BackendAuthResponse>(
      API_ROUTES.AUTH.LOGIN,
      credentials,
    );

    // Map Backend response -> Frontend State
    return {
      token: response.data.token,
      user: {
        id: response.data.id,
        username: response.data.username,
      },
    };
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await authAxios.post<BackendAuthResponse>(
      API_ROUTES.AUTH.REGISTER,
      userData,
    );

    return {
      token: response.data.token,
      user: {
        id: response.data.id,
        username: response.data.username,
      },
    };
  },

  logout: async (): Promise<void> => {
    // We just call the endpoint, no mapping needed
    await authAxios.post(API_ROUTES.AUTH.LOGOUT);
  },
};
