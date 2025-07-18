// pages/api/auth.ts
// This file is not used for OTP flow which is handled client-side with reCAPTCHA.
// This can be used for custom token creation or other server-side auth logic if needed later.
import type { NextApiRequest, NextApiResponse } from 'next';
import { adminAuth } from '@/services/firebase-admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Example: verify a token from the client
    const { token } = req.body;
    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      const uid = decodedToken.uid;
      // You can add custom claims or other logic here
      res.status(200).json({ status: 'verified', uid });
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
