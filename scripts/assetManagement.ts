import { readAssetFile, createAssets } from "../src/libs/createAsset.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function assetManagement() {
  try {
    const filePath = path.join(__dirname, "../src/configs/json/assets.json");
    const assetRoot = await readAssetFile(filePath);
    const createdAsset = await createAssets(assetRoot);
    console.log("Created asset", JSON.stringify(createdAsset, null, 2));
  } catch (error) {
    console.error("Asset management process failed", error as Error);
    process.exit(1);
  }
}

assetManagement();
