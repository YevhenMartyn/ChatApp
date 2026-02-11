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

export interface AuthResponse {
  user: {
    id: number;
    username: string;
    email: string;
  };
  token: string;
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await authAxios.post<AuthResponse>(
      API_ROUTES.AUTH.LOGIN,
      credentials,
    );
    return response.data;
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await authAxios.post<AuthResponse>(
      API_ROUTES.AUTH.REGISTER,
      userData,
    );
    return response.data;
  },

  logout: async (): Promise<void> => {
    await authAxios.post(API_ROUTES.AUTH.LOGOUT);
  },
};
