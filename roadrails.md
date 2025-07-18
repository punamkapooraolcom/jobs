# SwipeMatch MVP - Roadrails & 1-Hour Sprint Plan

This document outlines the components, services, and a step-by-step plan to build the SwipeMatch MVP in a one-hour sprint using Firebase Studio.

---

## Component & Service List

### Components
- `AuthPhoneForm.tsx`: Handles phone number input for OTP.
- `RoleSelect.tsx`: Asks user to choose between "Worker" and "Employer".
- `Wizard.tsx`: Generic wrapper for the multi-step onboarding/job creation flow.
- `WizardStep/*`: Individual screens for Location, Phone, Skill, etc.
- `SwipeDeck.tsx`: Manages vertical category scrolling and the horizontal `swiper.js` instance.
- `SwipeCard.tsx`: Renders a single profile or job card.
- `Badge.tsx`: Displays notification counts.
- `BottomNav.tsx`: Main navigation for the app.

### Services & API
- `/services/firebase.ts`: Initializes Firebase client and admin SDKs.
- `/services/authService.ts`: Wraps Firebase Auth logic.
- `/services/jobService.ts`: Business logic for creating jobs and applications.
- `/services/notificationService.ts`: Real-time listeners for notifications.
- `/pages/api/*`: Secure backend endpoints using Firebase Admin SDK.
- `/utils/geo.ts`: Haversine distance calculation utility.

---

## 1-Hour Build Sprint

**Goal**: A secure, mobile-focused MVP live in Firebase, testable on your phone within one hour.

**Step 1: Scaffolding & Setup (5 mins)**
- **Status:** ✅ Done.
- **Action:** Initial project structure, dependencies, theme, and placeholder files created.

**Step 2: Firebase Integration & Auth (15 mins)**
- **Action:** Configure Firebase client/admin SDKs. Implement phone authentication flow using `AuthPhoneForm` and `authService`. Secure API routes.
- **Verification:** User can log in with a phone number.

**Step 3: Onboarding Wizard (15 mins)**
- **Action:** Build out the `Wizard.tsx` component to manage steps. Connect `RoleSelect`, `Location`, `Skill`, `NamePhoto`, and `Salary` steps.
- **Verification:** User can complete the full onboarding flow after login.

**Step 4: Swipe UI & Matching Logic (15 mins)**
- **Action:** Implement `SwipeDeck.tsx` with `swiper.js`. Fetch and display `SwipeCard` components. Connect swipe actions to API endpoints.
- **Verification:** Users can swipe through cards. Actions are recorded securely.

**Step 5: Real-Time Badges & Final Touches (10 mins)**
- **Action:** Implement `notificationService` to listen for Firestore changes. Update `Badge` component on `BottomNav` in real-time.
- **Verification:** Notification badges update automatically when new notifications arrive.
