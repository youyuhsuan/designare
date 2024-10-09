/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: User forgot password
 *     description: Sends a password reset email to the provided email address
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: 密碼重置郵件成功發送
 *       400:
 *         description: 無效的輸入數據或找不到電子郵件
 *       429:
 *         description: 請求次數過多
 *       500:
 *         description: 內部伺服器錯誤
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { FirebaseError } from "firebase/app";
import { sendPasswordResetEmail } from "firebase/auth";
import { firebaseAuth } from "@/src/configs/firebaseClient";
import { forgotPasswordSchema } from "@/src/libs/schemas/authSchema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = forgotPasswordSchema.parse(body);
    try {
      await sendPasswordResetEmail(firebaseAuth, email);
      return NextResponse.json(
        { message: "密碼重設郵件已發送" },
        { status: 200 }
      );
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.error("在 Firebase 忘記密碼 API 中發生錯誤", error as Error);
        switch (error.code) {
          case "auth/invalid-email":
            return NextResponse.json(
              { error: "電子郵件格式無效" },
              { status: 400 }
            );
          case "auth/user-not-found":
            return NextResponse.json(
              { error: "找不到使用此電子郵件的帳戶" },
              { status: 400 }
            );
          case "auth/too-many-requests":
            return NextResponse.json(
              { error: "請求次數過多，請稍後再試" },
              { status: 429 }
            );
          default:
            return NextResponse.json(
              { error: "發送密碼重置郵件失敗" },
              { status: 500 }
            );
        }
      }
      console.error("在忘記密碼 API 中發生未知錯誤", error);
      return NextResponse.json({ error: "內部伺服器錯誤" }, { status: 500 });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("在忘記密碼 API 的 Zod 驗證過程中發生錯誤", error as Error);
      return NextResponse.json(
        { error: "輸入資料無效", details: error.errors },
        { status: 400 }
      );
    }
    console.error("在忘記密碼 API 中發生未知錯誤", error as Error);
    return NextResponse.json({ error: "內部伺服器錯誤" }, { status: 500 });
  }
}
