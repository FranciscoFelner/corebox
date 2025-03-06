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

// Interface para dados do cartão
interface CardInfo {
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvv: string;
}

export default function SubscribePayment() {
  const router = useRouter();
  const { boxId, planId } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [addressData, setAddressData] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [cardInfo, setCardInfo] = useState<CardInfo>({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Verificar autenticação ao carregar a página
  useEffect(() => {
    // Verificar se o usuário está autenticado
    const token = localStorage.getItem('auth_token');
    const storedUserData = localStorage.getItem('user_data');
    
    if (!token || !storedUserData) {
      // Usuário não está autenticado, redirecionar para a página de conta
      router.push(`/subscribe/account?boxId=${boxId}&planId=${planId}`);
      return;
    }
    
    try {
      // Parse dos dados do usuário
      const parsedUserData = JSON.parse(storedUserData) as UserData;
      setUserData(parsedUserData);
      
      // Verificar se o endereço foi preenchido
      const savedAddress = localStorage.getItem(`address_${parsedUserData.id}`);
      if (!savedAddress) {
        // Endereço não foi preenchido, redirecionar para a página de endereço
        router.push(`/subscribe/address?boxId=${boxId}&planId=${planId}`);
        return;
      }
      
      setAddressData(JSON.parse(savedAddress));
      
      // Carregar dados de pagamento salvos, se existirem
      const savedPayment = localStorage.getItem(`payment_${parsedUserData.id}`);
      if (savedPayment) {
        const paymentData = JSON.parse(savedPayment);
        setPaymentMethod(paymentData.method || 'creditCard');
        if (paymentData.cardInfo) {
          setCardInfo(paymentData.cardInfo);
        }
      }
      
      setIsLoading(false);
    } catch (err) {
      // Erro ao processar dados do usuário
      console.error('Erro ao processar dados do usuário:', err);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      router.push(`/subscribe/account?boxId=${boxId}&planId=${planId}`);
    }
  }, [boxId, planId, router]);

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
    setError('');
  };

  const handleCardInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Formatação básica para número do cartão
    if (name === 'cardNumber') {
      // Remove tudo que não for dígito
      const digitsOnly = value.replace(/\D/g, '');
      // Limita a 16 dígitos
      const trimmed = digitsOnly.slice(0, 16);
      // Formata em grupos de 4
      const formatted = trimmed.replace(/(\d{4})(?=\d)/g, '$1 ');
      
      setCardInfo({
        ...cardInfo,
        [name]: formatted
      });
      return;
    }
    
    // Formatação para data de validade
    if (name === 'expiry') {
      // Remove tudo que não for dígito
      const digitsOnly = value.replace(/\D/g, '');
      // Limita a 4 dígitos
      const trimmed = digitsOnly.slice(0, 4);
      // Formata como MM/YY
      const formatted = trimmed.length > 2 ? 
        `${trimmed.slice(0, 2)}/${trimmed.slice(2)}` : 
        trimmed;
      
      setCardInfo({
        ...cardInfo,
        [name]: formatted
      });
      return;
    }
    
    // Formatação para CVV
    if (name === 'cvv') {
      // Remove tudo que não for dígito
      const digitsOnly = value.replace(/\D/g, '');
      // Limita a 3 ou 4 dígitos
      const trimmed = digitsOnly.slice(0, 4);
      
      setCardInfo({
        ...cardInfo,
        [name]: trimmed
      });
      return;
    }
    
    setCardInfo({
      ...cardInfo,
      [name]: value
    });
  };

  const validateForm = () => {
    if (paymentMethod === 'creditCard') {
      if (!cardInfo.cardNumber || cardInfo.cardNumber.replace(/\s/g, '').length < 16) {
        setError('Insira um número de cartão válido.');
        return false;
      }
      
      if (!cardInfo.cardName) {
        setError('Insira o nome como está no cartão.');
        return false;
      }
      
      if (!cardInfo.expiry || cardInfo.expiry.length < 5) {
        setError('Insira uma data de validade válida.');
        return false;
      }
      
      if (!cardInfo.cvv || cardInfo.cvv.length < 3) {
        setError('Insira um código de segurança válido.');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !userData) {
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Salvar dados de pagamento
      const paymentData = {
        method: paymentMethod,
        cardInfo: paymentMethod === 'creditCard' ? cardInfo : null
      };
      
      localStorage.setItem(`payment_${userData.id}`, JSON.stringify(paymentData));
      
      // Simular processamento do pagamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Criar registro da assinatura
      const subscriptionData = {
        id: `SUB${Date.now()}`,
        userId: userData.id,
        boxId,
        planId,
        address: addressData,
        payment: {
          method: paymentMethod,
          last4: paymentMethod === 'creditCard' ? cardInfo.cardNumber.slice(-4) : null
        },
        status: 'active',
        createdAt: new Date().toISOString(),
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // +30 dias
      };
      
      // Salvar a assinatura no localStorage
      const subscriptions = JSON.parse(localStorage.getItem('subscriptions') || '[]');
      subscriptions.push(subscriptionData);
      localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
      
      // Adicionar a assinatura ao usuário
      const userSubscriptions = JSON.parse(localStorage.getItem(`user_subscriptions_${userData.id}`) || '[]');
      userSubscriptions.push(subscriptionData.id);
      localStorage.setItem(`user_subscriptions_${userData.id}`, JSON.stringify(userSubscriptions));
      
      setIsComplete(true);
      
      // Redireciona para a página de confirmação após um breve atraso
      setTimeout(() => {
        router.push('/subscription-success');
      }, 1500);
    } catch (err) {
      console.error('Erro ao processar pagamento:', err);
      setError('Ocorreu um erro ao processar o pagamento. Por favor, tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Mostrar loader enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Carregando dados de pagamento...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Pagamento - CoreBox</title>
        <meta name="description" content="Configure seu método de pagamento para a assinatura." />
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
            <div className={`${styles.progressStep}`}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepLabel}>Revisar</div>
            </div>
            <div className={styles.progressLine}></div>
            <div className={`${styles.progressStep}`}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepLabel}>Conta</div>
            </div>
            <div className={styles.progressLine}></div>
            <div className={`${styles.progressStep}`}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepLabel}>Morada</div>
            </div>
            <div className={styles.progressLine}></div>
            <div className={`${styles.progressStep} ${styles.activeStep}`}>
              <div className={styles.stepNumber}>4</div>
              <div className={styles.stepLabel}>Pagamento</div>
            </div>
          </div>

          <div className={styles.paymentContainer}>
            <form className={styles.paymentForm} onSubmit={handleSubmit}>
              <h1 className={styles.formTitle}>Configurar Pagamento</h1>
              
              {error && <div className={styles.errorMessage}>{error}</div>}
              
              {isComplete ? (
                <div className={styles.successMessage}>
                  <div className={styles.successIcon}>✓</div>
                  <h2>Pagamento Confirmado!</h2>
                  <p>Sua assinatura foi processada com sucesso.</p>
                  <p>Você será redirecionado em instantes...</p>
                </div>
              ) : (
                <>
                  <div className={styles.paymentMethods}>
                    <h3>Método de Pagamento</h3>
                    
                    <div 
                      className={`${styles.paymentMethodOption} ${paymentMethod === 'creditCard' ? styles.selectedPaymentMethod : ''}`}
                      onClick={() => handlePaymentMethodChange('creditCard')}
                    >
                      <div className={styles.paymentMethodIcon}>💳</div>
                      <div className={styles.paymentMethodInfo}>
                        <div className={styles.paymentMethodName}>Cartão de Crédito</div>
                        <div className={styles.paymentMethodDescription}>Visa, Mastercard, American Express</div>
                      </div>
                    </div>
                    
                    <div 
                      className={`${styles.paymentMethodOption} ${paymentMethod === 'paypal' ? styles.selectedPaymentMethod : ''}`}
                      onClick={() => handlePaymentMethodChange('paypal')}
                    >
                      <div className={styles.paymentMethodIcon}>🅿️</div>
                      <div className={styles.paymentMethodInfo}>
                        <div className={styles.paymentMethodName}>PayPal</div>
                        <div className={styles.paymentMethodDescription}>Pagamento rápido e seguro</div>
                      </div>
                    </div>
                    
                    <div 
                      className={`${styles.paymentMethodOption} ${paymentMethod === 'mbway' ? styles.selectedPaymentMethod : ''}`}
                      onClick={() => handlePaymentMethodChange('mbway')}
                    >
                      <div className={styles.paymentMethodIcon}>📱</div>
                      <div className={styles.paymentMethodInfo}>
                        <div className={styles.paymentMethodName}>MB WAY</div>
                        <div className={styles.paymentMethodDescription}>Pagamento pelo telemóvel</div>
                      </div>
                    </div>
                  </div>
                  
                  {paymentMethod === 'creditCard' && (
                    <div className={styles.cardInfo}>
                      <h3>Informações do Cartão</h3>
                      
                      <div className={styles.formGroup}>
                        <label htmlFor="cardNumber">Número do Cartão</label>
                        <input
                          type="text"
                          id="cardNumber"
                          name="cardNumber"
                          value={cardInfo.cardNumber}
                          onChange={handleCardInfoChange}
                          className={styles.formInput}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          required
                        />
                      </div>
                      
                      <div className={styles.formGroup}>
                        <label htmlFor="cardName">Nome no Cartão</label>
                        <input
                          type="text"
                          id="cardName"
                          name="cardName"
                          value={cardInfo.cardName}
                          onChange={handleCardInfoChange}
                          className={styles.formInput}
                          placeholder="NOME COMO ESTÁ NO CARTÃO"
                          required
                        />
                      </div>
                      
                      <div className={styles.cardRow}>
                        <div className={styles.formGroup}>
                          <label htmlFor="expiry">Validade (MM/AA)</label>
                          <input
                            type="text"
                            id="expiry"
                            name="expiry"
                            value={cardInfo.expiry}
                            onChange={handleCardInfoChange}
                            className={styles.formInput}
                            placeholder="MM/AA"
                            maxLength={5}
                            required
                          />
                        </div>
                        
                        <div className={styles.formGroup}>
                          <label htmlFor="cvv">Código de Segurança</label>
                          <input
                            type="text"
                            id="cvv"
                            name="cvv"
                            value={cardInfo.cvv}
                            onChange={handleCardInfoChange}
                            className={styles.formInput}
                            placeholder="CVV"
                            maxLength={4}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {paymentMethod === 'paypal' && (
                    <div className={styles.alternativePayment}>
                      <p>Você será redirecionado para o PayPal para completar seu pagamento.</p>
                    </div>
                  )}
                  
                  {paymentMethod === 'mbway' && (
                    <div className={styles.alternativePayment}>
                      <p>Você receberá uma notificação no seu telemóvel para confirmar o pagamento.</p>
                      <div className={styles.formGroup}>
                        <label htmlFor="phoneNumber">Número de Telemóvel</label>
                        <input
                          type="tel"
                          id="phoneNumber"
                          className={styles.formInput}
                          placeholder="912345678"
                          required
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className={styles.formActions}>
                    <Link href={`/subscribe/address?boxId=${boxId}&planId=${planId}`}>
                      <button type="button" className={styles.backButton}>
                        Voltar
                      </button>
                    </Link>
                    <button 
                      type="submit" 
                      className={styles.continueButton}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processando...' : 'Finalizar Assinatura'}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2023 CoreBox. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
} 