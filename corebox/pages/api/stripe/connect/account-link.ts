import { NextApiRequest, NextApiResponse } from 'next';
import stripe from '../../../../lib/stripe';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { accountId, refreshUrl, returnUrl } = req.body;

    if (!accountId || !refreshUrl || !returnUrl) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Criar um link de conta para o vendedor completar o onboarding
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: refreshUrl,
      return_url: returnUrl,
      type: 'account_onboarding',
    });

    return res.status(200).json({
      success: true,
      url: accountLink.url,
      expiresAt: accountLink.expires_at,
    });
  } catch (error: any) {
    console.error('Error creating account link:', error);
    return res.status(500).json({ error: error.message });
  }
} 