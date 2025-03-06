import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/SubscriptionSuccess.module.css';

// Interface para dados do usuário
interface UserData {
  id: string;
  name: string;
  email: string;
}

export default function SubscriptionSuccess() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);

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

  return (
    <div className={styles.container}>
      <Head>
        <title>Assinatura Concluída - CoreBox</title>
        <meta name="description" content="Sua assinatura foi concluída com sucesso!" />
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
        <div className={styles.successCard}>
          <div className={styles.successIcon}>✓</div>
          <h1 className={styles.title}>Assinatura Concluída!</h1>
          
          <div className={styles.message}>
            <p>Parabéns! Sua assinatura foi realizada com sucesso.</p>
            <p>Você receberá um email de confirmação com os detalhes da sua assinatura.</p>
            <p>Sua primeira caixa será enviada nos próximos dias úteis.</p>
          </div>
          
          <div className={styles.orderNumber}>
            <p>Número do pedido: <span>CB{Math.floor(100000 + Math.random() * 900000)}</span></p>
          </div>
          
          <div className={styles.nextSteps}>
            <h2>Próximos Passos</h2>
            <ul>
              <li>Prepare-se para receber sua primeira caixa em até 5 dias úteis</li>
              <li>Você receberá atualizações por email sobre o envio da sua caixa</li>
              <li>Acesse sua conta a qualquer momento para gerenciar sua assinatura</li>
            </ul>
          </div>
          
          <div className={styles.buttons}>
            <Link href="/account/subscriptions">
              <button className={styles.primaryButton}>
                Gerenciar Assinatura
              </button>
            </Link>
            <Link href="/">
              <button className={styles.secondaryButton}>
                Voltar à Página Inicial
              </button>
            </Link>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2023 CoreBox. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
} 