# SwipeMatch MVP - Blueprint (Good State)

This document serves as a blueprint and summary of the application's state as of our last "Good" checkpoint. It details the core user flows, component logic, and database interactions.

---

## 1. Core User Flows

### 1.1. Authentication
- **Method**: Phone number login using Firebase Auth with an OTP (One-Time Password).
- **Process**:
  1. User enters their phone number.
  2. An OTP is sent via SMS through Firebase.
  3. User enters the OTP to verify their identity and log in.
- **Underlying Component**: `src/app/login/page.tsx`

### 1.2. Onboarding & Redirection (Smart Flow)
- A smart redirection logic is implemented in `src/app/page.tsx`.
- **New User**:
  1. After first-time login, the app checks if the user has any existing profiles.
  2. If no profiles exist, they are redirected to `/onboarding`.
  3. On this page, they must choose their initial role: "Worker" or "Employer".
  4. They are then taken to the respective onboarding form (`/onboarding/worker` or `/onboarding/employer`) to create their first card.
- **Existing User**:
  1. After logging in, the app detects they already have one or more profiles.
  2. They are automatically redirected directly to the **Market** (`/matches`) to start swiping, bypassing the onboarding selection.

---

## 2. Swipe Logic & Database Actions

Every swipe action is permanent and saved instantly to the Firestore `swipes` collection.

### 2.1. Left Swipe (Reject)
- **User Action**: Swipes a card left.
- **UI Effect**: Card is dismissed permanently from the Market view.
- **Database**: A record is created indicating the user rejected the card.
- **Result**: The user will never be shown that specific card again. The card owner is NOT notified.

### 2.2. Right Swipe (Like)
- **User Action**: Swipes a card right.
- **UI Effect**: Card is dismissed permanently from the Market view.
- **Database**: A record is created indicating the user liked the card.
- **Result & Consequences**:
  - The card is added to the user's **"I Liked"** list.
  - The user's profile is added to the card owner's **"Incoming Interest"** list.
  - **Instant Match Check**: The system checks if the other user has also previously swiped right.
    - If **YES**: A mutual match is formed. The record is updated to `status: 'matched'`. The card now appears in the **"Match"** list for both users.
    - If **NO**: The action remains a one-way "like".

---

## 3. Navigation Menu Items & Their Purpose

The bottom navigation bar provides access to all key areas of the app.

### 3.1. Incoming Interest
- **Purpose**: To see who is interested in you.
- **Contents**: A list of all users (workers or employers) who have swiped right on one of your cards.

### 3.2. I Liked
- **Purpose**: To see who you have shown interest in.
- **Contents**: A list of every card you have swiped right on. This is your personal "shortlist".

### 3.3. Match
- **Purpose**: To view and contact your mutual connections.
- **Contents**: A special list containing only the profiles where **both** you and the other user have swiped right on each other. Contact options (Call/Chat) are enabled here.

### 3.4. Market
- **Purpose**: The main discovery view of the app.
- **Contents**: The interactive swipe deck where you are shown new profiles/jobs to swipe on.

### 3.5. Profile
- **Purpose**: Your personal dashboard and settings hub.
- **Contents**:
  - A list of **all** Worker Profiles you have created.
  - A list of **all** Job Postings you have created.
  - Two buttons, "Seek New Job" and "Post a new job", to allow existing users to easily create new cards.
  - The **Logout** button.
