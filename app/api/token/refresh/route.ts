/**
 * @swagger
 * /token/refresh:
 *   patch:
 *     summary: Refresh access token
 *     description: Validates the refresh token and updates the access token if valid.
 *     tags:
 *       - Token
 *     responses:
 *       200:
 *         description: Token updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token updated successfully"
 *       401:
 *         description: No token found or refresh token is not valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No token found"
 *       404:
 *         description: Refresh Token not found in the database
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Refresh Token not found in database"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Token refresh API internal server error"
 */

import { NextRequest, NextResponse } from "next/server";
import { tokenDB } from "@/src/libs/db/tokenDB";
import { refreshAccessToken, verifyToken } from "@/src/libs/token";

export async function POST(request: NextRequest) {
  const encryptedToken = request.cookies.get("token")?.value;
  if (!encryptedToken) {
    return NextResponse.json({ error: "No token found" }, { status: 401 });
  }
  try {
    const decryptedToken = JSON.parse(encryptedToken);
    const storedToken = await tokenDB.selectRefreshToken(
      decryptedToken.token.refreshToken
    );
    if (!storedToken) {
      return NextResponse.json(
        { error: "Refresh Token not found in database" },
        { status: 404 }
      );
    }
    let payload;
    try {
      payload = await verifyToken(decryptedToken.token.refreshToken);
    } catch (error) {
      console.error("Refresh token verification failed:", error);
      return NextResponse.json(
        { error: "Refresh token is not valid" },
        { status: 401 }
      );
    }

    let newToken;
    try {
      newToken = await refreshAccessToken(payload, decryptedToken);
    } catch (refreshError) {
      console.error("Failed to refresh access token:", refreshError);
      return NextResponse.json(
        {
          error: "Failed to refresh access token",
          details: (refreshError as Error).message,
        },
        { status: 400 }
      );
    }

    // Update the stored token with new access token
    try {
      const tokenUpdateDB = await tokenDB.updateToken(
        storedToken.refreshToken as string,
        newToken.accessToken,
        Date.now() + newToken.expiresAt * 1000
      );
      if (!tokenUpdateDB) {
        console.error(
          "Token update returned false. This might mean the token was not found in the database."
        );
        return NextResponse.json(
          { error: "Token not found or update failed in database" },
          { status: 404 }
        );
      }
    } catch (updateError) {
      console.error("Error during token update:", updateError);
      return NextResponse.json(
        { error: "Token update failed in database" },
        { status: 500 }
      );
    }

    // Create new encrypted token
    const newEncryptedToken = JSON.stringify({
      ...decryptedToken,
      token: {
        ...decryptedToken.token,
        accessToken: newToken.accessToken,
        expiresAt: Date.now() + newToken.expiresAt * 1000,
      },
    });

    // Set new token in cookie
    const response = NextResponse.json(
      {
        message: "Token updated successfully",
        data: JSON.parse(newEncryptedToken),
      },
      { status: 200 }
    );
    response.cookies.set("token", newEncryptedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("Error occurred in token refresh API:", error);
    return NextResponse.json(
      {
        error: "Token refresh API internal server error",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
