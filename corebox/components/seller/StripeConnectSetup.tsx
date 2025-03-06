import React, { useState, useEffect } from 'react';
import { useStripeConnect } from '../../hooks/useStripeConnect';
import { SellerData } from '../../types/seller';
import styles from '../../styles/SellerDashboard.module.css';

interface StripeConnectSetupProps {
  seller: SellerData;
  onUpdate: (updatedSeller: Partial<SellerData>) => void;
}

export default function StripeConnectSetup({ seller, onUpdate }: StripeConnectSetupProps) {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { isLoading, error, createStripeAccount, getOnboardingLink, getDashboardLink } = useStripeConnect({ seller });

  // Verificar se o vendedor já tem uma conta Stripe
  const hasStripeAccount = !!seller.stripeAccountId;
  const isStripeAccountActive = seller.stripeAccountStatus === 'active';
  const isStripeAccountPending = seller.stripeAccountStatus === 'pending';

  // Verificar se o vendedor está retornando do onboarding
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isSuccess = urlParams.get('success') === 'true';
    const isRefresh = urlParams.get('refresh') === 'true';

    if ((isSuccess || isRefresh) && hasStripeAccount) {
      // Atualizar o status da conta Stripe (em um ambiente real, você faria uma chamada à API)
      onUpdate({
        stripeAccountDetailsSubmitted: true,
        stripeAccountStatus: 'active',
      });
    }
  }, [hasStripeAccount, onUpdate]);

  // Função para iniciar o processo de onboarding
  const handleSetupStripe = async () => {
    setIsRedirecting(true);

    try {
      let accountId = seller.stripeAccountId;

      // Se o vendedor não tem uma conta Stripe, criar uma
      if (!accountId) {
        const newAccountId = await createStripeAccount(seller);
        
        if (newAccountId) {
          accountId = newAccountId;
          onUpdate({
            stripeAccountId: newAccountId,
            stripeAccountStatus: 'pending',
            stripeAccountCreatedAt: new Date().toISOString(),
          });
        } else {
          throw new Error('Não foi possível criar a conta Stripe');
        }
      }

      // Obter o link de onboarding
      if (accountId) {
        const onboardingUrl = await getOnboardingLink(accountId);
        
        if (onboardingUrl) {
          // Redirecionar para o onboarding
          window.location.href = onboardingUrl;
        } else {
          throw new Error('Não foi possível obter o link de onboarding');
        }
      }
    } catch (err: any) {
      console.error('Erro ao configurar Stripe:', err);
      setIsRedirecting(false);
    }
  };

  // Função para acessar o dashboard do Stripe
  const handleViewStripeDashboard = async () => {
    setIsRedirecting(true);

    try {
      if (seller.stripeAccountId) {
        const dashboardUrl = await getDashboardLink(seller.stripeAccountId);
        
        if (dashboardUrl) {
          // Abrir o dashboard em uma nova aba
          window.open(dashboardUrl, '_blank');
        } else {
          throw new Error('Não foi possível obter o link para o dashboard');
        }
      }
    } catch (err: any) {
      console.error('Erro ao acessar dashboard:', err);
    } finally {
      setIsRedirecting(false);
    }
  };

  return (
    <div className={styles.stripeConnectSection}>
      <h3 className={styles.sectionTitle}>Pagamentos com Stripe Connect</h3>
      
      {error && (
        <div className={styles.errorMessage}>
          <p>{error}</p>
        </div>
      )}
      
      <div className={styles.stripeConnectCard}>
        <div className={styles.stripeConnectInfo}>
          <div className={styles.stripeConnectIcon}>
            <svg viewBox="0 0 60 25" xmlns="http://www.w3.org/2000/svg" width="60" height="25" fill="#635BFF">
              <path d="M59.64 14.28h-8.06v-1.83h8.06v1.83zm0-3.67h-8.06V8.79h8.06v1.82zm-8.06 5.5h8.06v1.83h-8.06v-1.83zm-9.7 5.5v-4.6a3.6 3.6 0 0 0-.92-2.6c-.6-.7-1.46-1.05-2.6-1.05-1.17 0-2.13.37-2.89 1.11a4.81 4.81 0 0 0-1.33 2.43 4.04 4.04 0 0 0-3.89-3.54c-1.13 0-2.05.36-2.76 1.09-.15.15-.31.33-.47.52v-1.24h-2.95v7.88h2.95v-4.4c0-.97.19-1.73.58-2.29.4-.56.99-.84 1.77-.84.7 0 1.22.21 1.58.62.36.42.54 1.03.54 1.83v5.08h2.95v-4.4c0-.97.19-1.73.58-2.29.4-.56.99-.84 1.77-.84.7 0 1.22.21 1.58.62.36.42.54 1.03.54 1.83v5.08h2.97zm-17.3-7.88h-2.95v7.88h2.95v-7.88zm-1.52-1.9a1.89 1.89 0 0 0 1.36-.54c.36-.36.54-.8.54-1.31 0-.5-.18-.93-.54-1.3a1.89 1.89 0 0 0-1.36-.54c-.54 0-1 .18-1.37.54-.36.37-.54.8-.54 1.3 0 .51.18.95.54 1.31.36.36.83.54 1.37.54zm-6.85 3.03v-1.13h-2.95v7.88h2.95v-4.4c0-.92.21-1.67.62-2.25.41-.58 1-.87 1.74-.87.27 0 .52.03.74.08.22.06.4.12.53.19v-2.72a4.7 4.7 0 0 0-1.33-.19c-1.37 0-2.42.53-3.3 1.41zm-6.21-8.12l-2.95.56v4.58h-1.77v2.62h1.77v4.5c0 1.1.27 1.9.8 2.4.53.5 1.36.75 2.47.75.7 0 1.33-.07 1.89-.22v-2.57c-.3.1-.67.14-1.11.14-.42 0-.72-.1-.9-.28-.19-.19-.28-.52-.28-1v-3.72h2.29v-2.62h-2.21V1.74zM6.5 17.7c-.82 0-1.43-.28-1.81-.84-.39-.56-.58-1.33-.58-2.29v-.05h7.05c0-1.3-.32-2.33-.97-3.09-.65-.75-1.61-1.13-2.9-1.13-1.4 0-2.5.45-3.34 1.35a4.9 4.9 0 0 0-1.25 3.5c0 1.4.44 2.5 1.32 3.33.88.82 2.08 1.24 3.6 1.24 1.66 0 2.92-.64 3.78-1.92l-2.2-1.25c-.41.75-1.05 1.15-1.7 1.15zm-2.39-4.53c.05-.75.23-1.32.55-1.72.32-.4.77-.6 1.35-.6.54 0 .95.18 1.25.55.3.37.46.88.5 1.55v.22H4.11z" />
            </svg>
          </div>
          
          <div className={styles.stripeConnectStatus}>
            {!hasStripeAccount && (
              <p>Configure sua conta Stripe para começar a receber pagamentos.</p>
            )}
            
            {hasStripeAccount && isStripeAccountPending && (
              <p>Sua conta Stripe foi criada, mas você precisa completar o processo de onboarding.</p>
            )}
            
            {hasStripeAccount && isStripeAccountActive && (
              <>
                <p className={styles.successText}>Sua conta Stripe está ativa e pronta para receber pagamentos!</p>
                <p>Você pode acessar o dashboard do Stripe para gerenciar seus pagamentos, visualizar transações e configurar sua conta.</p>
              </>
            )}
          </div>
        </div>
        
        <div className={styles.stripeConnectActions}>
          {!hasStripeAccount && (
            <button 
              className={styles.primaryButton}
              onClick={handleSetupStripe}
              disabled={isLoading || isRedirecting}
            >
              {isLoading || isRedirecting ? 'Carregando...' : 'Configurar Stripe Connect'}
            </button>
          )}
          
          {hasStripeAccount && isStripeAccountPending && (
            <button 
              className={styles.primaryButton}
              onClick={handleSetupStripe}
              disabled={isLoading || isRedirecting}
            >
              {isLoading || isRedirecting ? 'Carregando...' : 'Completar Configuração'}
            </button>
          )}
          
          {hasStripeAccount && isStripeAccountActive && (
            <button 
              className={styles.secondaryButton}
              onClick={handleViewStripeDashboard}
              disabled={isLoading || isRedirecting}
            >
              {isLoading || isRedirecting ? 'Carregando...' : 'Acessar Dashboard do Stripe'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 