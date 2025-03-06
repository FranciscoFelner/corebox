import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../../styles/Admin.module.css';

// Define seller interface
interface Seller {
  storeName: string;
  name: string;
  email: string;
  phone?: string;
  category: string;
  description?: string;
  createdAt?: string;
}

export default function AdminSellers() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminSecret, setAdminSecret] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthentication = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchSellers();
      setIsAuthenticated(true);
    } catch (error) {
      setError('Senha incorreta ou erro ao carregar dados');
    }
  };

  const fetchSellers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/sellers?secret=${adminSecret}`);
      
      if (!response.ok) {
        throw new Error('Falha ao carregar dados');
      }
      
      const data = await response.json();
      setSellers(data.sellers);
      setLoading(false);
    } catch (error) {
      setError('Erro ao carregar dados de vendedores');
      setLoading(false);
      throw error;
    }
  };

  // Formata a data para exibição
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Admin - Cadastros de Vendedores</title>
        <meta name="description" content="Área administrativa CoreBox" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Administração de Vendedores</h1>

        {!isAuthenticated ? (
          <div className={styles.authForm}>
            <p>Digite a senha de administrador para continuar:</p>
            <form onSubmit={handleAuthentication}>
              <input 
                type="password" 
                value={adminSecret}
                onChange={(e) => setAdminSecret(e.target.value)}
                placeholder="Senha de admin"
                required
              />
              <button type="submit">Acessar</button>
            </form>
            {error && <p className={styles.errorMessage}>{error}</p>}
          </div>
        ) : (
          <>
            <p className={styles.description}>
              Visualize todos os cadastros de vendedores
            </p>

            {loading ? (
              <div className={styles.loading}>Carregando...</div>
            ) : sellers.length > 0 ? (
              <div className={styles.grid}>
                {sellers.map((seller, index) => (
                  <div key={index} className={styles.card}>
                    <h2>{seller.storeName}</h2>
                    <p><strong>Nome:</strong> {seller.name}</p>
                    <p><strong>Email:</strong> {seller.email}</p>
                    <p><strong>Telefone:</strong> {seller.phone || 'Não informado'}</p>
                    <p><strong>Categoria:</strong> {seller.category}</p>
                    <p><strong>Descrição:</strong> {seller.description || 'Não informada'}</p>
                    <p className={styles.date}>
                      <strong>Data de cadastro:</strong> {seller.createdAt ? formatDate(seller.createdAt) : 'Data não disponível'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.noData}>Nenhum vendedor cadastrado até o momento.</p>
            )}
          </>
        )}
      </main>
    </div>
  );
} 