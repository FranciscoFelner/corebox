import { loadStripe } from '@stripe/stripe-js';

// Variáveis de ambiente para o Stripe
export const STRIPE_API_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

// Carrega o Stripe no lado do cliente
export const getStripe = () => {
  let stripePromise = null;
  
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_API_KEY);
  }
  
  return stripePromise;
}; 