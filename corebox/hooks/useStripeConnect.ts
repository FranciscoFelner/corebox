import { useState } from 'react';
import { SellerData, StripeAccountLink, StripeLoginLink } from '../types/seller';

interface UseStripeConnectProps {
  seller: SellerData | null;
}

interface UseStripeConnectReturn {
  isLoading: boolean;
  error: string | null;
  createStripeAccount: (sellerData: SellerData) => Promise<string | null>;
  getOnboardingLink: (accountId: string) => Promise<string | null>;
  getDashboardLink: (accountId: string) => Promise<string | null>;
}

interface ApiResponse {
  success?: boolean;
  error?: string;
}

export function useStripeConnect({ seller }: UseStripeConnectProps): UseStripeConnectReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Criar uma conta Stripe Connect para o vendedor
  const createStripeAccount = async (sellerData: SellerData): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe/connect/account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sellerId: sellerData.id,
          email: sellerData.email,
          storeName: sellerData.storeName,
          name: sellerData.name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar conta Stripe');
      }

      return data.accountId;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Obter link de onboarding para o vendedor
  const getOnboardingLink = async (accountId: string): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe/connect/account-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountId,
          refreshUrl: `${window.location.origin}/seller/dashboard?refresh=true`,
          returnUrl: `${window.location.origin}/seller/dashboard?success=true`,
        }),
      });

      const data = await response.json() as StripeAccountLink & ApiResponse;

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar link de onboarding');
      }

      return data.url;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Obter link para o dashboard do Stripe
  const getDashboardLink = async (accountId: string): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe/connect/login-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountId,
        }),
      });

      const data = await response.json() as StripeLoginLink & ApiResponse;

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar link para o dashboard');
      }

      return data.url;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    createStripeAccount,
    getOnboardingLink,
    getDashboardLink,
  };
} 