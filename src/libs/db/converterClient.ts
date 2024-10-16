import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  DocumentData,
} from "firebase/firestore";
import type { AssetTypeBasic } from "@/src/types/assetTypes";

const toSnakeCase = (str: string) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

const toCamelCase = (str: string) =>
  str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

const convertKeys = (obj: any, converter: (key: string) => string): any => {
  if (Array.isArray(obj)) {
    return obj.map((v) => convertKeys(v, converter));
  } else if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((result, key) => {
      result[converter(key)] = convertKeys(obj[key], converter);
      return result;
    }, {} as any);
  }
  return obj;
};

// AssetType converter
const assetTypeConverter: FirestoreDataConverter<AssetTypeBasic> = {
  toFirestore(assetType: AssetTypeBasic): DocumentData {
    const converted = convertKeys(assetType, toSnakeCase);
    Object.keys(converted).forEach(
      (key) => converted[key] === undefined && delete converted[key]
    );
    return converted;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): AssetTypeBasic {
    const data = snapshot.data(options);
    const converted = convertKeys(data, toCamelCase);
    return {
      id: snapshot.id,
      ...(converted as Omit<AssetTypeBasic, "id">),
    };
  },
};

export { assetTypeConverter };
