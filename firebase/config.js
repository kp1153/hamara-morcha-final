// firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// 🔑 Firebase config — आपकी असली values
const firebaseConfig = {
  apiKey: "AIzaSyCdvdqty3z06UQ5IeCwm2dzlkiYj1sa6pc",
  authDomain: "morcha-live.firebaseapp.com",
  projectId: "morcha-live",
  storageBucket: "morcha-live.firebasestorage.app",
  messagingSenderId: "847212421786",
  appId: "1:847212421786:web:3b251c44a0e4b7ce07f523",
};

// 🔧 Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔐 Export instances
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

/**
 * 🔑 Firebase Login Function
 * @param {string} email
 * @param {string} password
 * @returns {Promise<UserCredential>}
 */
export async function firebaseLogin(email, password) {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export default app;
