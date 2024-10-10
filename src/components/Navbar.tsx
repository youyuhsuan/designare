"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import AuthForm from "@/src/components/home/auth/AuthForm";
import UserMenu from "@/src/components/home/auth/UserMenu";
import Dialog from "@/src/ui/Dialog";
import useToken from "@/src/hooks/useToken";
import useAuth from "@/src/hooks/useAuth";

const NavbarWrapper = styled.nav`
  width: 100%;
  padding: 1rem 0;
`;

const NavbarContent = styled.div`
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
`;

const NavbarBrand = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`;

const NavbarItems = styled.div`
  display: flex;
  gap: 2rem;
`;

const NavbarItem = styled.div`
  height: 100%;
  text-space: 0.2rem;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const NavbarLink = styled(Link)`
  color: ${(props) => props.theme.colors.primaryText};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

// Convert ACCESS_TOKEN_EXPIRATION from environment variable (string) to number
const ACCESS_TOKEN_EXPIRATION = Number(
  process.env.NEXT_PUBLIC_ACCESS_TOKEN_EXPIRATION || 3600
);

// Calculate token validation check interval
const CHECK_INTERVAL = Math.min(
  Math.max(
    60 * 1000, // 1 minute minimum
    (ACCESS_TOKEN_EXPIRATION * 1000) / 10 // 10% of token lifetime
  ),
  60 * 60 * 1000 // 1 hour maximum
);

const Navbar = () => {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const { token, fetchToken, deleteToken } = useToken();
  const {
    mode,
    errors,
    message,
    isLoading,
    isLoadingGoogle,
    isLoadingFacebook,
    handleModeChange,
    handleSubmitForm,
    handleProviderLogin,
    clearState,
  } = useAuth();
  const [countdown, setCountdown] = useState<number | null>(null);
  const hasStartedRef = useRef(false);

  // Control auth dialog
  const openAuthDialog = (mode: "login" | "signup" | "forgot-password") => {
    handleModeChange(mode);
    setIsAuthDialogOpen(true);
  };

  const closeAuthDialog = () => {
    setIsAuthDialogOpen(false);
    clearState();
  };

  // Handle user login & logout
  const handleLogin = async (formData: FormData) => {
    await handleSubmitForm(formData);
    if (!errors) {
      await fetchToken();
    }
  };

  // Separate countdown timer
  useEffect(() => {
    let countdownTimer: NodeJS.Timeout;
    if (countdown !== null && countdown > 0) {
      countdownTimer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      window.location.href = window.location.href;
    }
    return () => {
      if (countdownTimer) {
        clearTimeout(countdownTimer);
      }
    };
  }, [countdown]);

  // Handle login success message
  useEffect(() => {
    if (message === "登入成功" && !hasStartedRef.current) {
      hasStartedRef.current = true;
      setCountdown(5);
    }
    if (message === "註冊成功" || message === "密碼重置郵件已發送") {
      const clearMessageTimer = setTimeout(() => {
        clearState();
        handleModeChange("login");
      }, 3000);
      return () => clearTimeout(clearMessageTimer);
    }
  }, [message, clearState]);

  // Reset hasStartedRef
  useEffect(() => {
    return () => {
      hasStartedRef.current = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await deleteToken();
      window.location.reload();
    } catch (error) {
      console.error(
        "Unknown error occurred while handleLogout",
        error as Error
      );
    }
  };

  // Validate token
  useEffect(() => {
    const checkToken = async () => {
      const tokenData = await fetchToken();
      if (!tokenData) {
        await deleteToken();
      }
    };
    checkToken();

    const intervalId = setInterval(checkToken, CHECK_INTERVAL); // 30sec

    return () => clearInterval(intervalId);
  }, [fetchToken, deleteToken, CHECK_INTERVAL]);

  return (
    <NavbarWrapper>
      <NavbarContent>
        <NavbarBrand>
          <NavbarLink href="/">Designare</NavbarLink>
        </NavbarBrand>
        <NavbarItems>
          {token && token.user ? (
            <UserMenu
              username={token.user.username || "User"}
              email={token.user.email || ""}
              avatarUrl={token.user.avatarUrl || ""}
              handleLogout={handleLogout}
            />
          ) : (
            <>
              <NavbarItem>
                <NavbarLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    openAuthDialog("login");
                  }}
                >
                  登入
                </NavbarLink>
              </NavbarItem>
              <NavbarItem>
                <NavbarLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    openAuthDialog("signup");
                  }}
                >
                  註冊
                </NavbarLink>
                <Dialog
                  isOpen={isAuthDialogOpen}
                  onClose={closeAuthDialog}
                  variant="auth"
                >
                  <AuthForm
                    mode={mode}
                    errors={errors}
                    message={message}
                    isLoading={isLoading}
                    isLoadingGoogle={isLoadingGoogle}
                    isLoadingFacebook={isLoadingFacebook}
                    onSubmit={handleLogin}
                    onModeChange={handleModeChange}
                    onProviderLogin={handleProviderLogin}
                  />
                </Dialog>
              </NavbarItem>
            </>
          )}
        </NavbarItems>
      </NavbarContent>
    </NavbarWrapper>
  );
};

export default Navbar;
