/**
 * @swagger
 * /api/assets:
 *   post:
 *     summary: Insert a new asset
 *     description: Creates a new asset in the database
 *     tags:
 *       - Assets
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssetRootWrite'
 *     responses:
 *       200:
 *         description: Insert asset successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Insert asset successful."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   get:
 *     summary: Get asset by name
 *     description: Retrieves an asset from the database by its name
 *     tags:
 *       - Assets
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the asset to retrieve
 *     responses:
 *       200:
 *         description: Asset found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Asset'
 *       400:
 *         description: Asset name is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Asset not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * components:
 *   schemas:
 *     AssetRootWrite:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Asset name
 *
 *     Asset:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier of the asset
 *         name:
 *           type: string
 *           description: Asset name
 *         # Add other properties as needed
 *
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message
 *         details:
 *           type: object
 *           description: Error details
 */

import { NextRequest, NextResponse } from "next/server";
import assetDB from "@/src/libs/db/assetDB";
import type { AssetRootWrite } from "@/src/types/assetTypes";

// Insert asset
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await assetDB.insertAsset(body as AssetRootWrite);
    if (result) {
      return NextResponse.json(
        { message: "Insert asset successful." },
        { status: 200 }
      );
    } else {
      throw new Error("Asset insertion failed");
    }
  } catch (error) {
    console.error("Error inserting asset", error as Error);
    return NextResponse.json(
      {
        error: "Unknown error occurred while insertAssets API",
        details: error as Error,
      },
      { status: 500 }
    );
  }
}

// Get asset by name
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");
    if (!name) {
      return NextResponse.json(
        { error: "Asset name is required" },
        { status: 400 }
      );
    }
    const data = await assetDB.selectByNameAsset(name as string);
    if (!data) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error getting asset by name", error as Error);
    return NextResponse.json(
      {
        error: "Unknown error occurred while getAssetByName API",
        details: error as Error,
      },
      { status: 500 }
    );
  }
}
