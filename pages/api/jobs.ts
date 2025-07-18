// pages/api/jobs.ts
// Handles CRUD /jobs & /applications (role-guarded)
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ name: 'Jobs API endpoint' });
}
