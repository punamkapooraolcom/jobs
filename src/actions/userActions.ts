
'use server';

import { db } from '@/services/firebase-admin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

type WorkerProfileData = {
  fullName: string;
  skill: string;
  availability: 'full-time' | 'part-time' | 'contract';
};

type JobOpeningData = {
  companyName: string;
  skill: string;
  jobDescription: string;
};

/**
 * Creates a new worker profile in the 'workerProfiles' subcollection.
 * @param uid The user's unique ID from Firebase Auth.
 * @param phoneNumber The user's phone number.
 * @param data The worker's profile data.
 * @returns A promise that resolves when the profile is saved.
 */
export async function createWorkerProfile(uid: string, phoneNumber: string | null, data: WorkerProfileData) {
  try {
    const userRef = db.collection('users').doc(uid);
    // Add a new document to the 'workerProfiles' subcollection
    const profileRef = userRef.collection('workerProfiles').doc(); 
    
    const userData: { createdAt: FieldValue, phoneNumber?: string, hasWorkerProfile: boolean, fullName: string } = {
        createdAt: FieldValue.serverTimestamp(),
        hasWorkerProfile: true,
        fullName: data.fullName,
    };
    if (phoneNumber) {
        userData.phoneNumber = phoneNumber;
    }
    await userRef.set(userData, { merge: true });
    
    await profileRef.set({
      ...data,
      role: 'worker',
      updatedAt: FieldValue.serverTimestamp(),
    });

    return { success: true, profileId: profileRef.id };
  } catch (error) {
    console.error('Error saving worker profile:', error);
    return { success: false, error: 'Failed to save profile.' };
  }
}

/**
 * Creates a new job opening in the 'jobs' subcollection.
 * @param uid The user's unique ID from Firebase Auth.
 * @param phoneNumber The user's phone number.
 * @param data The job opening data.
 * @returns A promise that resolves when the job is saved.
 */
export async function createJobOpening(uid: string, phoneNumber: string | null, data: JobOpeningData) {
    try {
        const userRef = db.collection('users').doc(uid);
        // Add a new document to the 'jobs' subcollection
        const jobRef = userRef.collection('jobs').doc(); 
        
        const userData: { createdAt: FieldValue, phoneNumber?: string, hasEmployerProfile: boolean, companyName: string } = {
            createdAt: FieldValue.serverTimestamp(),
            hasEmployerProfile: true,
            companyName: data.companyName
        };
        if (phoneNumber) {
            userData.phoneNumber = phoneNumber;
        }
        await userRef.set(userData, { merge: true });

        await jobRef.set({
            ...data,
            role: 'employer', // Kept for consistency, represents the job poster's role context
            updatedAt: FieldValue.serverTimestamp(),
        });

        return { success: true, jobId: jobRef.id };
    } catch (error) {
        console.error('Error saving job opening:', error);
        return { success: false, error: 'Failed to save job opening.' };
    }
}

/**
 * Checks which roles a user has.
 * @param uid The user's UID.
 * @returns An object indicating if the user is a worker and/or an employer.
 */
export async function getUserRoles(uid: string): Promise<{ isWorker: boolean; isEmployer: boolean }> {
  try {
    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists) {
      // Check for profiles/jobs in subcollections if top-level doc flags are missing
      const workerProfilesSnap = await db.collection('users').doc(uid).collection('workerProfiles').limit(1).get();
      const employerJobsSnap = await db.collection('users').doc(uid).collection('jobs').limit(1).get();
      return {
        isWorker: !workerProfilesSnap.empty,
        isEmployer: !employerJobsSnap.empty,
      };
    }
    const userData = userDoc.data();
    return {
      isWorker: userData?.hasWorkerProfile === true,
      isEmployer: userData?.hasEmployerProfile === true,
    };
  } catch (error) {
    console.error('Error fetching user roles:', error);
    return { isWorker: false, isEmployer: false };
  }
}

/**
 * Fetches profiles/jobs for a user to swipe based on their selected active role.
 * @param uid The UID of the user who is swiping.
 * @param activeRole The role context for the swipe session ('worker' or 'employer').
 * @returns An array of profiles/jobs to be displayed in the swipe deck.
 */
