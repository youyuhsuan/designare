import { JWTPayload, SignJWT, jwtVerify } from "jose";
import { UserData, TokenData, UserTokenData } from "@/src/types/tokenTypes";

// Confing
const TOKEN_ALG: string = process.env.TOKEN_ALG as string;
const ACCESS_TOKEN_EXPIRATION = parseInt(
  process.env.ACCESS_TOKEN_EXPIRATION as string,
  10
);
const REFRESH_TOKEN_EXPIRATION = parseInt(
  process.env.REFRESH_TOKEN_EXPIRATION as string,
  10
);
const key = new TextEncoder().encode(process.env.JWT_SECRET);

async function insertToken(
  userData: UserData,
  clientId: string
): Promise<TokenData> {
  try {
    // Setting access & refresh token time
    const now = Math.floor(Date.now() / 1000);
    const accessTokenExpiration = now + ACCESS_TOKEN_EXPIRATION;
    const refreshTokenExpiration = now + REFRESH_TOKEN_EXPIRATION;

    // Create access & refresh token
    const accessToken = await new SignJWT({ ...userData, clientId: clientId })
      .setProtectedHeader({ alg: TOKEN_ALG })
      .setIssuedAt()
      .setExpirationTime(accessTokenExpiration)
      .sign(key);

    const refreshToken = await new SignJWT({
      sub: userData.sub,
      clientId: clientId,
    })
      .setProtectedHeader({ alg: TOKEN_ALG })
      .setIssuedAt()
      .setExpirationTime(refreshTokenExpiration)
      .sign(key);

    return {
      accessToken: accessToken,
      tokenType: "Bearer",
      expiresAt: ACCESS_TOKEN_EXPIRATION,
      refreshToken: refreshToken,
    };
  } catch (error) {
    console.error(
      "Unknown error occurred to create access token",
      error as Error
    );
    throw error as Error;
  }
}

async function verifyToken(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: [TOKEN_ALG],
    });

    const nowInSeconds = Math.floor(Date.now() / 1000);
    if (!payload) {
      throw new Error("Not payload");
    }
    if ((payload.exp as number) < nowInSeconds - 30) {
      throw new Error("Token expired");
    }
    return payload;
  } catch (error) {
    console.error("Invalid verify token", error as Error);
    throw error as Error;
  }
}

async function refreshAccessToken(
  payload: JWTPayload,
  decryptedToken: UserTokenData
): Promise<TokenData> {
  try {
    if (!payload.sub || !payload.clientId) {
      throw new Error("Invalid refresh token payload");
    }

    // Check if the refresh token is expired
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      throw new Error("Refresh token has expired");
    }

    const userData: UserData = {
      sub: payload.sub,
      email: decryptedToken.user.email,
      username: decryptedToken.user.username,
    };

    // Create only a new access token
    const accessTokenExpiration = now + ACCESS_TOKEN_EXPIRATION;

    const newAccessToken = await new SignJWT({
      ...userData,
      clientId: payload.clientId,
    })
      .setProtectedHeader({ alg: TOKEN_ALG })
      .setIssuedAt()
      .setExpirationTime(accessTokenExpiration)
      .sign(key);

    return {
      accessToken: newAccessToken,
      tokenType: "Bearer",
      expiresAt: ACCESS_TOKEN_EXPIRATION,
      refreshToken: decryptedToken.token.refreshToken,
    };
  } catch (error) {
    console.error("Error in refreshAccessToken", error as Error);
    throw error as Error;
  }
}

export { insertToken, verifyToken, refreshAccessToken };
