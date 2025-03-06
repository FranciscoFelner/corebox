import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../../styles/Subscribe.module.css';

// Interface para dados do usuário
interface UserData {
  id: string;
  name: string;
  email: string;
}

// Interface para dados da caixa
interface BoxDetails {
  id: string;
  name: string;
  basePrice: number;
  image: string;
}

// Interface para planos de assinatura
interface Plan {
  id: string;
  label: string;
  months: number;
  discount: number;
  popular?: boolean;
}

export default function Subscribe() {
  const router = useRouter();
  const { boxId, planId } = router.query;
  const [step, setStep] = useState(1);
  const [boxDetails, setBoxDetails] = useState<BoxDetails | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  // Em um ambiente real, isto seria uma chamada de API
  useEffect(() => {
    if (boxId) {
      // Simular busca do box por ID
      const mockBoxData: Record<string, BoxDetails> = {
        'tech': {
          id: 'tech',
          name: 'Caixa de Tecnologia',
          basePrice: 39.90,
          image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
        },
        'gourmet': {
          id: 'gourmet',
          name: 'Caixa Gourmet',
          basePrice: 29.90,
          image: 'https://images.unsplash.com/photo-1606914907313-3fde0444dd43?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
        }
      };
      
      const boxIdString = boxId as string;
      if (mockBoxData[boxIdString]) {
        setBoxDetails(mockBoxData[boxIdString]);
      }
    }
  }, [boxId]);

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

  // Planos disponíveis
  const plans: Plan[] = [
    { id: 'monthly', label: 'Mensal', months: 1, discount: 0 },
    { id: 'quarterly', label: 'Trimestral', months: 3, discount: 0, popular: true },
    { id: 'semiannual', label: 'Semestral', months: 6, discount: 0 },
    { id: 'annual', label: 'Anual', months: 12, discount: 0 }
  ];

  // Calcula o preço com desconto
  const calculatePrice = (basePrice: number, discount: number): string => {
    return (basePrice * (100 - discount) / 100).toFixed(2).replace('.', ',');
  };

  // Próxima etapa do processo
  const handleNext = () => {
    if (step === 1) {
      router.push(`/subscribe/account?boxId=${boxId}&planId=${planId}`);
    }
  };

  if (!boxDetails) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  // Obter detalhes do plano selecionado
  const selectedPlan = plans.find(p => p.id === planId) || plans[0];

  return (
    <div className={styles.container}>
      <Head>
        <title>Assinar {boxDetails.name} - CoreBox</title>
        <meta name="description" content={`Assine a ${boxDetails.name} e receba produtos incríveis mensalmente.`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Barra de navegação superior */}
      <div className={styles.topNav}>
        <Link href="/">
          <span className={styles.topNavLogo}>CoreBox</span>
        </Link>
        <div className={styles.topNavLinks}>
          <Link href="/boxes">
            <span className={styles.topNavLink}>Caixas</span>
          </Link>
          <Link href="/become-a-seller">
            <span className={styles.topNavLink}>Torne-se um Vendedor</span>
          </Link>
        </div>
      </div>

      <main className={styles.main}>
        <div className={styles.checkoutContainer}>
          {/* Progresso da assinatura */}
          <div className={styles.progress}>
            <div className={`${styles.progressStep} ${styles.activeStep}`}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepLabel}>Revisar</div>
            </div>
            <div className={styles.progressLine}></div>
            <div className={styles.progressStep}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepLabel}>Conta</div>
            </div>
            <div className={styles.progressLine}></div>
            <div className={styles.progressStep}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepLabel}>Morada</div>
            </div>
            <div className={styles.progressLine}></div>
            <div className={styles.progressStep}>
              <div className={styles.stepNumber}>4</div>
              <div className={styles.stepLabel}>Pagamento</div>
            </div>
          </div>

          <div className={styles.checkoutContent}>
            <div className={styles.checkoutLeft}>
              <h1 className={styles.checkoutTitle}>Revisar sua assinatura</h1>
              
              <div className={styles.boxReview}>
                <img src={boxDetails.image} alt={boxDetails.name} className={styles.boxImage} />
                <div className={styles.boxInfo}>
                  <h2>{boxDetails.name}</h2>
                  <p className={styles.planInfo}>
                    Plano {selectedPlan.label} - {selectedPlan.months} {selectedPlan.months === 1 ? 'mês' : 'meses'}
                  </p>
                  <p className={styles.price}>
                    {calculatePrice(boxDetails.basePrice, selectedPlan.discount)}€
                    <span className={styles.perMonth}> por caixa</span>
                  </p>
                </div>
              </div>
              
              <button 
                className={styles.continueButton}
                onClick={handleNext}
              >
                Continuar
              </button>
            </div>
            
            <div className={styles.checkoutRight}>
              <div className={styles.orderSummary}>
                <h3 className={styles.summaryTitle}>Resumo do pedido</h3>
                
                <div className={styles.summaryRow}>
                  <span>Subtotal</span>
                  <span>{boxDetails.basePrice.toFixed(2).replace('.', ',')}€</span>
                </div>
                
                {selectedPlan.discount > 0 && (
                  <div className={styles.summaryRow}>
                    <span>Desconto do plano</span>
                    <span>-{(boxDetails.basePrice * selectedPlan.discount / 100).toFixed(2).replace('.', ',')}€</span>
                  </div>
                )}
                
                <div className={styles.summaryRow}>
                  <span>Frete</span>
                  <span>Grátis</span>
                </div>
                
                <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                  <span>Total mensal</span>
                  <span>{calculatePrice(boxDetails.basePrice, selectedPlan.discount)}€</span>
                </div>
                
                <div className={styles.secureCheckout}>
                  <p>✓ Pagamento seguro</p>
                  <p>✓ Envio imediato da primeira caixa</p>
                  <p>✓ Cancele a qualquer momento</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2023 CoreBox. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
} 