export async function getSwipeableProfiles(uid: string, activeRole: 'worker' | 'employer') {
  try {
    const swipedQuery = await db.collection('swipes').where('swiperUid', '==', uid).get();
    const swipedIds = new Set(swipedQuery.docs.map(doc => doc.data().swipedItemId));

    let profilesSnapshot;
    let profiles = [];

    if (activeRole === 'worker') {
      // Worker is looking for jobs
      profilesSnapshot = await db.collectionGroup('jobs').get();
      profiles = profilesSnapshot.docs
        .map(doc => {
            const data = doc.data();
            const ownerUid = doc.ref.parent.parent!.id;
            return {
                id: doc.id,
                ownerUid: ownerUid,
                name: data.companyName,
                type: 'job',
                title: data.skill,
                skills: [data.skill],
                image: data.imageUrl || 'https://placehold.co/600x800.png',
                dataAiHint: 'company office',
            } as const;
        })
        .filter(p => p.ownerUid !== uid && !swipedIds.has(p.id));

    } else { // activeRole is 'employer'
      // Employer is looking for workers
      profilesSnapshot = await db.collectionGroup('workerProfiles').get();
       profiles = profilesSnapshot.docs
        .map(doc => {
            const data = doc.data();
            const ownerUid = doc.ref.parent.parent!.id;
            return {
                id: doc.id,
                ownerUid: ownerUid,
                name: data.fullName,
                type: 'worker',
                title: data.availability,
                skills: [data.skill],
                image: data.imageUrl || 'https://placehold.co/600x800.png',
                dataAiHint: 'person portrait',
            } as const;
        })
        .filter(p => p.ownerUid !== uid && !swipedIds.has(p.id));
    }
      
    return profiles;

  } catch (error) {
    console.error('Error fetching swipeable profiles:', error);
    return [];
  }
}


const defaultSkills = [
  { id: '1', name: 'Cook' },
  { id: '2', name: 'Delivery Driver' },
  { id: '3', name: 'Driver Car' },
  { id: '4', name: 'Sales Manager' },
  { id: '5', name: 'Sales Person' },
  { id: '6', name: 'Security Guard' },
];

/**
 * Fetches the list of skills from Firestore, with a hardcoded fallback.
 * This is a server action and uses admin privileges.
 * @returns An array of skill objects.
 */
export async function getSkills() {
    try {
        const skillsCollection = db.collection('skills');
        const snapshot = await skillsCollection.orderBy('name').get();
        if (snapshot.empty) {
            console.warn("Skills collection is empty, returning default skills.");
            return defaultSkills;
        }
        return snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name as string }));
    } catch (error) {
        console.error("Failed to fetch skills from server, returning default skills:", error);
        return defaultSkills;
    }
}


/**
 * Fetches the jobs or profiles that a user has swiped right on (favorited).
 * @param uid The UID of the user whose favorites to fetch.
 * @returns An array of favorite profiles/jobs.
 */
