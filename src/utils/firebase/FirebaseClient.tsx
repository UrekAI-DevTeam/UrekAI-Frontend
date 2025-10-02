import { initializeApp } from "firebase/app";
import { getAuth, signInWithCustomToken, signOut  } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; 

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initializing Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const firebaseClient =  {
  firebaseSignIn: async (firebaseCustomToken: string) => {
    try {
      await signInWithCustomToken(auth, firebaseCustomToken);
      return getCurrentUID();
    } catch (error) {
      console.error("Firebase sign-in failed:", error);
      throw error;
    }
  },
  firebaseSignOut: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  },
}

export const getCurrentUID = () => {
  const uid = auth.currentUser?.uid ?? null;
  if (!uid) {
    console.log("UID is not defined - Firebase not authenticated");
    return null;
  }
  return uid;
};


