import { JWTPayload } from "jose";

interface UserData extends JWTPayload {
  sub: string;
  username: string | null;
  email: string;
  avatarUrl?: string | null;
}

interface TokenData {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
  tokenType: string;
}

interface UserTokenData {
  user: UserData;
  token: TokenData;
}

interface StoredToken {
  user: any;
  accessToken: string;
  refreshToken: string;
  userId: string;
  clientId: string;
  scope: string[];
  expiresAt: number;
}

export type { UserData, TokenData, UserTokenData, StoredToken };
