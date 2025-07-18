# **App Name**: SwipeMatch MVP

## Core Features:

- Authentication: Phone Login via Firebase Auth (OTP)
- Onboarding Flows: Worker Onboarding: profile form with skills and availability. Employer Onboarding: company profile & basic job preferences. Use a tool to guide the user during onboarding by verifying the onboarding logic.
- Swipe UI: Core Swipe UI (mobile) using swiper.js to render cards: workers <-> employers, jobs <-> workers. Swiping actions: reject/accept, plus "❤️ favorite" button.
- Contact Options: Contact options: tapping "Call" opens native dialer; "Message" opens SMS.
- Real-Time Badge: Real-Time "Unread" Badge using Firestore collection /users/{uid}/notifications to display unreadCount via a live Firestore listener.
- API & Security: API & Security: All front-end calls go through pages/api/* routes. Use Firebase Admin SDK in the backend to enforce auth & rules—no direct client access to Firestore.
- Testing: Testing & Benchmarks: Scaffold Jest + Testing Library in Cloud IDE. Create sample tests for services/auth.ts and components/SwipeCard.tsx. Add a basic benchmark script to measure first-render time of the swipe deck.

## Style Guidelines:

- Primary color: Dark blue (#334155) for a professional, modern feel.
- Background color: Grey (#4A5568), providing a neutral backdrop.
- Accent color: A lighter blue (#64748B) used for highlights and interactive elements.
- Font: 'Inter' (sans-serif) for a clean and readable user interface. Note: currently only Google Fonts are supported.
- Subtle animations on swipes and transitions to provide user feedback.
- Mobile-focused layout, with cards filling most of the screen. Clear, readable text with good contrast.
- Use clear and simple icons for actions (reject, accept, favorite, call, message) that are easily recognizable.