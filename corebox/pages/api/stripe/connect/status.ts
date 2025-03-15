import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '../../../../lib/stripe';
import fs from 'fs';
import path from 'path';

// Manter um cache de status para evitar chamadas repetidas
const statusCache: Record<string, { data: any, timestamp: number }> = {};
const CACHE_TTL = 60000; // 1 minuto em milissegundos

// Controle de logs para reduzir a poluição do console
let lastLogTime = 0;
const LOG_THROTTLE = 5000; // Mostrar logs apenas a cada 5 segundos

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { sellerId } = req.query;

    if (!sellerId) {
      return res.status(400).json({ error: 'ID do vendedor é obrigatório' });
    }

    // Verificar se temos um cache válido
    const cacheKey = sellerId as string;
    const now = Date.now();
    if (statusCache[cacheKey] && (now - statusCache[cacheKey].timestamp) < CACHE_TTL) {
      // Reduzir a frequência dos logs de cache
      if (now - lastLogTime > LOG_THROTTLE) {
        console.log(`Retornando status em cache para o vendedor: ${sellerId}`);
        lastLogTime = now;
      }
      return res.status(200).json(statusCache[cacheKey].data);
    }

    console.log(`Verificando status do Stripe para o vendedor: ${sellerId}`);

    // Buscar os vendedores do arquivo JSON
    const dataDir = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDir, 'sellers.json');
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Arquivo de vendedores não encontrado' });
    }
    
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const sellers = JSON.parse(fileContents);
    
    // Encontrar o vendedor pelo ID
    const seller = sellers.find((s: any) => s.id === sellerId);
    
    if (!seller) {
      return res.status(404).json({ error: 'Vendedor não encontrado' });
    }

    // Se o vendedor não tem uma conta Stripe
    if (!seller.stripeAccountId) {
      console.log('Vendedor não possui conta Stripe');
      const response = { 
        hasStripeAccount: false,
        status: 'not_connected'
      };
      statusCache[cacheKey] = { data: response, timestamp: now };
      return res.status(200).json(response); 
    }

    console.log('Buscando conta Stripe:', seller.stripeAccountId);

    // Buscar a conta Stripe do vendedor
    const account = await stripe.accounts.retrieve(seller.stripeAccountId);
    
    // Verificar se a conta está ativa e completa
    const isActive = account.details_submitted && account.charges_enabled;
    
    console.log('Status da conta Stripe:', isActive ? 'active' : 'pending');
    
    // Atualizar o status da conta no arquivo de vendedores
    const sellerIndex = sellers.findIndex((s: any) => s.id === sellerId);
    sellers[sellerIndex].stripeAccountStatus = isActive ? 'active' : 'pending';
    sellers[sellerIndex].stripeOnboardingComplete = account.details_submitted;
    
    // Salvar as alterações
    fs.writeFileSync(filePath, JSON.stringify(sellers, null, 2));
    
    // Preparar a resposta
    const response = {
      hasStripeAccount: true,
      accountId: account.id,
      status: isActive ? 'active' : 'pending',
      detailsSubmitted: account.details_submitted,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled
    };

    // Armazenar no cache
    statusCache[cacheKey] = { data: response, timestamp: now };
    
    // Retornar o status da conta
    return res.status(200).json(response);
  } catch (error: any) {
    console.error('Erro ao verificar status da conta Stripe:', error);
    return res.status(500).json({ 
      error: 'Erro ao verificar status da conta Stripe',
      message: error.message 
    });
  }
} 