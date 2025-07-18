'use server';

import { db } from '@/services/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * Records a swipe action in Firestore and checks for a mutual match.
 * @param swiperUid The UID of the user performing the swipe.
 * @param swipedItemId The ID of the job or profile being swiped on.
 * @param swipedItemOwnerUid The UID of the user who owns the swiped item.
 * @param direction The direction of the swipe ('right' for accept, 'left' for reject).
 * @returns A promise that resolves with the result of the operation, including match status.
 */
export async function recordSwipe(
  swiperUid: string,
  swipedItemId: string,
  swipedItemOwnerUid: string,
  direction: 'right' | 'left'
) {
  if (!swiperUid || !swipedItemId || !swipedItemOwnerUid) {
    return { success: false, error: 'User and item IDs must be provided.' };
  }

  // The swipe is now recorded against the specific item (job or profile)
  const swipeDocRef = db.collection('swipes').doc(`${swiperUid}_${swipedItemId}`);
  
  try {
    // For a left swipe, we just record it and stop.
    if (direction === 'left') {
        await swipeDocRef.set({
            swiperUid,
            swipedItemId,
            swipedItemOwnerUid,
            direction,
            status: 'rejected',
            createdAt: FieldValue.serverTimestamp(),
        });
        return { success: true, match: false };
    }

    // This is a right swipe.
    await swipeDocRef.set({
      swiperUid,
      swipedItemId,
      swipedItemOwnerUid,
      direction,
      status: 'pending', // Assume pending until we check for a match
      createdAt: FieldValue.serverTimestamp(),
    });

    // Now, check for a mutual swipe back from the other user.
    // A match occurs if:
    // A) A worker (swiper) swipes right on a job, AND the employer (swipedItemOwner) who posted it has swiped right on the worker's profile.
    // B) An employer (swiper) swipes right on a worker profile, AND that worker (swipedItemOwner) has swiped right on one of the employer's jobs.
    
    // We look for a document where the roles are reversed.
    const reverseSwipesQuery = db.collection('swipes')
        .where('swiperUid', '==', swipedItemOwnerUid) // The other user is the swiper
        .where('swipedItemOwnerUid', '==', swiperUid) // Swiping on one of our items
        .where('direction', '==', 'right');
        
    const reverseSwipesSnapshot = await reverseSwipesQuery.get();

    if (!reverseSwipesSnapshot.empty) {
      // It's a MATCH! At least one mutual right-swipe exists.
      const batch = db.batch();

      // 1. Update this swipe to 'matched'.
      batch.update(swipeDocRef, { status: 'matched' });
      
      // Optionally, update the reverse swipe doc(s) too.
      reverseSwipesSnapshot.docs.forEach(doc => {
          batch.update(doc.ref, { status: 'matched' });
      });
      
      // 2. Create a notification for the other user (the one who is not currently swiping).
      const notificationRef = db.collection('users').doc(swipedItemOwnerUid).collection('notifications').doc();
      batch.set(notificationRef, {
          senderUid: swiperUid,
          type: 'new_match',
          read: false,
          createdAt: FieldValue.serverTimestamp(),
      });

      await batch.commit();

      return { success: true, match: true, swipeId: swipeDocRef.id };
    }

    // If no reverse swipe, it's just a one-way 'like'.
    return { success: true, match: false, swipeId: swipeDocRef.id };

  } catch (error) {
    console.error('Error recording swipe:', error);
    return { success: false, error: 'Failed to record swipe action.' };
  }
}
