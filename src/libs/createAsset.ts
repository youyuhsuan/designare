import fs from "fs";
import axios from "axios";
import type { AssetRootWrite } from "@/src/types/assetTypes";

const readAssetFile = (filePath: string): AssetRootWrite => {
  try {
    const buffer = fs.readFileSync(filePath);
    return JSON.parse(buffer.toString()) as AssetRootWrite;
  } catch (error) {
    console.error("Error reading asset file:", error as Error);
    throw new Error("Failed to read asset file");
  }
};

const createAssets = async (
  assets: AssetRootWrite
): Promise<AssetRootWrite> => {
  try {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const response = await axios.post(`${baseURL}/api/assets`, assets, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Response received:", response.data);
    return response.data;
  } catch (error) {
    throw new Error(
      "An unknown error occurred while creating assets",
      error as Error
    );
  }
};

export { readAssetFile, createAssets };
