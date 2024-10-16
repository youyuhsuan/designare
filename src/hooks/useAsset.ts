"use client";

import { AssetTypeBasic } from "@/src/types/assetTypes";
import { firebaseDB } from "@/src/configs/firebaseClient";
import { assetTypeConverter } from "@/src/libs/db/converterClient";
import { FirebaseError } from "firebase/app";
import { collection, getDocs } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";

// Collection Setting
const ASSETS_COLLECTION = "assets";

// Fetch all assets from firebase assets database
const fetchAllAssets = async (): Promise<AssetTypeBasic[]> => {
  try {
    const assetsRef = collection(firebaseDB, ASSETS_COLLECTION).withConverter(
      assetTypeConverter
    );
    const querySnapshot = await getDocs(assetsRef);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      type: doc.data().type,
      icon: doc.data().icon,
    }));
  } catch (error) {
    if (error instanceof FirebaseError) {
      console.error("Firebase error:", error.code, error.message);
      throw new Error(`Firebase error while selecting asset: ${error.message}`);
    } else {
      console.error("Unknown error:", error as Error);
      throw new Error(
        "Unknown error occured while selecting asset",
        error as Error
      );
    }
  }
};

// useAsset hook
const useAsset = () => {
  const [allAssets, setAllAssets] = useState<AssetTypeBasic[] | []>([]);
  const [isLoadingAllAssets, setIsLoadingAllAssets] = useState(false);
  const [allAssetsError, setAllAssetsError] = useState<Error | null>(null);

  // fetch all assets
  const fetchAllAssetsHandler = useCallback(async () => {
    setIsLoadingAllAssets(true);
    setAllAssetsError(null);
    try {
      const assets = await fetchAllAssets();
      setAllAssets(assets);
    } catch (error) {
      setAllAssetsError(
        error instanceof Error ? error : new Error("Unknown error")
      );
      setAllAssets([]);
    } finally {
      setIsLoadingAllAssets(false);
    }
  }, []);

  useEffect(() => {
    fetchAllAssetsHandler();
  }, [fetchAllAssetsHandler]);

  return {
    allAssets,
    isLoadingAllAssets,
    allAssetsError,
    fetchAllAssetsHandler,
  };
};

export default useAsset;
