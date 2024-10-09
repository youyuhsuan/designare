/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user with email and password, and returns user information and token
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: 登入成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     username:
 *                       type: string
 *                     avatarUrl:
 *                       type: string
 *                 token:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *       400:
 *         description: 無效的輸入數據或憑證
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 details:
 *                   type: array
 *                   items:
 *                     type: object
 *       403:
 *         description: 帳戶已停用
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

import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { FirebaseError } from "firebase/app";
import { firebaseAuth } from "@/src/configs/firebaseClient";
import { signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { z } from "zod";
import { loginSchema } from "@/src/libs/schemas/authSchema";
import { insertToken } from "@/src/libs/token";
import type {
  StoredToken,
  TokenData,
  UserData,
  UserTokenData,
} from "@/src/types/tokenTypes";
import { tokenDB } from "@/src/libs/db/tokenDB";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);
    try {
      const userCredential = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      const user = userCredential.user;

      // Create access & refresh token
      const clientId = uuidv4();
      const userData: UserData = {
        sub: user.uid,
        email: user.email as string,
        username: user.displayName,
        avatarUrl: user.photoURL,
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
      if (error instanceof FirebaseError) {
        console.error("Firebase 登入過程中發生未知錯誤", error as Error);
        switch (error.code) {
          case "auth/invalid-credential":
            return NextResponse.json(
              { error: "無效的電子郵件或密碼" },
              { status: 400 }
            );
          case "auth/user-disabled":
            return NextResponse.json(
              { error: "此帳戶已被停用" },
              { status: 403 }
            );
          case "auth/user-not-found":
            return NextResponse.json(
              { error: "找不到該使用者" },
              { status: 404 }
            );
          default:
            return NextResponse.json({ error: "登入失敗" }, { status: 500 });
        }
      }
      throw new Error("登入 API 中發生未知錯誤", error as Error);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("登入 API 的 Zod 驗證過程中發生未知錯誤", error as Error);
      return NextResponse.json(
        { error: "輸入資料無效", details: error.errors },
        { status: 400 }
      );
    }
    console.error("登入 API 中發生未知錯誤", error as Error);
    return NextResponse.json({ error: "內部伺服器錯誤" }, { status: 500 });
  }
}
