"use client";

import React, { useCallback, useRef, useState } from "react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import Link from "next/link";
import styled from "styled-components";
import PasswordInput from "@/src/components/home/auth/PasswordInput";
import Button from "@/src/ui/Button";
import { AuthMode, ErrorsType } from "@/src/hooks/useAuth";

export const Title = styled.h1`
  text-align: center;
  margin-bottom: 1rem;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 1rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  font-size: 1rem;
  &::placeholder {
    color: ${(props) => props.theme.colors.secondaryText};
  }
  &:focus {
    border-color: ${(props) => props.theme.colors.border};
    box-shadow: 0 0 0 2px ${(props) => props.theme.colors.shadow}
    outline: none;
  }
`;

export const InputWrapper = styled.div`
  position: relative;
`;

export const Label = styled.label`
  margin-bottom: 0.4rem;
  font-weight: bold;
  font-size: 0.875rem;
`;

export const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 1rem 0;
  &::before,
  &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid ${(props) => props.theme.colors.border};
  }
  span {
    padding: 0 10px;
  }
`;

export const Footer = styled.footer`
  text-align: center;
  margin-top: 1rem;
`;

export const ForgotPasswordWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
`;

export const ForgotPassword = styled(Link)`
  color: ${(props) => props.theme.colors.accent};
  text-decoration: none;
  text-align: right;
`;

export const ErrorMessage = styled.span`
  color: ${(props) => props.theme.colors.danger};
`;

export const SuccessMessage = styled.span`
  color: ${(props) => props.theme.colors.success};
`;

export const EyeButton = styled.button`
  all: unset;
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${(props) => props.theme.colors.text};
  width: 1rem;
  height: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  &:focus {
    outline: revert;
  }
`;

export const ButtonWrapper = styled.div`
  margin-bottom: 0.25rem; // 4px
`;

export const Or = styled.span`
  margin: 10px 0;
  color: ${(props) => props.theme.colors.text};
  font-size: 10px;
`;

interface SignupFormProps {
  message: string | null;
  errors: ErrorsType;
  isLoading: boolean;
  onSubmit: (formData: FormData) => Promise<void>;
  onModeChange: (mode: AuthMode) => void;
}

interface LoginFormProps {
  message: string | null;
  errors: ErrorsType;
  isLoading: boolean;
  isLoadingGoogle: boolean;
  isLoadingFacebook: boolean;
  onSubmit: (formData: FormData) => Promise<void>;
  onModeChange: (mode: AuthMode) => void;
  onProviderLogin: (provider: "google" | "facebook") => Promise<any>;
}

interface ForgotPasswordFormProps {
  message: string | null;
  errors: ErrorsType;
  isLoading: boolean;
  onSubmit: (formData: FormData) => Promise<void>;
  onModeChange: (mode: AuthMode) => void;
}

interface AuthFormProps {
  mode: "login" | "signup" | "forgot-password";
  message: string | null;
  errors: ErrorsType;
  isLoading: boolean;
  isLoadingGoogle: boolean;
  isLoadingFacebook: boolean;
  onSubmit: (formData: FormData) => Promise<void>;
  onModeChange: (mode: "login" | "signup" | "forgot-password") => void;
  onProviderLogin: (provider: "google" | "facebook") => Promise<any>;
}

const SignupForm: React.FC<SignupFormProps> = ({
  message,
  errors,
  isLoading,
  onSubmit,
  onModeChange,
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        if (formRef.current) {
          await onSubmit(new FormData(formRef.current));
          setFormData({
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
          });
        }
      } catch (error) {
        console.error(
          "Unknown error occurred while SignupForm handleSubmit",
          error as Error
        );
      }
    },
    [onSubmit]
  );

  return (
    <>
      <Title>建立帳號</Title>
      <form ref={formRef} onSubmit={handleSubmit}>
        <Wrapper>
          <Label htmlFor="username">用戶名</Label>
          <Input
            id="username"
            name="username"
            type="text"
            placeholder="請輸入用戶名..."
            value={formData.username}
            onChange={handleModeChange}
            required
          />
          {errors?.username && <ErrorMessage>{errors.username}</ErrorMessage>}
        </Wrapper>
        <Wrapper>
          <Label htmlFor="email">電子郵件</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="請輸入電子郵件..."
            value={formData.email}
            onChange={handleModeChange}
            autoComplete="username"
            required
          />
          {errors?.email && <ErrorMessage>{errors.email}</ErrorMessage>}
        </Wrapper>
        <PasswordInput
          label="密碼"
          name="password"
          id="password"
          placeholder="請輸入密碼..."
          value={formData.password}
          onChange={handleModeChange}
          isNewPassword={true}
        />
        {errors?.password && <ErrorMessage>{errors.password}</ErrorMessage>}
        <PasswordInput
          label="確認密碼"
          name="confirmPassword"
          id="confirmPassword"
          placeholder="請再次輸入密碼..."
          value={formData.confirmPassword}
          onChange={handleModeChange}
          isNewPassword={true}
        />
        {errors?.confirmPassword && (
          <ErrorMessage>{errors.confirmPassword}</ErrorMessage>
        )}
        {message && <SuccessMessage>{message}</SuccessMessage>}
        {errors?.global && <ErrorMessage>{errors.global}</ErrorMessage>}
        <Button type="submit" disabled={isLoading} $fullWidth>
          {isLoading ? "註冊中..." : "註冊"}
        </Button>
      </form>
      <Footer>
        <span>
          已經有帳號了？
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onModeChange("login");
            }}
          >
            登入
          </Link>
        </span>
      </Footer>
    </>
  );
};

