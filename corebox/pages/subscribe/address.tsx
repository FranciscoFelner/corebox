import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../../styles/Subscribe.module.css';

// Definindo a interface para o tipo de dados do formulário
interface FormData {
  fullName: string;
  address: string;
  addressComplement: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  [key: string]: string; // Assinatura de índice para permitir acesso dinâmico
}

// Interface para dados do usuário
interface UserData {
  id: string;
  name: string;
  email: string;
}

export default function SubscribeAddress() {
  const router = useRouter();
  const { boxId, planId } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    address: '',
    addressComplement: '',
    city: '',
    state: '',
    postalCode: '',
    phone: ''
  });
  const [error, setError] = useState('');

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
      
      // Pré-preencher o nome se disponível
      if (parsedUserData.name) {
        setFormData(prev => ({
          ...prev,
          fullName: parsedUserData.name
        }));
      }
      
      // Carregar dados de endereço salvos, se existirem
      const savedAddress = localStorage.getItem(`address_${parsedUserData.id}`);
      if (savedAddress) {
        setFormData(JSON.parse(savedAddress));
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const requiredFields = ['fullName', 'address', 'city', 'state', 'postalCode', 'phone'];
    
    for (const field of requiredFields) {
      if (!formData[field]) {
        setError(`Por favor, preencha o campo ${getFieldLabel(field)}.`);
        return false;
      }
    }

    // Validação básica de CEP
    if (!/^\d{4}-\d{3}$/.test(formData.postalCode)) {
      setError('Código Postal inválido. Use o formato 1234-123.');
      return false;
    }

    // Validação básica de telefone
    if (!/^\d{9}$/.test(formData.phone.replace(/\s+/g, ''))) {
      setError('Número de telefone inválido. Digite apenas os 9 dígitos.');
      return false;
    }

    return true;
  };

  const getFieldLabel = (field: string): string => {
    const labels: {[key: string]: string} = {
      fullName: 'Nome completo',
      address: 'Endereço',
      addressComplement: 'Complemento',
      city: 'Cidade',
      state: 'Estado/Província',
      postalCode: 'Código Postal',
      phone: 'Telefone'
    };
    return labels[field] || field;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !userData) {
      return;
    }

    // Salvar endereço no localStorage para uso futuro
    localStorage.setItem(`address_${userData.id}`, JSON.stringify(formData));
    
    // Em um ambiente real, aqui teria a chamada para a API para salvar o endereço
    console.log('Endereço enviado:', formData);
    
    // Redireciona para a próxima etapa - pagamento
    router.push(`/subscribe/payment?boxId=${boxId}&planId=${planId}`);
  };

  // Mostrar loader enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Verificando informações da conta...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Endereço de Envio - CoreBox</title>
        <meta name="description" content="Informe seu endereço para receber sua caixa de assinatura." />
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
            <div className={`${styles.progressStep} ${styles.activeStep}`}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepLabel}>Morada</div>
            </div>
            <div className={styles.progressLine}></div>
            <div className={styles.progressStep}>
              <div className={styles.stepNumber}>4</div>
              <div className={styles.stepLabel}>Pagamento</div>
            </div>
          </div>

          <div className={styles.addressContainer}>
            <form className={styles.addressForm} onSubmit={handleSubmit}>
              <h1 className={styles.formTitle}>Endereço de Envio</h1>
              
              {error && <div className={styles.errorMessage}>{error}</div>}

              <div className={styles.formGroup}>
                <label htmlFor="fullName">Nome completo</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={styles.formInput}
                  placeholder="Nome completo de quem irá receber"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="address">Endereço</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={styles.formInput}
                  placeholder="Rua, Número"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="addressComplement">Complemento (opcional)</label>
                <input
                  type="text"
                  id="addressComplement"
                  name="addressComplement"
                  value={formData.addressComplement}
                  onChange={handleChange}
                  className={styles.formInput}
                  placeholder="Apartamento, bloco, andar, etc."
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="city">Cidade</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={styles.formInput}
                    placeholder="Sua cidade"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="state">Estado/Província</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={styles.formInput}
                    placeholder="Seu estado"
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="postalCode">Código Postal</label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className={styles.formInput}
                    placeholder="1234-123"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone">Telefone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={styles.formInput}
                    placeholder="912345678"
                    required
                  />
                </div>
              </div>

              <div className={styles.formActions}>
                <Link href={`/subscribe/account?boxId=${boxId}&planId=${planId}`}>
                  <button type="button" className={styles.backButton}>
                    Voltar
                  </button>
                </Link>
                <button type="submit" className={styles.continueButton}>
                  Continuar
                </button>
              </div>
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