import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '../../../../lib/stripe';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { sellerId, email } = req.body;

    console.log('Recebida solicitação para criar conta Stripe Connect:', { sellerId, email });

    if (!sellerId || !email) {
      console.error('ID do vendedor ou email não fornecidos');
      return res.status(400).json({ error: 'ID do vendedor e email são obrigatórios' });
    }

    // Verificar se o cliente Stripe está inicializado corretamente
    if (!stripe) {
      console.error('Cliente Stripe não inicializado');
      return res.status(500).json({ error: 'Erro ao inicializar cliente Stripe' });
    }
    
    try {
      // Verificar se já existe uma conta para este vendedor
      console.log('Verificando se já existe uma conta para este vendedor');
      const existingAccounts = await stripe.accounts.list({
        limit: 100,
      });
      
      const existingAccount = existingAccounts.data.find(
        (account) => account.metadata && account.metadata.sellerId === sellerId
      );
      
      if (existingAccount) {
        console.log('Conta Stripe já existe para este vendedor:', existingAccount.id);
        
        try {
          // Criar um link de onboarding para a conta existente
          console.log('Criando link de onboarding para conta existente');
          const accountLink = await stripe.accountLinks.create({
            account: existingAccount.id,
            refresh_url: `http://localhost:3000/api/stripe/connect/callback?sellerId=${sellerId}&error=true`,
            return_url: `http://localhost:3000/api/stripe/connect/callback?sellerId=${sellerId}&success=true`,
            type: 'account_onboarding',
          });
          
          console.log('Link de onboarding criado para conta existente:', accountLink.url);
          
          // Retornar o URL para o cliente
          return res.status(200).json({ url: accountLink.url });
        } catch (linkError: any) {
          console.error('Erro ao criar link de onboarding para conta existente:', linkError);
          console.error('Detalhes do erro:', JSON.stringify(linkError, null, 2));
          
          return res.status(500).json({ 
            error: 'Erro ao criar link de onboarding',
            message: linkError.message,
            param: linkError.param,
            code: linkError.code || 'unknown'
          });
        }
      }
      
      // Criar uma nova conta Express para o vendedor com campos mínimos
      console.log('Criando nova conta Stripe Express básica');
      try {
        const account = await stripe.accounts.create({
          type: 'express',
          email,
          metadata: {
            sellerId,
          }
        });

        console.log('Conta Stripe criada com sucesso:', account.id);

        // Criar um link de onboarding
        console.log('Criando link de onboarding para nova conta');
        const accountLink = await stripe.accountLinks.create({
          account: account.id,
          refresh_url: `http://localhost:3000/api/stripe/connect/callback?sellerId=${sellerId}&error=true`,
          return_url: `http://localhost:3000/api/stripe/connect/callback?sellerId=${sellerId}&success=true`,
          type: 'account_onboarding',
        });

        console.log('Link de onboarding criado com sucesso:', accountLink.url);

        // Retornar o URL para o cliente
        return res.status(200).json({ url: accountLink.url });
      } catch (accountError: any) {
        console.error('Erro ao criar conta Stripe:', accountError);
        console.error('Detalhes do erro:', JSON.stringify(accountError, null, 2));
        
        return res.status(500).json({ 
          error: 'Erro ao criar conta Stripe',
          message: accountError.message,
          param: accountError.param,
          code: accountError.code || 'unknown'
        });
      }
    } catch (stripeError: any) {
      console.error('Erro na API do Stripe:', stripeError);
      console.error('Detalhes completos do erro:', JSON.stringify(stripeError, null, 2));
      
      // Verificar se é um erro de chave inválida
      if (stripeError.type === 'StripeAuthenticationError') {
        console.error('Erro de autenticação do Stripe. Verifique sua chave API.');
        return res.status(500).json({ 
          error: 'Erro de autenticação do Stripe',
          message: 'Verifique se sua chave API do Stripe está correta',
          code: stripeError.code || 'authentication_error'
        });
      }
      
      // Verificar se é um erro de parâmetro inválido
      if (stripeError.type === 'StripeInvalidRequestError') {
        console.error('Erro de requisição inválida. Parâmetro:', stripeError.param);
        return res.status(400).json({ 
          error: 'Parâmetro inválido na requisição ao Stripe',
          message: `Parâmetro inválido: ${stripeError.param}`,
          details: stripeError.message,
          code: stripeError.code || 'invalid_request_error'
        });
      }
      
      return res.status(500).json({ 
        error: 'Erro na API do Stripe',
        message: stripeError.message,
        code: stripeError.code || 'unknown'
      });
    }
  } catch (error: any) {
    console.error('Erro ao criar conta Stripe Connect:', error);
    console.error('Detalhes completos do erro:', JSON.stringify(error, null, 2));
    return res.status(500).json({ 
      error: 'Erro ao criar conta Stripe Connect',
      message: error.message 
    });
  }
} 