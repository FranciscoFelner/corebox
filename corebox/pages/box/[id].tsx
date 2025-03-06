import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../../styles/BoxDetail.module.css';

// Interface para dados do usuário
interface UserData {
  id: string;
  name: string;
  email: string;
}

// Dados mockados - em um ambiente real, estes viriam de uma API/banco de dados
const boxesData: {[key: string]: any} = {
  'tech': {
    id: 'tech',
    name: 'Caixa de Tecnologia',
    description: 'Receba os mais recentes gadgets tech todo mês em uma seleção especial feita por especialistas.',
    longDescription: 'A cada mês, nossa equipe de especialistas em tecnologia seleciona os gadgets, acessórios e produtos tech mais inovadores do mercado. Desde dispositivos inteligentes até acessórios exclusivos que você não encontraria facilmente. Perfeito para entusiastas de tecnologia e early adopters!',
    basePrice: 39.90,
    images: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
      'https://images.unsplash.com/photo-1588508065123-287b28e013da?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
      'https://images.unsplash.com/photo-1563770660941-20978e870e26?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80'
    ],
    rating: 4.7,
    reviews: 218,
    producerInfo: 'A TechSelect é uma empresa especializada em curadoria de produtos tecnológicos, fundada em 2020 por um grupo de entusiastas de tecnologia. Com sede em Lisboa, a empresa trabalha com parceiros em todo o mundo para identificar e selecionar os mais interessantes e úteis gadgets e dispositivos tecnológicos. A equipe é composta por especialistas que testam rigorosamente cada produto antes de incluí-lo nas caixas mensais.',
    stock: 'Em Estoque',
    shipping: 'Frete Grátis',
    items: [
      'Gadgets inovadores',
      'Acessórios para dispositivos',
      'Produtos de tecnologia emergente',
      'Itens exclusivos de edição limitada',
      'Guia mensal de tecnologia'
    ],
    features: [
      'Curadoria especializada',
      'Produtos de alto valor',
      'Garantia de satisfação',
      'Suporte técnico para produtos'
    ],
    previousBoxes: [
      {
        month: 'Abril 2023',
        highlight: 'Mini projetor portátil HD'
      },
      {
        month: 'Maio 2023',
        highlight: 'Fones de ouvido com cancelamento de ruído'
      },
      {
        month: 'Junho 2023',
        highlight: 'Carregador sem fio multifuncional'
      }
    ]
  },
  'gourmet': {
    id: 'gourmet',
    name: 'Caixa Gourmet',
    description: 'Produtos gourmet selecionados para você, desde iguarias até especiarias de todo o mundo.',
    longDescription: 'Uma experiência gastronômica completa entregue mensalmente em sua casa. Nossa equipe viaja pelo mundo para descobrir os melhores produtos artesanais, especiarias raras e ingredientes premium que trarão sabores únicos à sua cozinha.',
    basePrice: 29.90,
    images: [
      'https://cdn.shopify.com/s/files/1/0680/1463/7353/files/QJNElp6XTAW8IiGHimmf.jpg?v=1728148977',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbeJnv0JxpsZn0xPJ6FNWIp2ZzpaaZgdZvkQ&s',
    ],
    rating: 4.9,
    reviews: 342,
    producerInfo: 'A Sabores do Mundo é uma empresa familiar fundada em 2018 por chefs e entusiastas da gastronomia. Com base no Porto, a empresa colabora com pequenos produtores artesanais em toda a Europa, América Latina e Ásia. Todos os produtos são cuidadosamente selecionados com foco na sustentabilidade, autenticidade e qualidade excepcional. A empresa prioriza relacionamentos de comércio justo e produtos orgânicos sempre que possível.',
    stock: 'Estoque Baixo',
    shipping: 'Frete Grátis',
    items: [
      'Especiarias exclusivas',
      'Azeites e vinagres gourmet',
      'Snacks artesanais',
      'Ingredientes importados',
      'Receitas exclusivas do chef'
    ],
    features: [
      'Produtos de produtores artesanais',
      'Seleção internacional',
      'Garantia de frescor',
      'Dicas de harmonização'
    ],
    previousBoxes: [
      {
        month: 'Abril 2023',
        highlight: 'Trufas italianas e azeite premium'
      },
      {
        month: 'Maio 2023',
        highlight: 'Seleção de temperos marroquinos'
      },
      {
        month: 'Junho 2023',
        highlight: 'Molhos gourmet e pastas artesanais'
      }
    ]
  }
};

