/**
 * @swagger
 * /token:
 *   get:
 *     summary: Validate and retrieve token data
 *     description: Validates the access token from cookies and retrieves its associated data.
 *     tags:
 *       - Token
 *     responses:
 *       200:
 *         description: Token is valid and data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: object
 *                       properties:
 *                         accessToken:
 *                           type: string
 *                         refreshToken:
 *                           type: string
 *       401:
 *         description: No token found or token is not valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No token found"
 *       404:
 *         description: Refresh Token not found in the Token database
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Refresh Token not found in Token database"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Token data API internal server error"
 */

import { NextRequest, NextResponse } from "next/server";
import { tokenDB } from "@/src/libs/db/tokenDB";
import { verifyToken } from "@/src/libs/token";

export async function GET(request: NextRequest) {
  const encryptedToken = request.cookies.get("token")?.value;
  if (!encryptedToken) {
    return NextResponse.json({ error: "No token found" }, { status: 401 });
  }
  try {
    const decryptedToken = JSON.parse(encryptedToken);
    let payload;
    try {
      payload = await verifyToken(decryptedToken.token.accessToken);
    } catch (verifyError) {
      console.error("Token verification failed:", verifyError);
      return NextResponse.json(
        { error: "Token is not valid" },
        { status: 401 }
      );
    }

    if (!payload) {
      return NextResponse.json(
        { error: "Token is not valid" },
        { status: 401 }
      );
    }

    const storedToken = await tokenDB.selectRefreshToken(
      decryptedToken.token.refreshToken
    );
    if (!storedToken) {
      return NextResponse.json(
        { error: "Refresh Token not found in Token database" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: decryptedToken });
  } catch (error) {
    console.error("Error in token data API", error);
    return NextResponse.json(
      { error: "Token data API internal server error" },
      { status: 500 }
    );
  }
}
