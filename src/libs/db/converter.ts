import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  DocumentData,
} from "firebase/firestore";
import {
  getFirestore,
  Timestamp,
  FirestoreDataConverter as AdminFirestoreDataConverter,
  QueryDocumentSnapshot as AdminQueryDocumentSnapshot,
} from "firebase-admin/firestore";

// import type {
//   ProjectInfo,
//   ProjectMetadata,
//   SerializedTimestamp,
// } from "@/src/types/project";
import type { StoredToken } from "@/src/types/tokenTypes";

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

// Project converter
// const projectInfoConverter: FirestoreDataConverter<ProjectInfo> = {
//   toFirestore(projectInfo: ProjectInfo): DocumentData {
//     const converted = convertKeys(projectInfo, toSnakeCase);
//     Object.keys(converted).forEach(
//       (key) => converted[key] === undefined && delete converted[key]
//     );
//     return converted;
//   },
//   fromFirestore(
//     snapshot: QueryDocumentSnapshot,
//     options: SnapshotOptions
//   ): ProjectInfo {
//     const data = snapshot.data(options);
//     const converted = convertKeys(data, toCamelCase);
//     return converted as ProjectInfo;
//   },
// };

// const projectMetadataConverter: FirestoreDataConverter<ProjectMetadata> = {
//   toFirestore(projectMetadata: ProjectMetadata): DocumentData {
//     return projectMetadata;
//   },
//   fromFirestore(
//     snapshot: QueryDocumentSnapshot,
//     options: SnapshotOptions
//   ): ProjectMetadata {
//     const data = snapshot.data(options);
//     return {
//       projectId: snapshot.id,
//       name: data.name,
//       screenshotUrl: data.screenshot_url,
//       lastModified: data.last_modified as SerializedTimestamp,
//       createdAt: data.created_at as SerializedTimestamp,
//     };
//   },
// };

// Stored token converter
const storedTokenConverter: AdminFirestoreDataConverter<StoredToken> = {
  toFirestore: (token: StoredToken) => {
    const converted = convertKeys(token, toSnakeCase);
    // Convert JavaScript Date to Firestore Timestamp
    if (converted.expiresAt instanceof Date) {
      converted.expiresAt = Timestamp.fromDate(converted.expiresAt);
    }
    return converted;
  },
  fromFirestore(snapshot: AdminQueryDocumentSnapshot): StoredToken {
    const data = snapshot.data();
    const converted = convertKeys(data, toCamelCase);
    // Convert Firestore Timestamp to JavaScript Date
    if (converted.expiresAt && converted.expiresAt instanceof Timestamp) {
      converted.expiresAt = converted.expiresAt.toDate();
    }
    return converted as StoredToken;
  },
};

// export { projectInfoConverter, projectMetadataConverter, storedTokenConverter };
export { storedTokenConverter };
