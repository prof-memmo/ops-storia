import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD_8P554hXaLhzQC8cTpIggkQtUrmK4xVY",
  authDomain: "ops-storia.firebaseapp.com",
  projectId: "ops-storia",
  storageBucket: "ops-storia.firebasestorage.app",
  messagingSenderId: "286837960939",
  appId: "1:286837960939:web:ba6c5f5cfcd47d345f0eae",
  databaseURL: "https://ops-storia-default-rtdb.europe-west1.firebasedatabase.app"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const rtdb = getDatabase(app);
const db = getFirestore(app);

export { app, auth, googleProvider, rtdb, db };
