import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../../styles/SellerDashboard.module.css';

interface SellerData {
  id: string;
  email: string;
  storeName: string;
  name: string;
  stripeAccountId?: string;
  stripeAccountStatus?: 'active' | 'pending' | 'not_connected';
  stripeOnboardingComplete?: boolean;
}

interface StripeAccountStatus {
  hasStripeAccount: boolean;
  accountId?: string;
  status?: 'active' | 'pending' | 'not_connected';
  detailsSubmitted?: boolean;
  chargesEnabled?: boolean;
  payoutsEnabled?: boolean;
}

export default function SellerDashboard() {
  const router = useRouter();
  const [sellerData, setSellerData] = useState<SellerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [stripeStatus, setStripeStatus] = useState<StripeAccountStatus | null>(null);
  const [isLoadingStripe, setIsLoadingStripe] = useState(false);
  const [stripeError, setStripeError] = useState('');
  // Usar uma ref para rastrear se a verificação de status já foi feita
  const statusCheckDone = useRef(false);

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
      } catch (error) {
        router.push('/seller/login');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);

  // Verificar o status da conta Stripe apenas uma vez quando o componente montar
  useEffect(() => {
    // Função para verificar o status apenas uma vez
    const checkStatusOnce = async () => {
      // Se o vendedor estiver logado e a verificação ainda não foi feita
      if (sellerData?.id && !statusCheckDone.current && !isLoadingStripe) {
        console.log("Verificando status do Stripe (uma única vez)");
        statusCheckDone.current = true;
        await checkStripeStatus();
      }
    };

    checkStatusOnce();

    // Cleanup - não precisamos remover nada aqui
  }, [sellerData]); // Depende apenas de sellerData, não de router.query

  // Se há parâmetros de sucesso na URL, atualiza o status
  useEffect(() => {
    if (router.query.success === 'stripe_connect_complete' && !isLoadingStripe) {
      console.log("Sucesso detectado na URL, atualizando status");
      checkStripeStatus();
    }
  }, [router.query.success]); // Apenas depende de success

  // Função para verificar o status da conta Stripe
  const checkStripeStatus = async () => {
    if (!sellerData?.id) return;
    
    // Evitar chamadas repetidas se já estiver carregando
    if (isLoadingStripe) return;
    
    setIsLoadingStripe(true);
    setStripeError('');
    
    try {
      console.log(`Verificando status para vendedor ${sellerData.id}`);
      const response = await fetch(`/api/stripe/connect/status?sellerId=${sellerData.id}`);
      const data = await response.json();
      
      if (response.ok) {
        setStripeStatus(data);
        
        // Atualizar os dados do vendedor com as informações do Stripe
        if (data.hasStripeAccount) {
          setSellerData(prev => {
            if (!prev) return null;
            return {
              ...prev,
              stripeAccountId: data.accountId,
              stripeAccountStatus: data.status,
              stripeOnboardingComplete: data.detailsSubmitted
            };
          });
          
          // Atualizar os dados no localStorage
          const updatedData = {
            ...sellerData,
            stripeAccountId: data.accountId,
            stripeAccountStatus: data.status,
            stripeOnboardingComplete: data.detailsSubmitted
          };
          localStorage.setItem('sellerData', JSON.stringify(updatedData));
        }
      } else {
        setStripeError(data.error || 'Erro ao verificar status do Stripe');
      }
    } catch (error) {
      console.error('Erro ao verificar status do Stripe:', error);
      setStripeError('Erro ao verificar status do Stripe. Por favor, tente novamente.');
    } finally {
      setIsLoadingStripe(false);
    }
  };

  // Função para iniciar o processo de onboarding do Stripe
  const connectStripe = async () => {
    if (!sellerData?.id || !sellerData?.email) return;
    
    setIsLoadingStripe(true);
    setStripeError('');
    
    try {
      console.log('Iniciando conexão com Stripe para:', { id: sellerData.id, email: sellerData.email });
      
      const response = await fetch('/api/stripe/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sellerId: sellerData.id,
          email: sellerData.email,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.url) {
        console.log('Link de onboarding do Stripe gerado com sucesso');
        // Redirecionar para o Stripe Connect Onboarding
        window.location.href = data.url;
      } else {
        console.error('Erro na resposta da API:', data);
        
        // Exibir mensagem de erro detalhada
        if (data.message) {
          setStripeError(`${data.error}: ${data.message}`);
        } else if (data.details) {
          setStripeError(`${data.error}: ${data.details}`);
        } else {
          setStripeError(data.error || 'Erro ao conectar com o Stripe');
        }
      }
    } catch (error) {
      console.error('Erro ao conectar com o Stripe:', error);
      setStripeError('Erro ao conectar com o Stripe. Por favor, tente novamente.');
    } finally {
      setIsLoadingStripe(false);
    }
  };

  // Função para acessar o dashboard do Stripe
  const goToStripeDashboard = async () => {
    if (!sellerData?.id) return;
    
    setIsLoadingStripe(true);
    setStripeError('');
    
    try {
      const response = await fetch(`/api/stripe/connect/login-link?sellerId=${sellerData.id}`);
      const data = await response.json();
      
      if (response.ok && data.url) {
        // Abrir o dashboard do Stripe em uma nova aba
        window.open(data.url, '_blank');
      } else {
        setStripeError(data.error || 'Erro ao acessar dashboard do Stripe');
      }
    } catch (error) {
      console.error('Erro ao acessar dashboard do Stripe:', error);
      setStripeError('Erro ao acessar dashboard do Stripe. Por favor, tente novamente.');
    } finally {
      setIsLoadingStripe(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sellerData');
    router.push('/seller/login');
  };

  // Obter saudação com base na hora do dia
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  // Mock data for dashboard
  const dashboardData = {
    revenue: '€2.450,50',
    orders: 35,
    subscribers: 28,
    views: 487
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Carregando dashboard...</p>
      </div>
    );
  }

  // Componente para exibir o status da conta Stripe
  const StripeConnectStatus = () => {
    if (isLoadingStripe) {
      return (
        <div className={styles.stripeLoading}>
          <div className={styles.loadingSpinner}></div>
          <p>Verificando status do Stripe...</p>
        </div>
      );
    }

    if (stripeError) {
      return (
        <div className={styles.stripeError}>
          <p>{stripeError}</p>
          <div className={styles.stripeActions}>
            <button 
              className={styles.retryButton}
              onClick={checkStripeStatus}
            >
              Verificar Status
            </button>
            <button 
              className={styles.connectStripeButton}
              onClick={connectStripe}
              disabled={isLoadingStripe}
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      );
    }

    if (!stripeStatus || !stripeStatus.hasStripeAccount) {
      return (
        <div className={styles.stripeNotConnected}>
          <h3>Conecte-se ao Stripe para receber pagamentos</h3>
          <p>Para receber pagamentos dos seus clientes, você precisa conectar sua conta ao Stripe.</p>
          <button 
            className={styles.connectStripeButton}
            onClick={connectStripe}
            disabled={isLoadingStripe}
          >
            {isLoadingStripe ? 'Conectando...' : 'Conectar ao Stripe'}
          </button>
        </div>
      );
    }

    if (stripeStatus.status === 'pending' || !stripeStatus.detailsSubmitted) {
      return (
        <div className={styles.stripePending}>
          <h3>Complete seu cadastro no Stripe</h3>
          <p>Você já iniciou o processo de cadastro no Stripe, mas ainda precisa completar algumas informações.</p>
          <button 
            className={styles.completeStripeButton}
            onClick={goToStripeDashboard}
            disabled={isLoadingStripe}
          >
            Completar cadastro
          </button>
        </div>
      );
    }

    return (
      <div className={styles.stripeConnected}>
        <h3>Conta Stripe conectada</h3>
        <p>Sua conta Stripe está ativa e pronta para receber pagamentos.</p>
        <div className={styles.stripeStatus}>
          <div className={styles.stripeStatusItem}>
            <span className={styles.statusLabel}>Status:</span>
            <span className={`${styles.statusValue} ${styles.statusActive}`}>Ativo</span>
          </div>
          <div className={styles.stripeStatusItem}>
            <span className={styles.statusLabel}>Pagamentos:</span>
            <span className={`${styles.statusValue} ${stripeStatus.chargesEnabled ? styles.statusActive : styles.statusInactive}`}>
              {stripeStatus.chargesEnabled ? 'Habilitados' : 'Desabilitados'}
            </span>
          </div>
          <div className={styles.stripeStatusItem}>
            <span className={styles.statusLabel}>Saques:</span>
            <span className={`${styles.statusValue} ${stripeStatus.payoutsEnabled ? styles.statusActive : styles.statusInactive}`}>
              {stripeStatus.payoutsEnabled ? 'Habilitados' : 'Desabilitados'}
            </span>
          </div>
        </div>
        <button 
          className={styles.stripeDashboardButton}
          onClick={goToStripeDashboard}
        >
          Acessar Dashboard do Stripe
        </button>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Dashboard de Vendedor - CoreBox</title>
        <meta name="description" content="Gerencie sua loja na CoreBox" />
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
            onClick={() => setActiveTab('overview')}
          >
            <span className={styles.navIcon}>📊</span>
            <span className={styles.navText}>Visão Geral</span>
          </button>
          
          <button 
            className={`${styles.navItem} ${activeTab === 'products' ? styles.active : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <span className={styles.navIcon}>📦</span>
            <span className={styles.navText}>Produtos</span>
          </button>
          
          <button 
            className={`${styles.navItem} ${activeTab === 'orders' ? styles.active : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <span className={styles.navIcon}>🛒</span>
            <span className={styles.navText}>Pedidos</span>
          </button>
          
          <button 
            className={`${styles.navItem} ${activeTab === 'customers' ? styles.active : ''}`}
            onClick={() => setActiveTab('customers')}
          >
            <span className={styles.navIcon}>👥</span>
            <span className={styles.navText}>Clientes</span>
          </button>
          
          <button 
            className={`${styles.navItem} ${activeTab === 'payments' ? styles.active : ''}`}
            onClick={() => setActiveTab('payments')}
          >
            <span className={styles.navIcon}>💰</span>
            <span className={styles.navText}>Pagamentos</span>
          </button>
          
          <button 
            className={`${styles.navItem} ${activeTab === 'settings' ? styles.active : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <span className={styles.navIcon}>⚙️</span>
            <span className={styles.navText}>Configurações</span>
          </button>
        </nav>
        
        <div className={styles.sidebarFooter}>
          <button className={styles.logoutButton} onClick={handleLogout}>
            <span className={styles.logoutIcon}>🚪</span>
            <span className={styles.logoutText}>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.content}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.greeting}>
            <h1>{getGreeting()}, {sellerData?.name.split(' ')[0]}</h1>
            <p>Bem-vindo ao seu dashboard de vendedor</p>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.notificationButton}>
              <span className={styles.notificationIcon}>🔔</span>
              <span className={styles.notificationBadge}>3</span>
            </button>
            <div className={styles.userProfile}>
              <div className={styles.userAvatar}>
                {sellerData?.name.charAt(0)}
              </div>
              <div className={styles.userName}>
                {sellerData?.name}
              </div>
            </div>
          </div>
        </header>

        {/* Content based on active tab */}
        <div className={styles.tabContent}>
          {activeTab === 'overview' && (
            <div className={styles.overviewTab}>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>💶</div>
                  <div className={styles.statInfo}>
                    <div className={styles.statValue}>{dashboardData.revenue}</div>
                    <div className={styles.statLabel}>Receita Total</div>
                  </div>
                </div>
                
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>📦</div>
                  <div className={styles.statInfo}>
                    <div className={styles.statValue}>{dashboardData.orders}</div>
                    <div className={styles.statLabel}>Pedidos</div>
                  </div>
                </div>
                
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>👥</div>
                  <div className={styles.statInfo}>
                    <div className={styles.statValue}>{dashboardData.subscribers}</div>
                    <div className={styles.statLabel}>Assinantes</div>
                  </div>
                </div>
                
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>👁️</div>
                  <div className={styles.statInfo}>
                    <div className={styles.statValue}>{dashboardData.views}</div>
                    <div className={styles.statLabel}>Visualizações</div>
                  </div>
                </div>
              </div>
              
              {/* Stripe Connect Status */}
              <div className={styles.stripeConnectSection}>
                <h2>Pagamentos com Stripe</h2>
                <StripeConnectStatus />
              </div>
              
              {/* Recent Orders */}
              <div className={styles.recentOrdersSection}>
                <div className={styles.sectionHeader}>
                  <h2>Pedidos Recentes</h2>
                  <Link href="/seller/orders">
                    <span className={styles.viewAllLink}>Ver Todos</span>
                  </Link>
                </div>
                
                <div className={styles.emptyState}>
                  <div className={styles.emptyStateIcon}>📦</div>
                  <h3>Nenhum pedido recente</h3>
                  <p>Seus pedidos recentes aparecerão aqui.</p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'payments' && (
            <div className={styles.paymentsTab}>
              <h2>Pagamentos</h2>
              
              {/* Stripe Connect Status */}
              <div className={styles.stripeConnectSection}>
                <h3>Configuração de Pagamentos</h3>
                <StripeConnectStatus />
              </div>
              
              {/* Payment History */}
              <div className={styles.paymentHistorySection}>
                <div className={styles.sectionHeader}>
                  <h3>Histórico de Pagamentos</h3>
                </div>
                
                <div className={styles.emptyState}>
                  <div className={styles.emptyStateIcon}>💰</div>
                  <h3>Nenhum pagamento recebido</h3>
                  <p>Seus pagamentos aparecerão aqui quando você começar a vender.</p>
                </div>
              </div>
            </div>
          )}
          
          {/* ... outros tabs ... */}
        </div>
      </main>
    </div>
  );
} 