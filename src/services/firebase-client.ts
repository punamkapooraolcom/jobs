'use client';
// src/services/firebase-client.ts
// Initializes Client-side Firebase SDK
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA1OnWnEk9mabb5iWKwvbi_aazn96wuT4o",
  authDomain: "swipehire-g4kqc.firebaseapp.com",
  projectId: "swipehire-g4kqc",
  storageBucket: "swipehire-g4kqc.appspot.com",
  messagingSenderId: "557841113609",
  appId: "1:557841113609:web:bacb047faa7e046fb40ed8"
};

// Initialize Firebase
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export { app, auth, db };
