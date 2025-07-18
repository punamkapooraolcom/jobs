// This file is DEPRECATED. Use firebase-client.ts or firebase-admin.ts instead.
// src/services/firebase.ts
// Initializes Firebase Admin + Client SDK
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import admin from 'firebase-admin';

// --- Client-side Firebase ---
const firebaseConfig = {
  apiKey: "AIzaSyA1OnWnEk9mabb5iWKwvbi_aazn96wuT4o",
  authDomain: "swipehire-g4kqc.firebaseapp.com",
  projectId: "swipehire-g4kqc",
  storageBucket: "swipehire-g4kqc.appspot.com",
  messagingSenderId: "557841113609",
  appId: "1:557841113609:web:bacb047faa7e046fb40ed8"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };


// --- Server-side Firebase (Admin SDK) ---
if (!admin.apps.length) {
  admin.initializeApp({
    // Using Application Default Credentials, so no need to specify credential path
  });
}

const adminAuth = admin.auth();
const db = admin.firestore();

export { adminAuth, db };
