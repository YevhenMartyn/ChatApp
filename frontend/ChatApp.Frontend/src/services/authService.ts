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

interface BackendAuthResponse {
  id: string;
  token: string;
  username: string;
  expiresAt: string;
}

export interface AuthResponse {
  user: {
    id: string;
    username: string;
  };
  token: string;
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await authAxios.post<BackendAuthResponse>(
      API_ROUTES.AUTH.LOGIN,
      credentials,
    );

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
    await authAxios.post(API_ROUTES.AUTH.LOGOUT);
  },
};
