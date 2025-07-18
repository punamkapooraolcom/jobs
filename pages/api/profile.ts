// pages/api/profile.ts
// Handles GET/PUT /users/{uid}
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ name: 'Profile API endpoint' });
}
