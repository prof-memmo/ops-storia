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

const configHub = {
  apiKey: "AIzaSyD-n2m-kYEuzGXPMKclZTggf4Y5Zm8_cdM",
  authDomain: "prof-memmo-hub.firebaseapp.com",
  projectId: "prof-memmo-hub",
  storageBucket: "prof-memmo-hub.firebasestorage.app",
  messagingSenderId: "839149485689",
  appId: "1:839149485689:web:531776ce3cf495a6f23697"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps().find(a => a.name === "[DEFAULT]") || initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const rtdb = getDatabase(app);
const db = getFirestore(app);

const hubApp = getApps().find(a => a.name === "Hub") || initializeApp(configHub, "Hub");
const hubDb = getFirestore(hubApp);

export { app, auth, googleProvider, rtdb, db, hubDb };

