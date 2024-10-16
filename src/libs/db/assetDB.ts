import { adminFirebaseDB } from "@/src/configs/firebaseAdmin";
import type {
  AssetRootWrite,
  Property,
  Style,
  AssetType,
} from "@/src/types/assetTypes";
import { FirebaseError } from "firebase/app";

const ASSETS_COLLECTION = "assets";
const ASSET_TYPES_SUBCOLLECTION = "asset_types";
const ASSET_PROPERTIES_SUBCOLLECTION = "asset_properties";
const ASSET_STYLES_SUBCOLLECTION = "asset_styles";

const assetDB = {
  async insertAsset(asset: AssetRootWrite): Promise<string[]> {
    const batch = adminFirebaseDB.batch();
    const insertedIds: string[] = [];
    asset.assetTypes.forEach((assetItem) => {
      const assetRef = adminFirebaseDB.collection(ASSETS_COLLECTION).doc();
      const assetId = assetRef.id;
      insertedIds.push(assetId);

      // Insert main asset document
      batch.set(assetRef, {
        name: assetItem.name,
        type: assetItem.type,
        icon: assetItem.icon,
        description: assetItem.description,
      });

      // Insert main asset document
      batch.set(assetRef, {
        name: assetItem.name,
        type: assetItem.type,
        icon: assetItem.icon,
        description: assetItem.description,
      });

      // Insert asset type
      const assetTypeRef = assetRef.collection(ASSET_TYPES_SUBCOLLECTION).doc();
      batch.set(assetTypeRef, {
        name: assetItem.name,
        type: assetItem.type,
        icon: assetItem.icon,
        description: assetItem.description,
      });

      // Insert asset properties
      assetItem.properties.forEach((property) => {
        const assetPropertyRef = assetRef
          .collection(ASSET_PROPERTIES_SUBCOLLECTION)
          .doc();
        batch.set(assetPropertyRef, property);
      });

      // Insert asset item style
      assetItem.styles.forEach((style) => {
        const assetStyleRef = assetRef
          .collection(ASSET_STYLES_SUBCOLLECTION)
          .doc();
        batch.set(assetStyleRef, style);
      });
    });
    try {
      await batch.commit();
      console.log("Assets inserted successfully. IDs:", insertedIds);
      return insertedIds;
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.error("Firebase error:", error.code, error.message);
        throw new Error(
          `Firebase error while inserting asset: ${error.message}`
        );
      } else {
        console.error("Unknown error:", error as Error);
        throw new Error(
          `Unknown error occurred while inserting asset ${
            (error as Error).message
          }`
        );
      }
    }
  },
  async selectByNameAsset(name: string): Promise<AssetType | null> {
    try {
      const assetRef = adminFirebaseDB
        .collection(ASSETS_COLLECTION)
        .where("name", "==", name)
        .limit(1);
      const assetSnapshot = await assetRef.get();
      if (assetSnapshot.empty) {
        return null;
      }
      const assetDoc = assetSnapshot.docs[0];
      const assetData = assetDoc.data();
      const [propertiesSnapshot, stylesSnapshot] = await Promise.all([
        assetDoc.ref.collection(ASSET_PROPERTIES_SUBCOLLECTION).get(),
        assetDoc.ref.collection(ASSET_STYLES_SUBCOLLECTION).get(),
      ]);
      const asset: AssetType = {
        id: assetDoc.id,
        name: assetData.name,
        type: assetData.type,
        icon: assetData.icon || "",
        description: assetData.description,
        properties: propertiesSnapshot.docs.map((doc: { data: () => any }) =>
          doc.data()
        ) as Property[],
        styles: stylesSnapshot.docs.map((doc: { data: () => any }) =>
          doc.data()
        ) as Style[],
      };
      return asset as AssetType;
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.error(
          "Firebase error occurred while selectByNameAsset",
          error as Error
        );
      } else {
        console.error(
          "Unknown error occurred while select by name asset database",
          error as Error
        );
      }
      throw error as Error;
    }
  },
};

export default assetDB;
