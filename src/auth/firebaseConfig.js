import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, writeBatch } from "firebase/firestore";

// ✅ Firebase project config
const firebaseConfig = {
  apiKey: "YOUR API KEY",
  authDomain: "DOMAIN.firebaseapp.com",
  projectId: "stroke-xxxxx",
  storageBucket: "stroke-xxxx.firebasestorage.app", 
  messagingSenderId: "xxxxxxxxxxx",
  appId: "xxxxxxxxxxxxxxxxxxxxx"
};

// ✅ Initialize app
const app = initializeApp(firebaseConfig);

// 🔐 Exports
export const auth = getAuth(app);
export const db = getFirestore(app);

// Optional utility exports for flexibility elsewhere
export { doc, writeBatch };
