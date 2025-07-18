// scripts/seed.ts
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as path from 'path';

// Construct the path to the service account key file
const serviceAccountPath = path.resolve(process.cwd(), 'service-account-key.json');

try {
  const serviceAccount = require(serviceAccountPath);

  initializeApp({
    credential: cert(serviceAccount)
  });
  
  const db = getFirestore();

  const skills = [
    'Cook',
    'Delivery Driver',
    'Driver Car',
    'Sales Manager',
    'Sales Person',
    'Security Guard'
  ];

  const workers = [
    { fullName: 'Jane Doe', skill: 'Cook', availability: 'full-time', role: 'worker' },
    { fullName: 'John Smith', skill: 'Delivery Driver', availability: 'part-time', role: 'worker' },
    { fullName: 'Alex Ray', skill: 'Security Guard', availability: 'contract', role: 'worker' },
    { fullName: 'Maria Garcia', skill: 'Sales Person', availability: 'full-time', role: 'worker' },
  ];

  const employers = [
      { companyName: 'Good Eats Restaurant', skill: 'Cook', jobDescription: 'Looking for experienced line cooks for a fast-paced kitchen.', role: 'employer' },
      { companyName: 'Speedy Logistics', skill: 'Delivery Driver', jobDescription: 'Seeking reliable delivery drivers with a clean driving record.', role: 'employer' },
      { companyName: 'SecureCorp', skill: 'Security Guard', jobDescription: 'Hiring licensed security guards for evening shifts.', role: 'employer' },
      { companyName: 'Retail Kings', skill: 'Sales Person', jobDescription: 'Dynamic sales professionals wanted for our flagship store.', role: 'employer' },
  ];

  async function seedSkills() {
    const skillsCollection = db.collection('skills');
    const existingSkillsSnapshot = await skillsCollection.get();
    const existingSkillNames = new Set(existingSkillsSnapshot.docs.map(doc => doc.data().name));
    const newSkills = skills.filter(skill => !existingSkillNames.has(skill));

    if (newSkills.length > 0) {
      const batch = db.batch();
      newSkills.sort().forEach(name => {
        const ref = skillsCollection.doc();
        batch.set(ref, { name });
      });
      await batch.commit();
      console.log(`Successfully seeded ${newSkills.length} new skill(s): ${newSkills.join(', ')}`);
    } else {
      console.log('All skills already exist. No new skills were added.');
    }
  }

  async function seedUsers() {
    const usersCollection = db.collection('users');
    const allSeedUsers = [...workers, ...employers];
    let usersAddedCount = 0;
    let usersUpdatedCount = 0;

    for (const userData of allSeedUsers) {
        const nameField = 'fullName' in userData ? 'fullName' : 'companyName';
        const nameValue = 'fullName' in userData ? userData.fullName : userData.companyName;
        
        const querySnapshot = await usersCollection.where(nameField, '==', nameValue).limit(1).get();

        if (querySnapshot.empty) {
            const ref = usersCollection.doc(); // Firestore auto-generates a unique ID
            await db.collection('users').add({
                ...userData,
                createdAt: new Date().toISOString()
            });
            usersAddedCount++;
        } else {
            // If user exists, update it to match the new data structure
            const docRef = querySnapshot.docs[0].ref;
            await docRef.update({
                ...userData
            });
            usersUpdatedCount++;
        }
    }

    if (usersAddedCount > 0) {
        console.log(`Successfully seeded ${usersAddedCount} new users.`);
    }
    if (usersUpdatedCount > 0) {
        console.log(`Successfully updated ${usersUpdatedCount} existing users.`);
    }
    if(usersAddedCount === 0 && usersUpdatedCount === 0) {
        console.log('All sample users already exist and are up to date. No new users were added or updated.');
    }
  }

  async function seed() {
    console.log('--- Starting Database Seeding ---');
    await seedSkills();
    await seedUsers();
    console.log('--- Seeding Complete ---');
  }

  seed().catch(console.error);

} catch (error) {
  console.error("Could not load service account key from 'service-account-key.json'.");
  console.error("Please make sure the file exists in the root directory of the project.");
  process.exit(1);
}
