// src/services/firebase-admin.ts
// Initializes Server-side Firebase Admin SDK
import admin from 'firebase-admin';

// Correctly initialize the Admin SDK using the service account key
// This ensures that server actions have the proper permissions to interact with Firestore
if (!admin.apps.length) {
  try {
    // The service account key is stored in the root of the project
    // and referenced via an environment variable in production.
    // For local development, we can require it directly.
    const serviceAccount = require('../../service-account-key.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
    // Fallback to default credentials if the key is not found
    // This maintains compatibility with environments where ADC is configured
    if (!admin.apps.length) {
       admin.initializeApp();
    }
  }
}

const adminAuth = admin.auth();
const db = admin.firestore();

export { adminAuth, db };
