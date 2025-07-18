// pages/api/notifications.ts
// Handles fetch & mark-read /users/{uid}/notifications
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ name: 'Notifications API endpoint' });
}
