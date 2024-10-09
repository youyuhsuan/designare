/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: User logout
 *     description: Logs out the user and clears the token cookie
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: 成功登出
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
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

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({
      message: "用戶成功登出",
      success: true,
    });
    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0),
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("登出 API 中發生未知錯誤", error as Error);
    return NextResponse.json(
      { error: "登出 API 內部伺服器錯誤" },
      { status: 500 }
    );
  }
}
