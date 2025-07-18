// scripts/clear-users.ts
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, CollectionReference, Query } from 'firebase-admin/firestore';
import * as path from 'path';

const serviceAccountPath = path.resolve(process.cwd(), 'service-account-key.json');

try {
  const serviceAccount = require(serviceAccountPath);

  initializeApp({
    credential: cert(serviceAccount)
  });

  const db = getFirestore();

  /**
   * Deletes all documents in a collection and all its subcollections.
   * @param collectionPath The path to the collection to delete.
   * @param batchSize The number of documents to delete in each batch.
   */
  async function deleteCollection(collectionPath: string, batchSize: number = 50) {
    const collectionRef = db.collection(collectionPath);
    const query = collectionRef.orderBy('__name__').limit(batchSize);

    return new Promise<void>((resolve, reject) => {
      deleteQueryBatch(db, query, resolve).catch(reject);
    });
  }

  async function deleteQueryBatch(db: FirebaseFirestore.Firestore, query: Query, resolve: () => void) {
    const snapshot = await query.get();

    if (snapshot.size === 0) {
      // When there are no documents left, we are done
      return resolve();
    }

    // Delete documents in a batch
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      // Recursively delete subcollections
      const subcollections = doc.ref.listCollections().then(collections => {
        collections.forEach(collection => {
          deleteCollection(collection.path);
        });
      });
      batch.delete(doc.ref);
    });
    
    await batch.commit();

    // Recurse on the next process tick, to avoid
    // exploding the stack.
    process.nextTick(() => {
      deleteQueryBatch(db, query, resolve);
    });
  }

  async function clearUsers() {
    console.log("--- Deleting all users from the 'users' collection ---");
    await deleteCollection('users');
    console.log("Successfully deleted all documents from 'users' collection.");
  }
  
  async function clearSwipes() {
    console.log("--- Deleting all swipes from the 'swipes' collection ---");
    await deleteCollection('swipes');
    console.log("Successfully deleted all documents from 'swipes' collection.");
  }

  async function runClear() {
    await clearUsers();
    await clearSwipes();
    console.log('--- Clearing Complete ---');
  }

  runClear().catch(console.error);

} catch (error) {
  console.error("Could not load service account key from 'service-account-key.json'.");
  console.error("Please make sure the file exists in the root directory of the project.");
  process.exit(1);
}