export default function BoxDetail() {
  const router = useRouter();
  const { id } = router.query;
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState('3');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState('description');
  
  // Verificar se o usuário está autenticado
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const storedUserData = localStorage.getItem('user_data');
    
    if (token && storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData) as UserData;
        setUserData(parsedUserData);
      } catch (err) {
        console.error('Erro ao processar dados do usuário:', err);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    }
  }, []);

  // Handler para logout
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    router.push('/');
  };
  
  // Se o ID ainda não estiver disponível ou se o box não existir
  if (!id || !boxesData[id as string]) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Carregando detalhes da caixa...</div>
      </div>
    );
  }

  const box = boxesData[id as string];
  
  const plans = [
    { id: 'biweekly', frequency: 'Bisemanal', discount: 0, label: 'Bisemanal' },
    { id: 'monthly', frequency: 'Mensal', discount: 0, label: 'Mensal' },
    { id: 'bimonthly', frequency: 'Bimestral', discount: 0, label: 'Bimestral' },
    { id: 'quarterly', frequency: 'Trimestral', discount: 0, label: 'Trimestral' }
  ];
  
  const calculatePrice = (basePrice: number, discount: number): string => {
    const discountedPrice = basePrice * (1 - discount/100);
    return discountedPrice.toFixed(2).replace('.', ',');
  };
  
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === box.images.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? box.images.length - 1 : prevIndex - 1
    );
  };
  
  const handleImageSelect = (index: number) => {
    setCurrentImageIndex(index);
  };
  
  const handleCheckout = () => {
    // Redirecionar para o fluxo de subscrição
    router.push(`/subscribe?boxId=${box.id}&planId=${selectedPlan}`);
  };

  // Handler para mudar de aba
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>{box.name} - CoreBox</title>
        <meta name="description" content={box.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Nova barra de navegação superior */}
      <div className={styles.topNav}>
        <Link href="/">
          <span className={styles.topNavLogo}>CoreBox</span>
        </Link>
        <div className={styles.topNavLinks}>
          <Link href="/boxes">
            <span className={styles.topNavLink}>
              <span className={styles.topNavIcon}>🎁</span> Caixas
            </span>
          </Link>
          <Link href="/become-a-seller">
            <span className={styles.topNavLink}>
              <span className={styles.topNavIcon}>💼</span> Torne-se um Vendedor
            </span>
          </Link>
          <Link href="/seller/login">
            <span className={styles.topNavLink}>
              <span className={styles.topNavIcon}>🔑</span> Portal do Vendedor
            </span>
          </Link>
          {userData && (
            <>
              <span className={styles.topNavLink}>
                Olá, {userData.name.split(' ')[0]}
              </span>
              <span 
                className={`${styles.topNavLink} ${styles.logoutButton}`}
                onClick={handleLogout}
              >
                Sair
              </span>
            </>
          )}
        </div>
      </div>

      <main className={styles.main}>
        <div className={styles.breadcrumb}>
          <Link href="/">Início</Link> / <Link href="/boxes">Caixas</Link> / {box.name}
        </div>
        
        <div className={styles.productSection}>
          {/* Carrossel de imagens à esquerda */}
          <div className={styles.imageColumn}>
            <div className={styles.mainImageContainer}>
              <button 
                className={`${styles.carouselButton} ${styles.prevButton}`}
                onClick={handlePrevImage}
              >
                &#10094;
              </button>
              <img 
                src={box.images[currentImageIndex]} 
                alt={box.name} 
                className={styles.mainImage}
              />
              <button 
                className={`${styles.carouselButton} ${styles.nextButton}`}
                onClick={handleNextImage}
              >
                &#10095;
              </button>
            </div>
            
            <div className={styles.thumbnailContainer}>
              {box.images.map((image: string, index: number) => (
                <div 
                  key={index} 
                  className={`${styles.thumbnail} ${currentImageIndex === index ? styles.activeThumbnail : ''}`}
                  onClick={() => handleImageSelect(index)}
                >
                  <img src={image} alt={`${box.name} - imagem ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
          
          {/* Coluna de informações e compra à direita */}
          <div className={styles.infoColumn}>
            <h1 className={styles.productTitle}>{box.name}</h1>
            
            <div className={styles.productMeta}>
              <div className={styles.rating}>
                {'★'.repeat(Math.floor(box.rating))}
                {'☆'.repeat(5 - Math.floor(box.rating))}
                <span>{box.rating}</span>
                <span className={styles.reviewCount}>{box.reviews} avaliações</span>
              </div>
            </div>
            
            <p className={styles.productDescription}>{box.description}</p>
            
            <div className={styles.subscriptionOptions}>
              <h3 className={styles.priceDisplay}>{box.basePrice.toFixed(2).replace('.', ',')}€</h3>
              
              <h3>Escolha a frequência</h3>
              
              <div className={styles.planOptions}>
                {plans.map(plan => (
                  <div 
                    key={plan.id}
                    className={`${styles.planOption} ${selectedPlan === plan.id ? styles.selectedPlan : ''}`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    <div className={styles.planDetails}>
                      <span className={styles.planName}>{plan.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              className={styles.addToCartButton}
              onClick={handleCheckout}
            >
              Assinar Agora
            </button>
            
            <div className={styles.secureCheckout}>
              <span>✓ Pagamento seguro</span>
              <span>✓ Envio imediato da primeira caixa</span>
              <span>✓ Cancele a qualquer momento</span>
            </div>
          </div>
        </div>
        
        {/* Descrição detalhada e mais informações do produto */}
        <div className={styles.productDetails}>
          <div className={styles.tabs}>
            <div 
              className={activeTab === 'description' ? styles.tabActive : ''} 
              onClick={() => handleTabChange('description')}
            >
              Descrição
            </div>
            <div 
              className={activeTab === 'producer' ? styles.tabActive : ''} 
              onClick={() => handleTabChange('producer')}
            >
              Conheça o Produtor
            </div>
          </div>
          
          {activeTab === 'description' && (
            <div className={styles.tabContent}>
              <h2>Sobre a {box.name}</h2>
              <p>{box.longDescription}</p>
              
              <h3>Características</h3>
              <ul className={styles.itemsList}>
                {box.features.map((feature: string, index: number) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              
              <h3>O que você receberá em sua caixa</h3>
              <ul className={styles.itemsList}>
                {box.items.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              
              <p className={styles.disclaimer}>
                * Os itens podem variar de acordo com a disponibilidade do mês. Garantimos sempre o mesmo alto padrão de qualidade.
              </p>
            </div>
          )}
          
          {activeTab === 'producer' && (
            <div className={styles.tabContent}>
              <h2>Sobre o Produtor</h2>
              <p>{box.producerInfo}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 