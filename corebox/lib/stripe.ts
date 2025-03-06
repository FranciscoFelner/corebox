import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '../config/stripe';

// Inicializa o cliente Stripe com a chave secreta
const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia', // Versão mais recente da API
  appInfo: {
    name: 'CoreBox Marketplace',
    version: '1.0.0',
  },
});

export default stripe; 