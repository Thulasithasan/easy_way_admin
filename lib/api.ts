import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { authAPI } from "./auth-api";
import { de } from "zod/v4/locales";

// const API_BASE_URL = "https://easy-way-be.thulasi-web.space"
const API_BASE_URL = "http://localhost:8080";

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onRefreshed(newToken: string) {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
}

function addSubscriber(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

// ✅ Request interceptor (typed correctly for Axios v1+)
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      if (config.headers) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ✅ Response interceptor (handles refresh token flow)
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refresh_token");

      if (!refreshToken) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/auth/sign-in";
        return Promise.reject(error);
      }

      if (!isRefreshing) {
        isRefreshing = true;
        try {

          const { data } = await axios.post(`${API_BASE_URL}/v1/auth/refresh-token`, { refreshToken });
          
          const newAccessToken = data.results[0].accessToken;
          localStorage.setItem("auth_token", newAccessToken);

          isRefreshing = false;
          onRefreshed(newAccessToken);

          if (originalRequest.headers) {
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;
          }

          return api(originalRequest);
        } catch (err) {
          console.error("Refresh token failed:", err);
          isRefreshing = false;
          localStorage.removeItem("auth_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/auth/sign-in";
          return Promise.reject(err);
        }
      }

      // Queue requests until refresh is done
      return new Promise((resolve) => {
        addSubscriber((newToken: string) => {
          if (originalRequest.headers) {
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          }
          resolve(api(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default api;
