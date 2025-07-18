
'use client';
// src/services/authService.ts
// Handles phone login + reCAPTCHA wrappers
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from 'firebase/auth';
import { auth } from './firebase-client';

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

const setupRecaptcha = (containerId: string) => {
  if (typeof window !== 'undefined' && !window.recaptchaVerifier) {
    // Ensure the container exists before initializing
    if (document.getElementById(containerId)) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
          size: 'invisible',
          callback: (response: any) => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
          },
        });
    }
  }
};

const sendOtp = async (phoneNumber: string): Promise<ConfirmationResult | null> => {
  if (typeof window === 'undefined' || !window.recaptchaVerifier) {
    console.error('reCAPTCHA verifier not initialized.');
    return null;
  }

  const appVerifier = window.recaptchaVerifier;
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    window.confirmationResult = confirmationResult;
    return confirmationResult;
  } catch (error) {
    console.error('SMS not sent', error);
    // Reset reCAPTCHA so user can try again
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.render().then(widgetId => {
        if(typeof window !== 'undefined' && (window as any).grecaptcha) {
          (window as any).grecaptcha.reset(widgetId);
        }
      })
    }
    return null;
  }
};

const verifyOtp = async (otp: string): Promise<string | null> => {
  if (window.confirmationResult) {
    try {
      const result = await window.confirmationResult.confirm(otp);
      const user = result.user;
      const token = await user.getIdToken();
      return token;
    } catch (error) {
      console.error('Error verifying OTP', error);
      return null;
    }
  }
  return null;
};


const signOut = async (): Promise<void> => {
    await auth.signOut();
}

export const authService = {
  setupRecaptcha,
  sendOtp,
  verifyOtp,
  signOut,
};
