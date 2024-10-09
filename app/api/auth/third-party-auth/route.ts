/**
 * @swagger
 * /auth/third-party-auth:
 *   post:
 *     summary: Authenticate user and generate tokens
 *     description: Validates the provided ID token, retrieves user information, and generates access and refresh tokens.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               authorization:
 *                 type: string
 *     responses:
 *       200:
 *         description: 令牌生成成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *       401:
 *         description: 未提供令牌
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       403:
 *         description: 無效的令牌
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: 找不到用戶
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: 內部伺服器錯誤
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

import { v4 as uuidv4 } from "uuid";
import { NextRequest, NextResponse } from "next/server";
import { adminFirebaseAuth } from "@/src/configs/firebaseAdmin";
import { insertToken } from "@/src/libs/token";
import { cookies } from "next/headers";
import type {
  UserTokenData,
  UserData,
  TokenData,
  StoredToken,
} from "@/src/types/tokenTypes";
import { tokenDB } from "@/src/libs/db/tokenDB";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "未提供令牌" }, { status: 401 });
    }
    const token = authHeader.split("Bearer ")[1];

    // Verify token
    let decodedToken;
    try {
      decodedToken = await adminFirebaseAuth.verifyIdToken(token);
    } catch (error) {
      console.error("驗證 ID 令牌時出錯", error as Error);
      return NextResponse.json({ error: "無效的令牌" }, { status: 403 });
    }
    // Get user record info
    let userRecord;
    try {
      userRecord = await adminFirebaseAuth.getUser(decodedToken.uid);
    } catch (error) {
      console.error("獲取用戶記錄時出錯", error as Error);
      return NextResponse.json({ error: "找不到用戶" }, { status: 404 });
    }

    // Create access & refresh token
    const clientId = uuidv4();
    const userData: UserData = {
      sub: userRecord.uid,
      email: userRecord.email as string,
      username: userRecord.displayName as string,
      avatarUrl: userRecord.photoURL,
    };
    const tokenData: TokenData = await insertToken(userData, clientId);

    const userTokenData: UserTokenData = {
      user: userData,
      token: tokenData,
    };

    // Store tokens in tokenDB
    const storedToken = {
      accessToken: tokenData.accessToken,
      refreshToken: tokenData.refreshToken,
      userId: userData.sub,
      clientId: clientId,
      scope: ["read", "write"],
      expiresAt: Date.now() + tokenData.expiresAt * 1000,
    } as StoredToken;
    await tokenDB.insertToken(storedToken);

    // Set the token as an HTTP-only cookie
    const userTokenDataString = JSON.stringify(userTokenData);
    cookies().set("token", userTokenDataString, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: "/",
    });
    return NextResponse.json(
      { success: true, token: tokenData },
      { status: 200 }
    );
  } catch (error) {
    console.error("第三方認證 API 中發生未知錯誤", error as Error);
    return NextResponse.json(
      { error: "第三方認證 API 內部伺服器錯誤" },
      { status: 500 }
    );
  }
}
