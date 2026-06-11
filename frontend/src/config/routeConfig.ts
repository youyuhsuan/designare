const ROUTE_CONFIGS = {
  HOME: "/",
  ABOUT: "/about",
  AUTH: "/auth",
  AUTH_LOGIN: "/auth/login",
  AUTH_REGISTER: "/auth/register",
  AUTH_FORGOT_PASSWORD: "/auth/forgot-password",
  AUTH_RESET_PASSWORD: "/auth/reset-password",
  OAUTH: "/oauth/callback",
  SETTING: "/settings",
  SHRINES: "/shrines",
} as const;

export default ROUTE_CONFIGS;
