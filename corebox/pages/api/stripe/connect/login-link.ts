import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '../../../../lib/stripe';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { sellerId } = req.query;

    if (!sellerId) {
      return res.status(400).json({ error: 'ID do vendedor é obrigatório' });
    }

    console.log('Criando link de login para o vendedor:', sellerId);

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
      return res.status(400).json({ 
        error: 'Vendedor não possui uma conta Stripe Connect'
      });
    }

    console.log('Conta Stripe encontrada:', seller.stripeAccountId);

    // Criar um link de login para o dashboard do Stripe
    const loginLink = await stripe.accounts.createLoginLink(
      seller.stripeAccountId
    );
    
    console.log('Link de login criado com sucesso');
    
    // Retornar o link de login
    return res.status(200).json({ url: loginLink.url });
  } catch (error: any) {
    console.error('Erro ao criar link de login para o Stripe:', error);
    return res.status(500).json({ 
      error: 'Erro ao criar link de login para o Stripe',
      message: error.message 
    });
  }
} 