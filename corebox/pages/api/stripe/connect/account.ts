import { NextApiRequest, NextApiResponse } from 'next';
import stripe from '../../../../lib/stripe';
import { SellerData } from '../../../../types/seller';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sellerId, email, storeName, name } = req.body;

    if (!sellerId || !email || !storeName || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verificar se o vendedor já tem uma conta Stripe
    // Em um ambiente real, você buscaria isso do seu banco de dados
    // Aqui estamos simulando com um mock
    const existingSeller: SellerData | null = null; // Substitua por uma busca real no banco de dados

    if (existingSeller && existingSeller.stripeAccountId) {
      // Se o vendedor já tem uma conta Stripe, retorne os detalhes
      const account = await stripe.accounts.retrieve(existingSeller.stripeAccountId);
      
      return res.status(200).json({
        success: true,
        account: {
          id: account.id,
          detailsSubmitted: account.details_submitted,
          payoutsEnabled: account.payouts_enabled,
          chargesEnabled: account.charges_enabled,
        },
      });
    }

    // Criar uma nova conta Stripe Connect Express para o vendedor
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'PT', // Portugal
      email: email,
      business_type: 'individual',
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_profile: {
        name: storeName,
        url: `https://corebox.com/seller/${sellerId}`, // URL do perfil do vendedor
      },
      metadata: {
        sellerId: sellerId,
      },
    });

    // Em um ambiente real, você salvaria o ID da conta Stripe no seu banco de dados
    // Aqui estamos apenas retornando o ID
    
    return res.status(200).json({
      success: true,
      accountId: account.id,
      detailsSubmitted: account.details_submitted,
      payoutsEnabled: account.payouts_enabled,
      chargesEnabled: account.charges_enabled,
    });
  } catch (error: any) {
    console.error('Error creating Stripe account:', error);
    return res.status(500).json({ error: error.message });
  }
} 