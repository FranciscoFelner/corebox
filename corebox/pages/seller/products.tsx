import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../../styles/SellerDashboard.module.css';
import productStyles from '../../styles/SellerProducts.module.css';

interface SellerData {
  id: string;
  email: string;
  storeName: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  status: 'active' | 'draft' | 'archived';
  subscribers: number;
  lastUpdated: string;
}

export default function SellerProducts() {
  const router = useRouter();
  const [sellerData, setSellerData] = useState<SellerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [productFilter, setProductFilter] = useState('all');

  // Mock product data
  const mockProducts: Product[] = [
    {
      id: 'p1',
      name: 'Caixa Tech Premium',
      description: 'Uma coleção de gadgets e acessórios tecnológicos para entusiastas.',
      price: 49.90,
      image: 'https://images.unsplash.com/photo-1581235720704-06d3acfcb85f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      status: 'active',
      subscribers: 127,
      lastUpdated: '2023-08-15'
    },
    {
      id: 'p2',
      name: 'Caixa Gourmet Essencial',
      description: 'Seleção de produtos gourmet importados para os amantes de boa culinária.',
      price: 39.90,
      image: 'https://images.unsplash.com/photo-1606914907313-3fde0444dd43?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      status: 'active',
      subscribers: 98,
      lastUpdated: '2023-09-02'
    },
    {
      id: 'p3',
      name: 'Caixa Fitness',
      description: 'Produtos e suplementos para quem ama manter a boa forma e saúde.',
      price: 44.90,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      status: 'draft',
      subscribers: 0,
      lastUpdated: '2023-09-10'
    }
  ];

  useEffect(() => {
    // Check if the seller is logged in
    const checkAuth = () => {
      const storedData = localStorage.getItem('sellerData');
      if (!storedData) {
        router.push('/seller/login');
        return;
      }
      
      try {
        const parsedData = JSON.parse(storedData);
        setSellerData(parsedData);
        // Load mock products
        setProducts(mockProducts);
      } catch (error) {
        router.push('/seller/login');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('sellerData');
    router.push('/seller/login');
  };

  const navigateToDashboard = (tab: string) => {
    router.push({
      pathname: '/seller/dashboard',
      query: { tab }
    });
  };

  const getFilteredProducts = () => {
    if (productFilter === 'all') return products;
    return products.filter(product => product.status === productFilter);
  };

  const formatPrice = (price: number): string => {
    return `€${price.toFixed(2).replace('.', ',')}`;
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Carregando produtos...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Minhas Caixas - CoreBox</title>
        <meta name="description" content="Gerencie suas caixas de assinatura na CoreBox" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Seller Dashboard Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/">
            <span className={styles.logo}>CoreBox</span>
          </Link>
          <div className={styles.storeName}>
            {sellerData?.storeName}
          </div>
        </div>
        
        <nav className={styles.sidebarNav}>
          <button 
            className={`${styles.navItem} ${activeTab === 'overview' ? styles.active : ''}`}
            onClick={() => navigateToDashboard('overview')}
          >
            <span className={styles.navIcon}>📊</span>
            <span className={styles.navText}>Visão Geral</span>
          </button>
          
          <button 
            className={`${styles.navItem} ${activeTab === 'products' ? styles.active : ''}`}
            onClick={() => router.push('/seller/products')}
          >
            <span className={styles.navIcon}>📦</span>
            <span className={styles.navText}>Minhas Caixas</span>
          </button>
          
          <button 
            className={`${styles.navItem} ${activeTab === 'orders' ? styles.active : ''}`}
            onClick={() => navigateToDashboard('orders')}
          >
            <span className={styles.navIcon}>🛒</span>
            <span className={styles.navText}>Pedidos</span>
          </button>
          
          <button 
            className={`${styles.navItem} ${activeTab === 'subscribers' ? styles.active : ''}`}
            onClick={() => navigateToDashboard('subscribers')}
          >
            <span className={styles.navIcon}>👥</span>
            <span className={styles.navText}>Assinantes</span>
          </button>
          
          <button 
            className={`${styles.navItem} ${activeTab === 'analytics' ? styles.active : ''}`}
            onClick={() => navigateToDashboard('analytics')}
          >
            <span className={styles.navIcon}>📈</span>
            <span className={styles.navText}>Estatísticas</span>
          </button>
          
          <button 
            className={`${styles.navItem} ${activeTab === 'settings' ? styles.active : ''}`}
            onClick={() => navigateToDashboard('settings')}
          >
            <span className={styles.navIcon}>⚙️</span>
            <span className={styles.navText}>Configurações</span>
          </button>
        </nav>
        
        <div className={styles.sidebarFooter}>
          <button className={styles.logoutButton} onClick={handleLogout}>
            <span className={styles.navIcon}>🚪</span>
            <span className={styles.navText}>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={styles.content}>
        <header className={styles.contentHeader}>
          <h1 className={styles.pageTitle}>Minhas Caixas</h1>
          
          <div className={productStyles.headerActions}>
            <Link href="/seller/products/new">
              <a className={productStyles.addButton}>
                <span>➕</span> Nova Caixa
              </a>
            </Link>
          </div>
        </header>

        <div className={styles.contentBody}>
          <div className={productStyles.filterBar}>
            <div className={productStyles.filterOptions}>
              <button 
                className={`${productStyles.filterOption} ${productFilter === 'all' ? productStyles.active : ''}`}
                onClick={() => setProductFilter('all')}
              >
                Todas
              </button>
              <button 
                className={`${productStyles.filterOption} ${productFilter === 'active' ? productStyles.active : ''}`}
                onClick={() => setProductFilter('active')}
              >
                Ativas
              </button>
              <button 
                className={`${productStyles.filterOption} ${productFilter === 'draft' ? productStyles.active : ''}`}
                onClick={() => setProductFilter('draft')}
              >
                Rascunhos
              </button>
              <button 
                className={`${productStyles.filterOption} ${productFilter === 'archived' ? productStyles.active : ''}`}
                onClick={() => setProductFilter('archived')}
              >
                Arquivadas
              </button>
            </div>
            
            <div className={productStyles.search}>
              <input type="text" placeholder="Buscar caixas..." />
              <button className={productStyles.searchButton}>🔍</button>
            </div>
          </div>
          
          <div className={productStyles.productsGrid}>
            {getFilteredProducts().map(product => (
              <div key={product.id} className={productStyles.productCard}>
                <div className={productStyles.productImageContainer}>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className={productStyles.productImage}
                  />
                  <div className={productStyles.productStatus} data-status={product.status}>
                    {product.status === 'active' ? 'Ativa' : product.status === 'draft' ? 'Rascunho' : 'Arquivada'}
                  </div>
                </div>
                
                <div className={productStyles.productInfo}>
                  <h3 className={productStyles.productTitle}>{product.name}</h3>
                  <p className={productStyles.productDescription}>{product.description}</p>
                  
                  <div className={productStyles.productMeta}>
                    <div className={productStyles.productPrice}>
                      {formatPrice(product.price)}
                      <span className={productStyles.perMonth}>/mês</span>
                    </div>
                    
                    <div className={productStyles.productStats}>
                      <div className={productStyles.statItem}>
                        <span className={productStyles.statIcon}>👥</span>
                        <span>{product.subscribers}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={productStyles.productActions}>
                    <Link href={`/seller/products/edit/${product.id}`}>
                      <a className={productStyles.actionButton}>
                        <span>✏️</span> Editar
                      </a>
                    </Link>
                    <button className={productStyles.actionButton}>
                      <span>📊</span> Estatísticas
                    </button>
                    <button className={productStyles.actionButton}>
                      <span>⋮</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Add New Box Card */}
            <div className={productStyles.addNewCard}>
              <div className={productStyles.addNewContent}>
                <div className={productStyles.addIcon}>➕</div>
                <h3>Criar Nova Caixa</h3>
                <p>Lance uma nova assinatura para seus clientes</p>
                <Link href="/seller/products/new">
                  <a className={productStyles.addNewButton}>Começar Agora</a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 