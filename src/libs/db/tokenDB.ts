import { adminFirebaseDB } from "@/src/configs/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";
import type { StoredToken } from "@/src/types/tokenTypes";
import { storedTokenConverter } from "@/src/libs/db/converterAdmin";

// Collection Setting
const TOKENS_COLLECTION = "tokens";

const tokenDB = {
  async insertToken(storedToken: StoredToken): Promise<string> {
    try {
      const docRef = await adminFirebaseDB
        .collection(TOKENS_COLLECTION)
        .withConverter(storedTokenConverter)
        .add(storedToken);
      return docRef.id;
    } catch (error) {
      throw new Error(
        "Unknown error occurred while inserting token",
        error as Error
      );
    }
  },

  async selectRefreshToken(refreshToken: string): Promise<StoredToken | null> {
    try {
      const snapshot = await adminFirebaseDB
        .collection(TOKENS_COLLECTION)
        .withConverter(storedTokenConverter)
        .where("refresh_token", "==", refreshToken)
        .get();
      if (snapshot.empty) {
        console.error(
          `No stored token found for refresh token ${refreshToken}`
        );
        return null;
      }
      return snapshot.docs[0].data();
    } catch (error) {
      throw new Error(
        "Unknown error occurred while getting token",
        error as Error
      );
    }
  },
  async deleteToken(refreshToken: string): Promise<boolean> {
    try {
      const snapshot = await adminFirebaseDB
        .collection(TOKENS_COLLECTION)
        .withConverter(storedTokenConverter)
        .where("refresh_token", "==", refreshToken)
        .get();
      if (snapshot.empty) {
        return false;
      }
      await snapshot.docs[0].ref.delete();
      return true;
    } catch (error) {
      throw new Error(
        "Unknown error occurred while deleting token",
        error as Error
      );
    }
  },
  async updateToken(
    refreshToken: string,
    newAccessToken: string,
    newExpiresAt: number
  ): Promise<boolean> {
    try {
      const snapshot = await adminFirebaseDB
        .collection(TOKENS_COLLECTION)
        .withConverter(storedTokenConverter)
        .where("refresh_token", "==", refreshToken)
        .get();
      if (snapshot.empty) {
        return false;
      }
      await snapshot.docs[0].ref.update({
        access_token: newAccessToken,
        expires_at: Timestamp.fromMillis(newExpiresAt),
      });
      return true;
    } catch (error) {
      console.error(`Error occurred while updating token:`, error as Error);
      return false;
    }
  },
};

export { tokenDB };
