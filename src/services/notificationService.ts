// src/services/notificationService.ts
// Handles real-time listener for unreadCount
import { db } from './firebase-client';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export const notificationService = {
  /**
   * Listens for changes to the unread notification count for a specific user.
   * @param userId The UID of the user to listen for.
   * @param callback A function that will be called with the unread count.
   * @returns An unsubscribe function to stop listening for changes.
   */
  listenForUnreadCount: (userId: string, callback: (count: number) => void) => {
    console.warn("Real-time notifications are currently disabled due to Firestore security rules.");
    // Return a no-op unsubscribe function
    return () => {};

    // if (!userId) {
    //   console.error('listenForUnreadCount requires a userId.');
    //   return () => {}; // Return a no-op unsubscribe function
    // }
    
    // // Query the 'notifications' subcollection for the user
    // const notificationsRef = collection(db, 'users', userId, 'notifications');
    // const q = query(notificationsRef, where('read', '==', false));

    // // onSnapshot sets up the real-time listener
    // const unsubscribe = onSnapshot(q, (snapshot) => {
    //   // When the data changes, snapshot.size will give the number of documents
    //   // that match the query (i.e., the count of unread notifications).
    //   const unreadCount = snapshot.size;
    //   callback(unreadCount);
    // }, (error) => {
    //   console.error("Error listening to notification count:", error);
    //   // In case of an error, we can report a zero count.
    //   callback(0);
    // });

    // // Return the unsubscribe function so the listener can be detached
    // // when the component unmounts.
    // return unsubscribe;
  },
};
