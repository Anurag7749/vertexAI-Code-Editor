import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "vertexai-282e4.firebaseapp.com",
  projectId: "vertexai-282e4",
  storageBucket: "vertexai-282e4.firebasestorage.app",
  messagingSenderId: "175950371844",
  appId: "1:175950371844:web:5c640d54964e648c416951"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();