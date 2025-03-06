# Configuração do Stripe Connect no CoreBox

Este documento fornece instruções para configurar o Stripe Connect no projeto CoreBox, permitindo que vendedores recebam pagamentos diretamente em suas contas bancárias.

## Pré-requisitos

1. Conta Stripe (você pode criar uma em [stripe.com](https://stripe.com))
2. Node.js e npm/yarn instalados
3. Projeto CoreBox configurado

## Instalação

1. Instale as dependências do Stripe:

```bash
npm install stripe @stripe/stripe-js @stripe/react-stripe-js micro
# ou
yarn add stripe @stripe/stripe-js @stripe/react-stripe-js micro
```

2. Crie um arquivo `.env.local` na raiz do projeto com base no arquivo `.env.local.example`:

```bash
cp .env.local.example .env.local
```

3. Preencha as variáveis de ambiente no arquivo `.env.local` com suas chaves do Stripe:

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51QxVPmPvpGWKXjmy4h97vVVmkUkwc0BKswyJUVQY4gakom0dI2H7Jb5z0jUQSwNz0nOXCqxeG0K0M3VORW9Wmz4J00C13APacT
STRIPE_SECRET_KEY=sk_test_51QxVPmPvpGWKXjmyz9W4wDpyGSqQtmDzmUaiNSvNID6fhS3aSnxlcFFod67EIdMlbF64AWD75ytLfHgjd0kSbpPg00hIJmRasq
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_CONNECT_CLIENT_ID=ca_your_client_id
NEXT_PUBLIC_STRIPE_CONNECT_ACCOUNT_TYPE=express
```

## Configuração do Stripe Dashboard

1. Acesse o [Dashboard do Stripe](https://dashboard.stripe.com/)
2. Vá para "Connect" > "Settings" > "Connect settings"
3. Configure o tipo de conta como "Express" (recomendado para a maioria dos casos)
4. Adicione os domínios permitidos para redirecionamento:
   - Para desenvolvimento: `http://localhost:3000`
   - Para produção: `https://seu-dominio.com`
5. Configure as URLs de redirecionamento:
   - URL de retorno: `https://seu-dominio.com/seller/dashboard?success=true`
   - URL de atualização: `https://seu-dominio.com/seller/dashboard?refresh=true`

## Configuração do Webhook

Para receber eventos do Stripe (como quando um vendedor completa o onboarding), você precisa configurar um webhook:

1. No Dashboard do Stripe, vá para "Developers" > "Webhooks"
2. Clique em "Add endpoint"
3. Adicione a URL do seu endpoint (ex: `https://seu-dominio.com/api/stripe/webhook`)
4. Selecione os eventos que deseja receber (recomendado para Connect):
   - `account.updated`
   - `account.application.authorized`
   - `account.application.deauthorized`
   - `person.created`
   - `person.updated`
   - `person.deleted`

5. Copie o "Signing Secret" e adicione-o à variável `STRIPE_WEBHOOK_SECRET` no seu arquivo `.env.local`

## Uso no Projeto

### Para Vendedores

1. O componente `StripeConnectSetup` foi adicionado ao dashboard do vendedor
2. Vendedores podem clicar em "Configurar Stripe Connect" para iniciar o processo de onboarding
3. Após completar o onboarding, eles podem acessar o Dashboard do Stripe para gerenciar seus pagamentos

### Para Administradores

1. Você pode monitorar as contas dos vendedores no Dashboard do Stripe Connect
2. Você pode visualizar transações, pagamentos e estornos
3. Você pode configurar taxas de plataforma nas configurações do Connect

### Processamento de Pagamentos

Para processar pagamentos com o Stripe, você pode usar os componentes fornecidos:

1. Envolva seu componente de checkout com o `StripeProvider`:

```jsx
import StripeProvider from '../components/checkout/StripeProvider';

function CheckoutPage() {
  return (
    <StripeProvider>
      <YourCheckoutComponent />
    </StripeProvider>
  );
}
```

2. Use o componente `StripeCheckout` para coletar informações de pagamento:

```jsx
import StripeCheckout from '../components/checkout/StripeCheckout';

function YourCheckoutComponent() {
  const handlePaymentSuccess = (paymentIntent) => {
    console.log('Pagamento bem-sucedido:', paymentIntent);
    // Redirecionar para página de sucesso ou atualizar o pedido
  };

  const handlePaymentError = (error) => {
    console.error('Erro no pagamento:', error);
    // Mostrar mensagem de erro
  };

  return (
    <div>
      <h2>Finalizar Compra</h2>
      
      <div className="payment-summary">
        <p>Total: €29,90</p>
      </div>
      
      <StripeCheckout
        amount={2990} // em centavos
        currency="eur"
        description="Caixa Gourmet - Assinatura Mensal"
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </div>
  );
}
```

3. Para pagamentos com Stripe Connect (para vendedores), adicione o ID da conta do vendedor:

```jsx
<StripeCheckout
  amount={2990}
  currency="eur"
  description="Caixa Gourmet - Assinatura Mensal"
  metadata={{ orderId: '12345' }}
  connectedAccountId="acct_123456" // ID da conta Stripe do vendedor
  applicationFee={290} // Taxa da plataforma (10% neste exemplo)
  onSuccess={handlePaymentSuccess}
  onError={handlePaymentError}
/>
```

## Fluxo de Pagamento

1. Cliente faz um pedido e paga através do Stripe
2. O pagamento é processado pela sua conta Stripe (plataforma)
3. O valor (menos a taxa da plataforma) é transferido automaticamente para a conta do vendedor
4. O vendedor pode sacar o dinheiro para sua conta bancária

## Testes

Para testar o Stripe Connect em ambiente de desenvolvimento:

1. Use as chaves de teste do Stripe (`pk_test_` e `sk_test_`)
2. Use os [cartões de teste do Stripe](https://stripe.com/docs/testing#cards) para simular pagamentos:
   - Cartão de sucesso: `4242 4242 4242 4242`
   - Cartão que requer autenticação: `4000 0025 0000 3155`
   - Cartão que será recusado: `4000 0000 0000 0002`
3. Use as [contas de teste do Stripe Connect](https://stripe.com/docs/connect/testing) para simular vendedores

## Solução de Problemas

- **Erro de CORS**: Verifique se os domínios estão configurados corretamente nas configurações do Connect
- **Erro de Webhook**: Verifique se o "Signing Secret" está correto e se o endpoint está acessível
- **Erro de Redirecionamento**: Verifique se as URLs de redirecionamento estão configuradas corretamente
- **Erro no Pagamento**: Verifique os logs do Stripe Dashboard para mais detalhes sobre o erro

## Recursos Adicionais

- [Documentação do Stripe Connect](https://stripe.com/docs/connect)
- [Guia de Integração do Express](https://stripe.com/docs/connect/express-accounts)
- [Webhooks do Stripe Connect](https://stripe.com/docs/connect/webhooks)
- [Taxas e Preços do Stripe Connect](https://stripe.com/docs/connect/pricing)
- [Documentação do Stripe.js](https://stripe.com/docs/js)
- [Documentação do Stripe Elements](https://stripe.com/docs/stripe-js/react) 