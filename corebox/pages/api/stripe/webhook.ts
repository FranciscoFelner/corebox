import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import { stripe } from '../../../lib/stripe';
import fs from 'fs';
import path from 'path';

// Desabilitar o parser de corpo padrão do Next.js
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    // Obter o corpo da requisição como buffer
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'] as string;

    if (!sig) {
      return res.status(400).json({ error: 'Assinatura do Stripe não fornecida' });
    }

    console.log('Recebido evento webhook do Stripe');

    // Verificar a assinatura do webhook
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        buf.toString(),
        sig,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );
    } catch (err: any) {
      console.error(`Erro na assinatura do webhook: ${err.message}`);
      return res.status(400).json({ error: `Erro na assinatura do webhook: ${err.message}` });
    }

    console.log('Evento webhook verificado:', event.type);

    // Lidar com diferentes tipos de eventos
    switch (event.type) {
      case 'account.updated': {
        const account = event.data.object;
        console.log('Conta Stripe atualizada:', account.id);
        
        // Atualizar o status da conta do vendedor
        await updateSellerStripeStatus(account);
        break;
      }
      
      case 'account.application.deauthorized': {
        const account = event.data.object;
        console.log('Conta Stripe desautorizada:', account.id);
        
        // Remover a conexão do Stripe do vendedor
        await removeSellerStripeConnection(account);
        break;
      }
      
      // Adicione mais casos conforme necessário
      
      default:
        console.log(`Evento não tratado: ${event.type}`);
    }

    // Responder com sucesso
    return res.status(200).json({ received: true });
  } catch (error: any) {
    console.error('Erro ao processar webhook do Stripe:', error);
    return res.status(500).json({ 
      error: 'Erro ao processar webhook do Stripe',
      message: error.message 
    });
  }
}

// Função para atualizar o status da conta Stripe de um vendedor
async function updateSellerStripeStatus(account: any) {
  try {
    // Buscar os vendedores do arquivo JSON
    const dataDir = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDir, 'sellers.json');
    
    if (!fs.existsSync(filePath)) {
      console.error('Arquivo de vendedores não encontrado');
      return;
    }
    
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const sellers = JSON.parse(fileContents);
    
    // Encontrar o vendedor pelo ID da conta Stripe
    const sellerIndex = sellers.findIndex((s: any) => s.stripeAccountId === account.id);
    
    if (sellerIndex === -1) {
      console.error('Vendedor não encontrado para a conta Stripe:', account.id);
      return;
    }
    
    // Atualizar o status da conta
    const isActive = account.details_submitted && account.charges_enabled;
    sellers[sellerIndex].stripeAccountStatus = isActive ? 'active' : 'pending';
    sellers[sellerIndex].stripeOnboardingComplete = account.details_submitted;
    
    // Salvar as alterações
    fs.writeFileSync(filePath, JSON.stringify(sellers, null, 2));
    
    console.log(`Status da conta Stripe atualizado para o vendedor: ${sellers[sellerIndex].id}`);
  } catch (error) {
    console.error('Erro ao atualizar status da conta Stripe:', error);
  }
}

// Função para remover a conexão do Stripe de um vendedor
async function removeSellerStripeConnection(account: any) {
  try {
    // Buscar os vendedores do arquivo JSON
    const dataDir = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDir, 'sellers.json');
    
    if (!fs.existsSync(filePath)) {
      console.error('Arquivo de vendedores não encontrado');
      return;
    }
    
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const sellers = JSON.parse(fileContents);
    
    // Encontrar o vendedor pelo ID da conta Stripe
    const sellerIndex = sellers.findIndex((s: any) => s.stripeAccountId === account.id);
    
    if (sellerIndex === -1) {
      console.error('Vendedor não encontrado para a conta Stripe:', account.id);
      return;
    }
    
    // Remover as informações do Stripe
    delete sellers[sellerIndex].stripeAccountId;
    delete sellers[sellerIndex].stripeAccountStatus;
    delete sellers[sellerIndex].stripeOnboardingComplete;
    
    // Salvar as alterações
    fs.writeFileSync(filePath, JSON.stringify(sellers, null, 2));
    
    console.log(`Conexão Stripe removida para o vendedor: ${sellers[sellerIndex].id}`);
  } catch (error) {
    console.error('Erro ao remover conexão Stripe:', error);
  }
} 