import axios from "axios";
import { API_CONFIG } from "../constants/env";
import { Buffer } from "buffer";
import { useAuthStore } from "../store/authStore";

// Basic Auth Encoding for API Gateway
const basicAuth = Buffer.from(
  `${API_CONFIG.BASIC_AUTH_USER}:${API_CONFIG.BASIC_AUTH_PASS}`,
).toString("base64");

const apiClient = axios.create({
  baseURL: API_CONFIG.API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Basic ${basicAuth}`,
  },
});

// Request Interceptor for JWT
apiClient.interceptors.request.use(
  async (config) => {
    // Get token directly from Zustand Store state
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.accessToken = token;
    }

    // Debug Log
    console.log(
      `🚀 [API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
    );

    return config;
  },
  (error) => {
    console.error("❌ [API Request Error]", error);
    return Promise.reject(error);
  },
);

// Response Interceptor for Error Handling
apiClient.interceptors.response.use(
  (response: any) => {
    console.log(`✅ [API Response] Success`);
    const data = response.data;
    const payload = data?.res !== undefined ? data.res : data;
    return payload || {}; 
  },
  (error) => {
    const message =
      error.response?.data?.err?.message ||
      error.response?.data?.message ||
      error.message ||
      "An error occurred";

    console.error(`❌ [API Response Error] ${message}`, {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });

    return Promise.reject(new Error(message));
  },
);

export default apiClient;
