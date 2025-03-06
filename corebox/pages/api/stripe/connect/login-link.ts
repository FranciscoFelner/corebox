import { NextApiRequest, NextApiResponse } from 'next';
import stripe from '../../../../lib/stripe';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { accountId } = req.body;

    if (!accountId) {
      return res.status(400).json({ error: 'Missing account ID' });
    }

    // Criar um link de login para o dashboard do Stripe
    const loginLink = await stripe.accounts.createLoginLink(accountId);

    return res.status(200).json({
      success: true,
      url: loginLink.url,
    });
  } catch (error: any) {
    console.error('Error creating login link:', error);
    return res.status(500).json({ error: error.message });
  }
} 