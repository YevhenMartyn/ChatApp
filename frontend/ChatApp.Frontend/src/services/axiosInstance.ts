import axios from "axios";
import { AUTH_BASE_URL, MESSAGING_BASE_URL } from "../constants/routes";

// Axios instance for Auth service
export const authAxios = axios.create({
  baseURL: AUTH_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Axios instance for Messaging service
export const messagingAxios = axios.create({
  baseURL: MESSAGING_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Default instance (for backwards compatibility)
const axiosInstance = authAxios;

// Request interceptor to add JWT token to both instances
const requestInterceptor = (config: any) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

const requestErrorInterceptor = (error: any) => {
  return Promise.reject(error);
};

authAxios.interceptors.request.use(requestInterceptor, requestErrorInterceptor);
messagingAxios.interceptors.request.use(
  requestInterceptor,
  requestErrorInterceptor,
);

// Response interceptor to handle errors for both instances
const responseInterceptor = (response: any) => response;

const responseErrorInterceptor = (error: any) => {
  if (error.response?.status === 401) {
    // Token expired or invalid
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }
  return Promise.reject(error);
};

authAxios.interceptors.response.use(
  responseInterceptor,
  responseErrorInterceptor,
);
messagingAxios.interceptors.response.use(
  responseInterceptor,
  responseErrorInterceptor,
);

export default axiosInstance;