export async function getFavorites(uid: string) {
  try {
    // 1. Fetch all of the user's right swipes
    const rightSwipesSnapshot = await db.collection('swipes')
      .where('swiperUid', '==', uid)
      .where('direction', '==', 'right')
      .get();

    if (rightSwipesSnapshot.empty) {
      return [];
    }

    const favoritesDataPromises = rightSwipesSnapshot.docs.map(async (swipeDoc) => {
      const swipeData = swipeDoc.data();
      const { swipedItemId, swipedItemOwnerUid, status } = swipeData;
      const isMatch = status === 'matched';
      
      let itemDoc;
      let itemData: any = null;

      // Try fetching as a worker profile first
      itemDoc = await db.collection('users').doc(swipedItemOwnerUid).collection('workerProfiles').doc(swipedItemId).get();
      if (itemDoc.exists) {
        const data = itemDoc.data();
        if (data) {
          itemData = {
            id: itemDoc.id,
            name: data.fullName,
            title: data.skill,
            image: data.imageUrl || 'https://placehold.co/128x128.png',
            dataAiHint: 'person portrait',
            type: 'worker' as const,
            isMatch: isMatch,
          };
        }
      } else {
        // If not a worker profile, try fetching as a job
        itemDoc = await db.collection('users').doc(swipedItemOwnerUid).collection('jobs').doc(swipedItemId).get();
        if (itemDoc.exists) {
          const data = itemDoc.data();
          if (data) {
            itemData = {
              id: itemDoc.id,
              name: data.companyName,
              title: data.jobDescription,
              image: data.imageUrl || 'https://placehold.co/128x128.png',
              dataAiHint: 'company office',
              type: 'job' as const,
              isMatch: isMatch,
            };
          }
        }
      }
      return itemData;
    });
    
    const favoritesData = (await Promise.all(favoritesDataPromises)).filter(Boolean);
    return favoritesData;

  } catch (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
}

/**
 * Fetches the profiles of users who have swiped right on the current user's items.
 * @param uid The UID of the user whose "accepts" to fetch.
 * @returns An array of profiles who have accepted the user.
 */
export async function getAccepts(uid: string) {
  try {
    // Find all 'right' swipes where the current user is the owner of the swiped item.
    const rightSwipesSnapshot = await db.collection('swipes')
      .where('swipedItemOwnerUid', '==', uid)
      .where('direction', '==', 'right')
      .get();

    if (rightSwipesSnapshot.empty) {
      return [];
    }
    
    const acceptsDataPromises = rightSwipesSnapshot.docs.map(async (swipeDoc) => {
      const swipeData = swipeDoc.data();
      const { swiperUid, status } = swipeData;
      const isMatch = status === 'matched';

      const userDoc = await db.collection('users').doc(swiperUid).get();
      const userData = userDoc.data();
      
      if (!userData) return null;

      // The person who swiped on us could be a worker or an employer.
      // We'll use their main profile name (fullName or companyName).
      const name = userData.fullName || userData.companyName || 'Unknown User';
      const type = userData.hasWorkerProfile ? 'worker' : 'job'; // 'job' represents an employer entity

      return {
        id: swiperUid,
        name: name,
        title: `Interested in you`, // Generic title
        image: userData.imageUrl || 'https://placehold.co/128x128.png',
        dataAiHint: type === 'worker' ? 'person portrait' : 'company office',
        type: type as 'worker' | 'job',
        isMatch: isMatch,
      };
    });

    const acceptsData = (await Promise.all(acceptsDataPromises)).filter(Boolean);
    
    // Remove duplicates in case one user swiped on multiple items from us
    const uniqueAccepts = Array.from(new Set(acceptsData.map(a => a.id)))
      .map(id => {
        return acceptsData.find(a => a.id === id)!
      });
      
    return uniqueAccepts;

  } catch (error) {
    console.error('Error fetching accepts:', error);
    return [];
  }
}

/**
 * Fetches all mutual matches for a user.
 * A match occurs when two users have swiped right on each other.
 * @param uid The UID of the user whose matches to fetch.
 * @returns An array of matched profiles/jobs.
 */
export async function getMatches(uid: string) {
  try {
    // Fetch all 'matched' swipes initiated by the current user
    const userSwipesSnapshot = await db.collection('swipes')
      .where('swiperUid', '==', uid)
      .where('status', '==', 'matched')
      .get();

    if (userSwipesSnapshot.empty) {
      return [];
    }

    const matchesPromises = userSwipesSnapshot.docs.map(async (swipeDoc) => {
      const swipeData = swipeDoc.data();
      const { swipedItemId, swipedItemOwnerUid } = swipeData;

      let itemDoc;
      let itemData = null;

      // Try fetching as a worker profile first
      itemDoc = await db.collection('users').doc(swipedItemOwnerUid).collection('workerProfiles').doc(swipedItemId).get();
      if (itemDoc.exists) {
        const data = itemDoc.data();
        if (data) {
          itemData = {
            id: itemDoc.id,
            name: data.fullName,
            title: data.skill,
            image: data.imageUrl || 'https://placehold.co/128x128.png',
            dataAiHint: 'person portrait',
            type: 'worker' as const,
            isMatch: true, // It's a match by definition
          };
        }
      } else {
        // If not a worker profile, try fetching as a job
        itemDoc = await db.collection('users').doc(swipedItemOwnerUid).collection('jobs').doc(swipedItemId).get();
        if (itemDoc.exists) {
          const data = itemDoc.data();
          if (data) {
            itemData = {
              id: itemDoc.id,
              name: data.companyName,
              title: data.jobDescription,
              image: data.imageUrl || 'https://placehold.co/128x128.png',
              dataAiHint: 'company office',
              type: 'job' as const,
              isMatch: true, // It's a match by definition
            };
          }
        }
      }
      return itemData;
    });

    const matchesData = (await Promise.all(matchesPromises)).filter(Boolean);
    return matchesData;

  } catch (error) {
    console.error('Error fetching matches:', error);
    return [];
  }
}

type UserProfile = {
  name: string | null;
  phoneNumber: string | null;
  workerProfiles: Record<string, any>[];
  employerJobs: Record<string, any>[];
};

/**
 * Converts Firestore Timestamps to ISO strings to make them serializable.
 * @param data The document data from Firestore.
 * @returns A new object with Timestamps converted to strings.
 */
const serializeTimestamps = (data: any) => {
  if (!data) return null;
  const serializedData: { [key: string]: any } = {};
  for (const key in data) {
    if (data[key] instanceof Timestamp) {
      serializedData[key] = data[key].toDate().toISOString();
    } else {
      serializedData[key] = data[key];
    }
  }
  return serializedData;
};

/**
 * Fetches all profile information for a given user.
 * @param uid The user's unique ID.
 * @returns A composite object with all user profile data.
 */
export async function getUserProfile(uid: string): Promise<UserProfile> {
  try {
    const userDocRef = db.collection('users').doc(uid);
    const userDoc = await userDocRef.get();
    const userData = userDoc.data();

    // Fetch all worker profiles
    const workerProfilesSnap = await userDocRef.collection('workerProfiles').get();
    const workerProfiles = workerProfilesSnap.docs.map(doc => ({ id: doc.id, ...serializeTimestamps(doc.data()) }));

    // Fetch all employer job postings
    const jobsSnap = await userDocRef.collection('jobs').get();
    const employerJobs = jobsSnap.docs.map(doc => ({ id: doc.id, ...serializeTimestamps(doc.data()) }));

    return {
      name: userData?.fullName || userData?.companyName || null,
      phoneNumber: userData?.phoneNumber || null,
      workerProfiles,
      employerJobs,
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return { name: null, phoneNumber: null, workerProfiles: [], employerJobs: [] };
  }
}
