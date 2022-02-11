import { getSession } from 'next-auth/react';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession();

  if (session) {
    return res.send({
      content: 'You can access'
    });
  }

  res.send({
    error: 'You must be sign in to view the protected content'
  });
}