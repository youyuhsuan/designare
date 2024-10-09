import type { UserTokenData } from "@/src/types/tokenTypes";
import { useCallback, useRef, useState } from "react";

export type UseToken = {
  token: UserTokenData | null;
  fetchToken: () => Promise<UserTokenData | null>;
  refreshToken: () => Promise<UserTokenData | null>;
  deleteToken: () => Promise<void>;
};

const useToken = (): UseToken => {
  const [token, setToken] = useState<UserTokenData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const retryCountRef = useRef(0);

  const refreshToken = useCallback(async (): Promise<UserTokenData | null> => {
    try {
      const response = await fetch("/api/token/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`Refresh token failed with status ${response.status}`);
      }
      const newTokenData: UserTokenData = await response.json();
      setToken(newTokenData);
      return newTokenData;
    } catch (error) {
      console.error(
        "Unknown error occurred while refreshToken",
        error as Error
      );
      return null;
    }
  }, []);
  const fetchToken = useCallback(async (): Promise<UserTokenData | null> => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/token");
      if (response.status === 401) {
        if (retryCountRef.current === 0) {
          retryCountRef.current += 1;
          const refreshedToken = await refreshToken();
          if (refreshedToken) {
            setToken(refreshedToken);
            retryCountRef.current = 0;
            return refreshedToken;
          }
        }
        throw new Error("Token refresh failed");
      }
      if (!response.ok) {
        throw new Error(`Fetch token failed with status ${response.status}`);
      }
      const responseData = await response.json();
      setToken(responseData.data);
      retryCountRef.current = 0;
      return responseData.data;
    } catch (error) {
      setToken(null);
      console.error("Error in fetchToken", error as Error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [refreshToken]);

  const deleteToken = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`Delete token failed with status: ${response.status}`);
      }
    } catch (error) {
      throw new Error(
        "Unknown error occurred while deleteToken",
        error as Error
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    token,
    fetchToken,
    refreshToken,
    deleteToken,
  };
};

export default useToken;
