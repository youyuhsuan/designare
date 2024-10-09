import { initializeApp, cert, getApps } from "firebase-admin/app";
import { Auth, getAuth } from "firebase-admin/auth";
import { Firestore, getFirestore } from "firebase-admin/firestore";

const serviceAccount = {
  type: "service_account",
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  privateKeyId: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY
    ? (process.env.FIREBASE_ADMIN_PRIVATE_KEY as string).replace(/\\n/g, "\n")
    : undefined,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  clientId: process.env.FIREBASE_ADMIN_CLIENT_ID,
  authUri: "https://accounts.google.com/o/oauth2/auth",
  tokenUri: "https://oauth2.googleapis.com/token",
  authProviderX509CertUrl:
    process.env.FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL,
  clientX509CertUrl: process.env.FIREBASE_ADMIN_CLIENT_X509_CERT_URL,
};

let adminFirebaseAuth: Auth;
let adminFirebaseDB: Firestore;

function initializeFirebase() {
  if (
    !serviceAccount.projectId ||
    !serviceAccount.clientEmail ||
    !serviceAccount.privateKey
  ) {
    throw new Error(
      "Missing required Firebase Admin SDK configuration. Check your environment variables."
    );
  }

  if (getApps().length === 0) {
    const app = initializeApp({ credential: cert(serviceAccount as any) });
    adminFirebaseAuth = getAuth(app);
    adminFirebaseDB = getFirestore(app);
  } else {
    const app = getApps()[0];
    adminFirebaseAuth = getAuth(app);
    adminFirebaseDB = getFirestore(app);
  }
}

try {
  initializeFirebase();
} catch (error) {
  console.error("Unknown error initializing Firebase Admin SDK", error);
  throw error as Error;
}

export { adminFirebaseAuth, adminFirebaseDB };
