export interface SellerData {
  id: string;
  email: string;
  storeName: string;
  name: string;
  phone?: string;
  description?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
  
  // Campos relacionados ao Stripe Connect
  stripeAccountId?: string;
  stripeAccountStatus?: 'pending' | 'active' | 'rejected';
  stripeAccountCreatedAt?: string;
  stripeAccountUpdatedAt?: string;
  stripeAccountDetailsSubmitted?: boolean;
  stripeAccountPayoutsEnabled?: boolean;
  stripeAccountChargesEnabled?: boolean;
  
  // Endereço do vendedor
  address?: {
    street?: string;
    number?: string;
    complement?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  
  // Informações bancárias (não armazenamos detalhes sensíveis, apenas metadados)
  bankAccountLastFour?: string;
  bankAccountType?: string;
  bankAccountStatus?: 'pending' | 'verified' | 'rejected';
}

export interface StripeAccountLink {
  url: string;
  expiresAt: number;
}

export interface StripeLoginLink {
  url: string;
} 