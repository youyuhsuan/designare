import { useState, useCallback } from "react";
import { z } from "zod";
import {
  loginSchema,
  signupSchema,
  forgotPasswordSchema,
} from "@/src/libs/schemas/authSchema";
import {
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import { firebaseAuth } from "@/src/configs/firebaseClient";

export type AuthMode = "login" | "signup" | "forgot-password";
export type ErrorsType = { [k: string]: string | null } | null;

interface UseAuth {
  mode: AuthMode;
  errors: ErrorsType;
  message: string | null;
  isLoading: boolean;
  isLoadingGoogle: boolean;
  isLoadingFacebook: boolean;
  handleModeChange: (mode: AuthMode) => void;
  handleSubmitForm: (formData: FormData) => Promise<void>;
  handleProviderLogin: (provider: "google" | "facebook") => Promise<any>;
  clearState: () => void;
}

// POST request to the specified API endpoint
const callApi = async (url: string, data: any) => {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    console.error(
      `callApi failed with status: ${response.status}, errorData: ${errorData.error}`
    );
    throw new Error(errorData.error);
  }
  return response.json();
};

const useAuth = (): UseAuth => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [errors, setErrors] = useState<ErrorsType | string>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [isLoadingFacebook, setIsLoadingFacebook] = useState(false);

  const clearState = () => {
    setErrors(null);
    setMessage(null);
  };

  const handleModeChange = useCallback(
    (mode: AuthMode) => {
      clearState();
      setMode(mode);
    },
    [clearState]
  );

  const handleSubmitForm = useCallback(
    async (formData: FormData) => {
      clearState();
      setIsLoading(true);
      // Zod schema validated data
      try {
        const formObject = Object.fromEntries(formData.entries());
        let schema;
        let validatedData;
        switch (mode) {
          case "login":
            schema = loginSchema;
            break;
          case "signup":
            schema = signupSchema;
            break;
          case "forgot-password":
            schema = forgotPasswordSchema;
            break;
        }
        try {
          validatedData = schema.parse(formObject);
        } catch (error) {
          if (error instanceof z.ZodError) {
            const zodErrors = error.issues.reduce((acc, issue) => {
              const path = issue.path[0] as string;
              acc[path] = issue.message;
              return acc;
            }, {} as { [key: string]: string });
            setErrors(zodErrors);
            console.error(
              "Unknown error occurred during zod authentication in useAuth",
              error as Error
            );
            return;
          }
          setErrors("表單驗證過程中發生未知錯誤，請稍後再試");
          throw new Error(
            `Unknown error occurred during ${mode} form validation`,
            error as Error
          );
        }

        // API call
        let response;
        switch (mode) {
          case "login":
            response = await callApi("/api/auth/login", validatedData);
            break;
          case "signup":
            response = await callApi("/api/auth/signup", validatedData);
            break;
          case "forgot-password":
            response = await callApi(
              "/api/auth/forgot-password",
              validatedData
            );
            break;
        }
        setMessage(
          mode === "login"
            ? "登入成功"
            : mode === "signup"
            ? "註冊成功"
            : "密碼重置郵件已發送"
        );
        return response;
      } catch (error) {
        setErrors({
          global: error instanceof Error ? error.message : "發生未知錯誤",
        });
        console.error(
          `Unknown error occurred during API call for ${mode} operation`,
          error as Error
        );
      } finally {
        setIsLoading(false);
      }
    },
    [mode, clearState]
  );

  const handleProviderLogin = useCallback(
    async (provider: "google" | "facebook") => {
      clearState();
      const setIsLoading =
        provider === "google" ? setIsLoadingGoogle : setIsLoadingFacebook;
      setIsLoading(true);
      try {
        const authProvider =
          provider === "google"
            ? new GoogleAuthProvider()
            : new FacebookAuthProvider();
        const result = await signInWithPopup(firebaseAuth, authProvider);
        const user = result.user;
        const idToken = await user.getIdToken();
        const response = await fetch("/api/auth/third-party-auth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `Authentication failed: ${errorData.error || response.statusText}`
          );
        }
        const data = await response.json();
        setMessage("登入成功");
        return data;
      } catch (error) {
        console.error(
          "Unknown error occurred in third party auth login",
          error as Error
        );
        setErrors({
          global:
            error instanceof Error
              ? error.message
              : "第三方登入過程中發生未知錯誤",
        });
        throw new Error(
          "Unknown error occurred in handleProviderLogin",
          error as Error
        );
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoadingGoogle, setIsLoadingFacebook, setMessage, setErrors]
  );

  const safeErrors: Record<string, string> | null = errors
    ? Object.fromEntries(
        Object.entries(errors).filter(
          (entry): entry is [string, string] => entry[1] !== null
        )
      )
    : null;

  return {
    mode,
    errors: safeErrors,
    message,
    isLoading,
    isLoadingGoogle,
    isLoadingFacebook,
    handleModeChange,
    handleSubmitForm,
    handleProviderLogin,
    clearState,
  };
};

export default useAuth;
