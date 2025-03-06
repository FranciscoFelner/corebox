import { NextApiRequest, NextApiResponse } from 'next';
import stripe from '../../../lib/stripe';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, currency = 'eur', description, metadata = {}, applicationFee = 0, connectedAccountId } = req.body;

    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    // Validar o valor mínimo (Stripe requer pelo menos 50 centavos)
    if (amount < 50) {
      return res.status(400).json({ error: 'Amount must be at least 0.50' });
    }

    const paymentIntentParams: any = {
      amount,
      currency,
      description,
      metadata,
      // Você pode adicionar mais opções conforme necessário
      // capture_method: 'manual', // Para autorizar agora e capturar depois
      // payment_method_types: ['card'], // Tipos de pagamento aceitos
    };

    // Se estiver usando Stripe Connect, adicionar o ID da conta conectada
    if (connectedAccountId) {
      // Criar um Payment Intent na conta do vendedor
      paymentIntentParams.application_fee_amount = applicationFee;
      paymentIntentParams.transfer_data = {
        destination: connectedAccountId,
      };
    }

    // Criar o Payment Intent
    const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id,
    });
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    return res.status(500).json({ error: error.message });
  }
} 