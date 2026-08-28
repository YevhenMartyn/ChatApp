import axios from "axios";
import { BACKEND_BASE_URL } from "../constants/routes";

export const authAxios = axios.create({
  baseURL: BACKEND_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const messagingAxios = axios.create({
  baseURL: BACKEND_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const userAxios = axios.create({
  baseURL: BACKEND_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const axiosInstance = authAxios;

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
userAxios.interceptors.request.use(requestInterceptor, requestErrorInterceptor);

const responseInterceptor = (response: any) => response;

const responseErrorInterceptor = (error: any) => {
  if (error.response?.status === 401) {
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
userAxios.interceptors.response.use(
  responseInterceptor,
  responseErrorInterceptor,
);

export default axiosInstance;
