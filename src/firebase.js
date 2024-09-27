import { initializeApp } from "firebase/app"; // Firebase core initialization
import { getAuth } from "firebase/auth"; // Firebase authentication service
import { getFirestore } from "firebase/firestore"; // Firestore database service
import { getStorage } from "firebase/storage"; // Firebase storage service

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app); // Authentication
const db = getFirestore(app); // Firestore database
const storage = getStorage(app); // Firebase storage

export { auth, db, storage };
