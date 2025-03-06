import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../../styles/SellerAuth.module.css';

export default function SellerLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // In a real application, you would make an API call to authenticate the seller
      // For now, we'll simulate a successful login if the email contains "@" and password is not empty
      if (email.includes('@') && password.length > 0) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Store seller session data
        const sellerData = {
          id: '123456',
          email: email,
          storeName: 'Loja ' + email.split('@')[0],
          name: email.split('@')[0]
        };
        
        // Save to localStorage for session persistence
        localStorage.setItem('sellerData', JSON.stringify(sellerData));
        
        // Redirect to seller dashboard
        router.push('/seller/dashboard');
      } else {
        throw new Error('Email ou senha inválidos');
      }
    } catch (err: any) {
      setError(err.message || 'Falha ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Portal do Vendedor - CoreBox</title>
        <meta name="description" content="Acesse sua conta de vendedor na CoreBox" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.authCard}>
          <div className={styles.logoIcon}>🛍️</div>
          <Link href="/">
            <span className={styles.logo}>CoreBox</span>
          </Link>
          
          <h1 className={styles.title}>Portal do Vendedor</h1>
          <p className={styles.authDescription}>
            Acesse sua conta para gerenciar suas caixas, assinantes e vendas.
          </p>
          
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="password">Senha</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                required
              />
            </div>
            
            <Link href="/seller/forgot-password">
              <span className={styles.forgotPassword}>Esqueceu a senha?</span>
            </Link>
            
            {error && <div className={styles.errorMessage}>{error}</div>}
            
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
          
          <div className={styles.authFooter}>
            <p>Ainda não tem uma conta?</p>
            <Link href="/become-a-seller">
              <span className={styles.authLink}>Cadastre-se como vendedor</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
} 