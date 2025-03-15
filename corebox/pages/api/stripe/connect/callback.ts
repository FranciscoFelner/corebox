import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '../../../../lib/stripe';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { sellerId, success, error } = req.query;

    // Para testes locais, usamos apenas os parâmetros de sucesso e erro
    // Não precisamos lidar com o código de autorização OAuth
    
    if (!sellerId) {
      return res.status(400).json({ error: 'ID do vendedor é obrigatório' });
    }

    // Se houve um erro no processo de onboarding
    if (error === 'true') {
      console.log('Erro no processo de onboarding do Stripe para o vendedor:', sellerId);
      // Redirecionar para uma página de erro
      return res.redirect(`/seller/dashboard?error=stripe_connect_failed`);
    }

    // Se o onboarding foi bem-sucedido
    if (success === 'true') {
      console.log('Onboarding do Stripe bem-sucedido para o vendedor:', sellerId);
      
      // Buscar os vendedores do arquivo JSON
      const dataDir = path.join(process.cwd(), 'data');
      const filePath = path.join(dataDir, 'sellers.json');
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Arquivo de vendedores não encontrado' });
      }
      
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const sellers = JSON.parse(fileContents);
      
      // Encontrar o vendedor pelo ID
      const sellerIndex = sellers.findIndex((seller: any) => seller.id === sellerId);
      
      if (sellerIndex === -1) {
        return res.status(404).json({ error: 'Vendedor não encontrado' });
      }
      
      // Buscar a conta Stripe Connect do vendedor
      const accounts = await stripe.accounts.list({
        limit: 100,
      });
      
      const sellerAccount = accounts.data.find(
        (account) => account.metadata && account.metadata.sellerId === sellerId
      );
      
      if (!sellerAccount) {
        return res.status(404).json({ error: 'Conta Stripe não encontrada' });
      }
      
      console.log('Conta Stripe encontrada:', sellerAccount.id);
      
      // Atualizar o vendedor com os dados do Stripe
      sellers[sellerIndex].stripeAccountId = sellerAccount.id;
      sellers[sellerIndex].stripeAccountStatus = sellerAccount.details_submitted ? 'active' : 'pending';
      sellers[sellerIndex].stripeOnboardingComplete = sellerAccount.details_submitted;
      
      // Salvar as alterações
      fs.writeFileSync(filePath, JSON.stringify(sellers, null, 2));
      
      console.log('Dados do vendedor atualizados com sucesso');
      
      // Redirecionar para o dashboard do vendedor
      return res.redirect(`/seller/dashboard?success=stripe_connect_complete`);
    }

    // Se não houver parâmetros de sucesso ou erro
    return res.status(400).json({ error: 'Parâmetros inválidos' });
  } catch (error: any) {
    console.error('Erro ao processar callback do Stripe Connect:', error);
    return res.status(500).json({ 
      error: 'Erro ao processar callback do Stripe Connect',
      message: error.message 
    });
  }
} 