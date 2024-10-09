/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: User Signup
 *     description: Registers a new user with email and password
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
 *               - username
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: 用戶的電子郵件地址
 *                 example: example@email.com
 *               username:
 *                 type: string
 *                 description: 用戶的顯示名稱
 *                 example: exampleuser
 *               password:
 *                 type: string
 *                 format: password
 *                 description: 用戶的密碼（至少6個字符）
 *                 example: strongpassword123
 *     responses:
 *       200:
 *         description: 註冊成功
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
 *                       description: 用戶的唯一識別碼
 *                     username:
 *                       type: string
 *                       description: 用戶的顯示名稱
 *                     email:
 *                       type: string
 *                       description: 用戶的電子郵件地址
 *                 message:
 *                   type: string
 *                   example: 註冊成功
 *       400:
 *         description: 無效的輸入數據或憑證
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: 錯誤描述
 *                   example: 電子郵件已被使用
 *       500:
 *         description: 內部伺服器錯誤
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: 錯誤描述
 *                   example: 內部伺服器錯誤
 */

import { NextRequest, NextResponse } from "next/server";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { firebaseAuth } from "@/src/configs/firebaseClient";
import { z } from "zod";
import { signupSchema } from "@/src/libs/schemas/authSchema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, username, password } = signupSchema.parse(body);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      const user = userCredential.user;
      await updateProfile(user, { displayName: username });
      const response = NextResponse.json({
        user: {
          id: user.uid,
          username: username,
          email: user.email,
        },
        message: "註冊成功",
      });
      return response;
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.error(
          "Unknown error occurred in Firebase signup API",
          error as Error
        );
        switch (error.code as string) {
          case "auth/email-already-in-use":
            return NextResponse.json(
              { error: "電子郵件已被使用" },
              { status: 400 }
            );
          case "auth/invalid-email":
            return NextResponse.json(
              { error: "電子郵件格式不正確" },
              { status: 400 }
            );
          case "auth/weak-password":
            return NextResponse.json(
              { error: "密碼過於簡單" },
              { status: 400 }
            );
          default:
            return NextResponse.json(
              { error: "創建帳號失敗" },
              { status: 500 }
            );
        }
      }
      throw new Error("Unknown error occurred in signup API", error as Error);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(
        "Unknown error occurred during zod authentication in login API",
        error as Error
      );
      return NextResponse.json(
        { error: "輸入資料無效", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Unknown error occurred in login API", error as Error);
    return NextResponse.json({ error: "內部伺服器錯誤" }, { status: 500 });
  }
}
