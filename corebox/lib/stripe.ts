import { loadStripe } from '@stripe/stripe-js';
import Stripe from 'stripe';

// Verificar se estamos em ambiente de desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  // Carregar variáveis de ambiente do arquivo .env.local
  require('dotenv').config({ path: '.env.local' });
}

// Verificar se a chave secreta do Stripe está definida
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  console.error('STRIPE_SECRET_KEY não está definida nas variáveis de ambiente');
}

console.log('Inicializando cliente Stripe com chave secreta:', stripeSecretKey ? 'Chave definida' : 'Chave não definida');

// Inicializa o cliente Stripe no lado do servidor
export const stripe = new Stripe(stripeSecretKey || '', {
  appInfo: {
    name: 'CoreBox',
    version: '1.0.0',
  },
});

// Inicializa o cliente Stripe no lado do cliente
let stripePromise: Promise<any> | null = null;
export const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey) {
      console.error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY não está definida nas variáveis de ambiente');
    }
    console.log('Inicializando cliente Stripe no navegador com chave publicável:', publishableKey ? 'Chave definida' : 'Chave não definida');
    stripePromise = loadStripe(publishableKey || '');
  }
  return stripePromise;
}; 