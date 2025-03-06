import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import Stripe from 'stripe';
import stripe from '../../../../lib/stripe';
import { STRIPE_WEBHOOK_SECRET } from '../../../../config/stripe';

// Desabilitar o parser de corpo padrão do Next.js
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let event: Stripe.Event;

  try {
    // Obter o corpo da requisição como buffer
    const rawBody = await buffer(req);
    const signature = req.headers['stripe-signature'] as string;

    // Verificar a assinatura do webhook
    if (!STRIPE_WEBHOOK_SECRET) {
      return res.status(500).json({ error: 'Webhook secret not configured' });
    }

    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Processar eventos específicos
  try {
    switch (event.type) {
      case 'account.updated':
        // Atualizar o status da conta do vendedor
        const account = event.data.object as Stripe.Account;
        console.log('Account updated:', account.id);
        
        // Em um ambiente real, você atualizaria o status da conta no banco de dados
        // await updateSellerStripeAccount(account.id, {
        //   detailsSubmitted: account.details_submitted,
        //   payoutsEnabled: account.payouts_enabled,
        //   chargesEnabled: account.charges_enabled,
        // });
        
        break;
        
      case 'account.application.authorized':
        // Vendedor autorizou a aplicação
        console.log('Account authorized:', event.account);
        break;
        
      case 'account.application.deauthorized':
        // Vendedor desautorizou a aplicação
        console.log('Account deauthorized:', event.account);
        break;
        
      // Adicione mais casos conforme necessário
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (err: any) {
    console.error(`Error processing webhook: ${err.message}`);
    return res.status(500).json({ error: `Error processing webhook: ${err.message}` });
  }
} 