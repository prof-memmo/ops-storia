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

// Initialize Hub as [DEFAULT] app for shared SSO session
const hubApp = getApps().find(a => a.name === "[DEFAULT]") || initializeApp(configHub);
const auth = getAuth(hubApp);
const googleProvider = new GoogleAuthProvider();
const hubDb = getFirestore(hubApp);

// Initialize Ops RTDB as secondary app
const opsApp = getApps().find(a => a.name === "OpsRTDB") || initializeApp(firebaseConfig, "OpsRTDB");
const rtdb = getDatabase(opsApp);
const db = getFirestore(opsApp);
const app = hubApp;

export { app, auth, googleProvider, rtdb, db, hubDb };

