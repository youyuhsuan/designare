import { ref, readonly } from "vue";
// Pinia
import { defineStore } from "pinia";
// Router
import router from "@/router";
// Composables
import useApiAuth from "@/composables/api/useApiAuth";
import useApiOAuth from "@/composables/api/useApiOAuth";
// Stores
import useLoadingStore from "@/stores/loading.store";
// Type
import type { Me } from "@/types/userType";
import type { LoginRequest, TokenResponse } from "@/types/authType";
// Config
import ROUTE_CONFIGS from "@/config/routeConfig";

const useAuthStore = defineStore(
  "auth",
  () => {
    const user = ref<Me | null>(null);
    const isAuthenticated = ref<boolean>(false);
    const accessToken = ref<string | null>(null);
    const refreshToken = ref<string | null>(null);

    const loadingStore = useLoadingStore();

    const {
      getCurrentAuth,
      loginUser,
      logoutUser,
      refreshAccessToken: refreshAccessTokenApi,
    } = useApiAuth();
    const { createGoogleAuthorization, createGoogleToken } = useApiOAuth();

    // Idle timer
    // Duration of inactivity (in milliseconds) before the timer fires.
    let idleTimerId: ReturnType<typeof setTimeout> | null = null;
    const RESET_TIME_EXPIRY = 15 * 60 * 1000; // 15 * 60 * 1000ms = 15 minutes

    // Restart the inactivity timer; refreshes token on expiry, logs out on failure
    const resetTimer = () => {
      if (idleTimerId) cancelResetTimer();

      idleTimerId = setTimeout(async () => {
        try {
          await refreshAccessToken();
        } catch (error: unknown) {
          console.error("Failed to refresh access token:", error);
          await logout();
        }
      }, RESET_TIME_EXPIRY);
    };

    // Cancel the active inactivity timer and clear its ID
    const cancelResetTimer = () => {
      if (!idleTimerId) return;

      clearTimeout(idleTimerId);
      idleTimerId = null;
    };

    // User Actions
    const getUser = async () => {
      user.value = (await getCurrentAuth()).data;
    };

    // Auth Actions
    // Sets accessToken and refreshToken values in localStorage
    const setAuthState = (token: TokenResponse) => {
      accessToken.value = token.accessToken;
      refreshToken.value = token.refreshToken;
      isAuthenticated.value = true;
    };

    // Authenticated user with email, password and remenberMe
    const login = async (values: LoginRequest) => {
      setAuthState((await loginUser(values)).data);
      await getUser();
      resetTimer();
    };

    // Revoke token on the server, clear local state and redirect to home
    const logout = async () => {
      cancelResetTimer();
      await logoutUser();

      // Reset all auth state
      isAuthenticated.value = false;
      accessToken.value = null;
      refreshToken.value = null;
      user.value = null;

      // Clear persisted tokens from localStorage
      localStorage.removeItem("auth");

      router.push(ROUTE_CONFIGS.HOME);
    };

    // Restore authenticated state on app startup using persisted tokens
    const initialize = async () => {
      loadingStore.start();
      try {
        if (!accessToken.value || !refreshToken.value) return;

        await getUser();
        isAuthenticated.value = true;
        resetTimer();
      } finally {
        loadingStore.stop();
      }
    };

    // Exchange refreshToken for a new access token and updated stored tokens
    const refreshAccessToken = async () => {
      setAuthState((await refreshAccessTokenApi()).data);
    };

    // OAuth Auctions
    const initiateGoogleLogin = async () => {
      const state: string = crypto.randomUUID();
      sessionStorage.setItem("oauth_state", state);
      window.location.href = (await createGoogleAuthorization(state)).data;
    };

    const processGoogleCallback = async (code: string) => {
      setAuthState((await createGoogleToken(code)).data);
      await getUser();
      resetTimer();
    };

    return {
      user,
      isAuthenticated: readonly(isAuthenticated),
      accessToken,
      refreshToken,
      resetTimer,
      cancelResetTimer,
      refreshAccessToken,
      login,
      logout,
      initialize,
      oauth: {
        initiateGoogleLogin,
        processGoogleCallback,
      },
    };
  },
  {
    persist: [
      {
        key: "auth",
        pick: ["accessToken", "refreshToken"],
        storage: localStorage,
      },
    ],
  },
);

export default useAuthStore;
