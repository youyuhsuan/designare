import axios from "axios";
// Config
import { API_CONFIG, API_ENDPOINTS } from "@/config/apiConfig";
// Utils
import handleError from "@/utils/errorHandler";
// Store
import useAuthStore from "@/stores/auth.store";
import useSettingStore from "@/stores/setting.store";

export const instance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
});

export const authInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  config.headers["Accept-Language"] = useSettingStore().currentLanguage || "en";
  return config;
});

// Global response error handling
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(handleError(error));
  },
);

// Attach access token to Authorization header for authenticated requests
authInstance.interceptors.request.use((config) => {
  const authStore = useAuthStore();

  config.headers.Authorization = `Bearer ${authStore.accessToken}`;
  config.headers["Accept-Language"] = useSettingStore().currentLanguage || "en";
  return config;
});

let isRefreshing: boolean = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}[] = [];

const processQueue = (error?: unknown) => {
  failedQueue.forEach((prom) => (error ? prom.reject(error) : prom.resolve()));
  failedQueue = [];
};

const SKIP_REFRESH = [{ url: API_ENDPOINTS.AUTH.REFRESH }];

const shouldSkipRefresh = (error: any) =>
  !SKIP_REFRESH.some((skip) => skip.url === error?.config?.url);

authInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      shouldSkipRefresh(error)
    ) {
      originalRequest._retry = true;

      // If a refresh is already in progress, queue this request and wait
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => authInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      // This request wins the refresh lock
      isRefreshing = true;
      try {
        await useAuthStore().refreshAccessToken();
        processQueue(); // unblock all queued requests
        return authInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError); // reject all queued requests
        await useAuthStore().logout(); // refresh is broken — log out
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false; // only the lock owner resets the lock
      }
    }

    return Promise.reject(handleError(error));
  },
);
