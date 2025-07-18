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
    { id: 'worker1', fullName: 'Jane Doe', skill: 'Cook', availability: 'full-time' },
    { id: 'worker2', fullName: 'John Smith', skill: 'Delivery Driver', availability: 'part-time' },
    { id: 'worker3', fullName: 'Alex Ray', skill: 'Security Guard', availability: 'contract' },
    { id: 'worker4', fullName: 'Maria Garcia', skill: 'Sales Person', availability: 'full-time' },
  ];

  const employers = [
      { id: 'employer1', companyName: 'Good Eats Restaurant', skill: 'Cook', jobDescription: 'Looking for experienced line cooks for a fast-paced kitchen.' },
      { id: 'employer2', companyName: 'Speedy Logistics', skill: 'Delivery Driver', jobDescription: 'Seeking reliable delivery drivers with a clean driving record.' },
      { id: 'employer3', companyName: 'SecureCorp', skill: 'Security Guard', jobDescription: 'Hiring licensed security guards for evening shifts.' },
      { id: 'employer4', companyName: 'Retail Kings', skill: 'Sales Person', jobDescription: 'Dynamic sales professionals wanted for our flagship store.' },
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
    console.log('--- Seeding User Profiles (New Model) ---');
    const batch = db.batch();
    let profilesAddedCount = 0;

    // Seed worker profiles
    for (const workerData of workers) {
      const { id, ...profile } = workerData;
      const userRef = db.collection('users').doc(id);
      const profileRef = userRef.collection('profiles').doc('worker');
      batch.set(userRef, { createdAt: new Date().toISOString() }, { merge: true });
      batch.set(profileRef, { ...profile, role: 'worker', updatedAt: new Date().toISOString() });
      profilesAddedCount++;
    }

    // Seed employer profiles
    for (const employerData of employers) {
      const { id, ...profile } = employerData;
      const userRef = db.collection('users').doc(id);
      const profileRef = userRef.collection('profiles').doc('employer');
      batch.set(userRef, { createdAt: new Date().toISOString() }, { merge: true });
      batch.set(profileRef, { ...profile, role: 'employer', updatedAt: new Date().toISOString() });
      profilesAddedCount++;
    }
    
    // For demonstration, let's make one user both a worker and employer
    const dualRoleId = 'dual_role_user';
    const dualUserRef = db.collection('users').doc(dualRoleId);
    const dualWorkerProfileRef = dualUserRef.collection('profiles').doc('worker');
    const dualEmployerProfileRef = dualUserRef.collection('profiles').doc('employer');

    batch.set(dualUserRef, { createdAt: new Date().toISOString() }, { merge: true });
    batch.set(dualWorkerProfileRef, {
        fullName: 'Sam Casey',
        skill: 'Sales Manager',
        availability: 'full-time',
        role: 'worker',
        updatedAt: new Date().toISOString()
    });
    profilesAddedCount++;
    batch.set(dualEmployerProfileRef, {
        companyName: 'Casey Consulting',
        skill: 'Sales Person',
        jobDescription: 'Hiring a dynamic sales person for a growing consultancy.',
        role: 'employer',
        updatedAt: new Date().toISOString()
    });
    profilesAddedCount++;

    await batch.commit();
    console.log(`Successfully created or updated ${profilesAddedCount} profiles.`);
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