const LoginForm: React.FC<LoginFormProps> = ({
  message,
  errors,
  isLoading,
  isLoadingGoogle,
  isLoadingFacebook,
  onSubmit,
  onModeChange,
  onProviderLogin,
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        if (formRef.current) {
          await onSubmit(new FormData(formRef.current));
          setFormData({ email: "", password: "" });
        }
      } catch (error) {
        console.error(
          "Unknown error occurred LoginForm handleSubmit",
          error as Error
        );
      }
    },
    [onSubmit]
  );

  return (
    <>
      <Title>歡迎回來！</Title>
      <form ref={formRef} onSubmit={handleSubmit}>
        <Wrapper>
          <Label htmlFor="email">電子郵件</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="請輸入電子郵件..."
            value={formData.email}
            onChange={handleModeChange}
            required
            autoComplete="username"
          />
          {errors?.email && <ErrorMessage>{errors.email}</ErrorMessage>}
        </Wrapper>
        <PasswordInput
          label="密碼"
          name="password"
          id="password"
          placeholder="請輸入密碼..."
          value={formData.password}
          onChange={handleModeChange}
          autoComplete="current-password"
        />
        {errors?.password && <ErrorMessage>{errors.password}</ErrorMessage>}
        <ForgotPasswordWrapper>
          <ForgotPassword
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onModeChange("forgot-password");
            }}
          >
            忘記密碼？
          </ForgotPassword>
        </ForgotPasswordWrapper>
        {message && <SuccessMessage>{message}</SuccessMessage>}
        {errors?.global && <ErrorMessage>{errors.global}</ErrorMessage>}
        <Button type="submit" disabled={isLoading} $fullWidth>
          {isLoading ? "登入中..." : "登入"}
        </Button>
      </form>
      <Divider>
        <Or>或</Or>
      </Divider>
      <ButtonWrapper>
        <Button
          $variant="outlined"
          onClick={() => onProviderLogin("google")}
          disabled={isLoadingGoogle}
          $fullWidth
        >
          <FaGoogle /> Google
          {isLoadingGoogle ? "登入中..." : "登入"}
        </Button>
      </ButtonWrapper>
      <ButtonWrapper>
        <Button
          $variant="outlined"
          onClick={() => onProviderLogin("facebook")}
          disabled={isLoadingFacebook}
          $fullWidth
        >
          <FaFacebook /> Facebook
          {isLoadingFacebook ? "登入中..." : "登入"}
        </Button>
      </ButtonWrapper>
      <Footer>
        <span>
          還沒有帳號？
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onModeChange("signup");
            }}
          >
            立即註冊
          </Link>
        </span>
      </Footer>
    </>
  );
};

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  message,
  errors,
  isLoading,
  onSubmit,
  onModeChange,
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    email: "",
  });

  const handleModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        if (formRef.current) {
          await onSubmit(new FormData(formRef.current));
          setFormData({ email: "" });
        }
      } catch (error) {
        console.error(
          "Unknown error occurred while ForgotPasswordForm handleSubmit",
          error as Error
        );
      }
    },
    [onSubmit]
  );

  return (
    <>
      <Title>重設密碼</Title>
      <form ref={formRef} onSubmit={handleSubmit}>
        <Wrapper>
          <Label htmlFor="email">電子郵件</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="請輸入您的電子郵件..."
            value={formData.email}
            onChange={handleModeChange}
            required
          />
          {errors?.email && <ErrorMessage>{errors.email}</ErrorMessage>}
        </Wrapper>
        {message && <SuccessMessage>{message}</SuccessMessage>}
        {errors?.global && <ErrorMessage>{errors.global}</ErrorMessage>}
        <Button type="submit" disabled={isLoading} $fullWidth>
          {isLoading ? "發送中..." : "發送重設密碼郵件"}
        </Button>
      </form>
      <Footer>
        <span>
          想起密碼了？
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onModeChange("login");
            }}
          >
            返回登入
          </Link>
        </span>
      </Footer>
    </>
  );
};

const AuthForm: React.FC<AuthFormProps> = ({
  mode,
  errors,
  message,
  isLoading,
  isLoadingGoogle,
  isLoadingFacebook,
  onSubmit,
  onModeChange,
  onProviderLogin,
}) => {
  switch (mode) {
    case "signup":
      return (
        <SignupForm
          errors={errors}
          message={message}
          isLoading={isLoading}
          onSubmit={onSubmit}
          onModeChange={onModeChange}
        />
      );
    case "login":
      return (
        <LoginForm
          errors={errors}
          message={message}
          isLoading={isLoading}
          isLoadingGoogle={isLoadingGoogle}
          isLoadingFacebook={isLoadingFacebook}
          onSubmit={onSubmit}
          onModeChange={onModeChange}
          onProviderLogin={onProviderLogin}
        />
      );
    case "forgot-password":
      return (
        <ForgotPasswordForm
          errors={errors}
          message={message}
          isLoading={isLoading}
          onSubmit={onSubmit}
          onModeChange={onModeChange}
        />
      );
    default:
      return null;
  }
};

export default AuthForm;
