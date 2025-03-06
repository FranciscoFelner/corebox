import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Layout.module.css';

// Interface para dados do usuário
interface UserData {
  id: string;
  name: string;
  email: string;
}

export default function App({ Component, pageProps }: AppProps) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showNotification, setShowNotification] = useState(true);
  const router = useRouter();

  // Verificar se o usuário está autenticado
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        setUserData(JSON.parse(storedUserData));
      } catch (e) {
        console.error('Error parsing user data:', e);
        localStorage.removeItem('userData');
      }
    }
  }, []);

  // Handler para logout
  const handleLogout = () => {
    localStorage.removeItem('userData');
    setUserData(null);
    router.push('/');
  };

  // Componente de notificação de protótipo
  const PrototypeNotification = () => {
    if (!showNotification) return null;
    
    return (
      <div className={styles.prototypeNotification}>
        <span className={styles.infoIcon}>ℹ️</span>
        <p>Este site é apenas um protótipo para demonstração</p>
        <button 
          className={styles.closeButton}
          onClick={() => setShowNotification(false)}
        >
          ×
        </button>
      </div>
    );
  };
  
  return (
    <>
      <Component {...pageProps} userData={userData} handleLogout={handleLogout} />
      <PrototypeNotification />
    </>
  );
} 