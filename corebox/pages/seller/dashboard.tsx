import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../../styles/SellerDashboard.module.css';

interface SellerData {
  id: string;
  email: string;
  storeName: string;
  name: string;
}

export default function SellerDashboard() {
  const router = useRouter();
  const [sellerData, setSellerData] = useState<SellerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

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
            <span className={styles.navText}>Minhas Caixas</span>
          </button>
          
          <button 
            className={`${styles.navItem} ${activeTab === 'orders' ? styles.active : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <span className={styles.navIcon}>🛒</span>
            <span className={styles.navText}>Pedidos</span>
          </button>
          
          <button 
            className={`${styles.navItem} ${activeTab === 'subscribers' ? styles.active : ''}`}
            onClick={() => setActiveTab('subscribers')}
          >
            <span className={styles.navIcon}>👥</span>
            <span className={styles.navText}>Assinantes</span>
          </button>
          
          <button 
            className={`${styles.navItem} ${activeTab === 'analytics' ? styles.active : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <span className={styles.navIcon}>📈</span>
            <span className={styles.navText}>Estatísticas</span>
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
            <span className={styles.navIcon}>🚪</span>
            <span className={styles.navText}>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        <header className={styles.contentHeader}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>
              {activeTab === 'overview' && 'Visão Geral'}
              {activeTab === 'products' && 'Minhas Caixas'}
              {activeTab === 'orders' && 'Pedidos'}
              {activeTab === 'subscribers' && 'Assinantes'}
              {activeTab === 'analytics' && 'Estatísticas'}
              {activeTab === 'settings' && 'Configurações'}
            </h1>
            {activeTab === 'overview' && (
              <p className={styles.welcomeSubtitle}>
                Veja métricas e atividades recentes da sua loja
              </p>
            )}
          </div>
          
          <div className={styles.userInfo}>
            <span className={styles.welcomeText}>
              {getGreeting()}, <strong>{sellerData?.name}</strong>
            </span>
          </div>
        </header>

        {/* Content for different tabs */}
        <div className={styles.contentBody}>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className={styles.overview}>
              <div className={styles.welcomeBanner}>
                <div className={styles.welcomeBannerContent}>
                  <h2>Bem-vindo à sua dashboard, {sellerData?.name}!</h2>
                  <p>Gerencie sua loja <strong>{sellerData?.storeName}</strong> e acompanhe o desempenho das suas caixas de assinatura.</p>
                </div>
                <div className={styles.welcomeBannerIcon}>🚀</div>
              </div>
            
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>💰</div>
                  <div className={styles.statInfo}>
                    <h3 className={styles.statTitle}>Faturamento do Mês</h3>
                    <p className={styles.statValue}>{dashboardData.revenue}</p>
                  </div>
                </div>
                
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>📝</div>
                  <div className={styles.statInfo}>
                    <h3 className={styles.statTitle}>Pedidos</h3>
                    <p className={styles.statValue}>{dashboardData.orders}</p>
                  </div>
                </div>
                
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>👥</div>
                  <div className={styles.statInfo}>
                    <h3 className={styles.statTitle}>Assinantes</h3>
                    <p className={styles.statValue}>{dashboardData.subscribers}</p>
                  </div>
                </div>
                
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>👁️</div>
                  <div className={styles.statInfo}>
                    <h3 className={styles.statTitle}>Visualizações</h3>
                    <p className={styles.statValue}>{dashboardData.views}</p>
                  </div>
                </div>
              </div>
              
              <div className={styles.recentActivity}>
                <h2 className={styles.sectionTitle}>Atividade Recente</h2>
                
                <div className={styles.activityList}>
                  <div className={styles.activityItem}>
                    <div className={styles.activityIcon}>🛒</div>
                    <div className={styles.activityInfo}>
                      <h4 className={styles.activityTitle}>Novo Pedido #1234</h4>
                      <p className={styles.activityMeta}>Hoje às 14:25</p>
                    </div>
                    <div className={styles.activityStatus}>Novo</div>
                  </div>
                  
                  <div className={styles.activityItem}>
                    <div className={styles.activityIcon}>👤</div>
                    <div className={styles.activityInfo}>
                      <h4 className={styles.activityTitle}>Novo Assinante</h4>
                      <p className={styles.activityMeta}>Hoje às 11:52</p>
                    </div>
                    <div className={styles.activityStatus}>Novo</div>
                  </div>
                  
                  <div className={styles.activityItem}>
                    <div className={styles.activityIcon}>⭐</div>
                    <div className={styles.activityInfo}>
                      <h4 className={styles.activityTitle}>Nova Avaliação de 5 Estrelas</h4>
                      <p className={styles.activityMeta}>Ontem às 18:30</p>
                    </div>
                    <div className={styles.activityStatus}>Recente</div>
                  </div>
                  
                  <div className={styles.activityItem}>
                    <div className={styles.activityIcon}>💬</div>
                    <div className={styles.activityInfo}>
                      <h4 className={styles.activityTitle}>Novo Comentário</h4>
                      <p className={styles.activityMeta}>Ontem às 15:12</p>
                    </div>
                    <div className={styles.activityStatus}>Recente</div>
                  </div>
                </div>
              </div>
              
              <div className={styles.quickActions}>
                <h2 className={styles.sectionTitle}>Ações Rápidas</h2>
                
                <div className={styles.actionButtons}>
                  <button className={styles.actionButton} onClick={() => setActiveTab('products')}>
                    <span className={styles.actionIcon}>➕</span>
                    Adicionar Nova Caixa
                  </button>
                  
                  <button className={styles.actionButton} onClick={() => setActiveTab('orders')}>
                    <span className={styles.actionIcon}>📦</span>
                    Gerenciar Pedidos
                  </button>
                  
                  <button className={styles.actionButton} onClick={() => setActiveTab('settings')}>
                    <span className={styles.actionIcon}>🖌️</span>
                    Editar Perfil da Loja
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Products Tab - Placeholder for now */}
          {activeTab === 'products' && (
            <div className={styles.comingSoon}>
              <h2>Gerencie suas caixas de assinatura</h2>
              <p>Esta funcionalidade estará disponível em breve.</p>
              <div className={styles.placeholderBox}>
                <h3>Adicionar Nova Caixa</h3>
                <p>Clique para criar uma nova caixa de assinatura</p>
                <button className={styles.placeholderButton}>
                  <span>➕</span> Nova Caixa
                </button>
              </div>
            </div>
          )}
          
          {/* Orders Tab - Placeholder for now */}
          {activeTab === 'orders' && (
            <div className={styles.comingSoon}>
              <h2>Gerencie seus pedidos</h2>
              <p>Esta funcionalidade estará disponível em breve.</p>
              <div className={styles.placeholderTable}>
                <div className={styles.placeholderTableHeader}>
                  <div>ID do Pedido</div>
                  <div>Cliente</div>
                  <div>Valor</div>
                  <div>Status</div>
                  <div>Data</div>
                  <div>Ações</div>
                </div>
                <div className={styles.placeholderTableRow}>
                  <div>#1234</div>
                  <div>Cliente Exemplo</div>
                  <div>€29,90</div>
                  <div>Pendente</div>
                  <div>Hoje</div>
                  <div>
                    <button className={styles.smallButton}>Ver</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Other tabs - Placeholders */}
          {(activeTab === 'subscribers' || activeTab === 'analytics' || activeTab === 'settings') && (
            <div className={styles.comingSoon}>
              <h2>Funcionalidade em Desenvolvimento</h2>
              <p>Esta área está sendo implementada e estará disponível em breve.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 