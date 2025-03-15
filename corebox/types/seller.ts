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