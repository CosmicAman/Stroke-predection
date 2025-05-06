import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, writeBatch } from "firebase/firestore";

// ✅ Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyAr-INipZHGZRekfheNxjswKqatUdQQ1oQ",
  authDomain: "stroke-b6233.firebaseapp.com",
  projectId: "stroke-b6233",
  storageBucket: "stroke-b6233.firebasestorage.app", 
  messagingSenderId: "823807850190",
  appId: "1:823807850190:web:b5908651a0005201d3829f"
};

// ✅ Initialize app
const app = initializeApp(firebaseConfig);

// 🔐 Exports
export const auth = getAuth(app);
export const db = getFirestore(app);

// Optional utility exports for flexibility elsewhere
export { doc, writeBatch };
