import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../../styles/Subscribe.module.css';

// Interface para dados de login
interface LoginData {
  email: string;
  password: string;
}

// Interface para dados de registro
interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Interface para dados do usuário
interface UserData {
  id: string;
  name: string;
  email: string;
}

// Interface para usuário armazenado
interface StoredUser {
  id: string;
  name: string;
  email: string;
  password: string;
}

export default function SubscribeAccount() {
  const router = useRouter();
  const { boxId, planId } = router.query;
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userData, setUserData] = useState<UserData | null>(null);
  
  // Estado para formulário de login
  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: ''
  });
  
  // Estado para formulário de registro
  const [registerData, setRegisterData] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Checar se já está autenticado
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const storedUserData = localStorage.getItem('user_data');
    
    if (token && storedUserData) {
      // Usuário já está autenticado, verificar validade do token
      validateToken(token)
        .then(isValid => {
          if (isValid) {
            // Token válido, pular para a próxima etapa
            try {
              const parsedUserData = JSON.parse(storedUserData) as UserData;
              setUserData(parsedUserData);
              router.push(`/subscribe/address?boxId=${boxId}&planId=${planId}`);
            } catch (err) {
              console.error('Erro ao processar dados do usuário:', err);
              localStorage.removeItem('auth_token');
              localStorage.removeItem('user_data');
            }
          } else {
            // Token inválido, limpar os dados armazenados
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
          }
        });
    }
  }, [boxId, planId, router]);

  // Função para validar o token (simulada)
  const validateToken = async (token: string): Promise<boolean> => {
    // Em uma implementação real, você faria uma chamada para o backend
    // para validar o token
    
    try {
      // Simulando uma chamada de API com 500ms de atraso
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Para fins de demonstração, vamos assumir que o token é válido
      // se tiver pelo menos 10 caracteres
      return token.length >= 10;
    } catch (error) {
      console.error('Erro ao validar token:', error);
      return false;
    }
  };

  // Handlers para o formulário de login
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value
    });
  };

  // Handlers para o formulário de registro
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData({
      ...registerData,
      [name]: value
    });
  };

  // Validação do formulário de login
  const validateLoginForm = () => {
    if (!loginData.email) {
      setError('Por favor, digite seu email.');
      return false;
    }
    
    if (!loginData.password) {
      setError('Por favor, digite sua senha.');
      return false;
    }
    
    return true;
  };

  // Validação do formulário de registro
  const validateRegisterForm = () => {
    if (!registerData.name) {
      setError('Por favor, digite seu nome.');
      return false;
    }
    
    if (!registerData.email) {
      setError('Por favor, digite seu email.');
      return false;
    }
    
    if (!isValidEmail(registerData.email)) {
      setError('Por favor, digite um email válido.');
      return false;
    }
    
    if (!registerData.password) {
      setError('Por favor, digite uma senha.');
      return false;
    }
    
    if (registerData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return false;
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      setError('As senhas não coincidem.');
      return false;
    }
    
    return true;
  };

  // Função auxiliar para validar formato de email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handlers de submissão dos formulários
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateLoginForm()) {
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Simular chamada de API para login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Em uma implementação real, isto seria uma chamada para o backend
      // que retornaria um token de autenticação
      
      // Verificar credenciais (simulado)
      const users = JSON.parse(localStorage.getItem('users') || '[]') as StoredUser[];
      const user = users.find(u => u.email === loginData.email);
      
      if (!user || user.password !== loginData.password) {
        setError('Email ou senha incorretos.');
        setIsLoading(false);
        return;
      }
      
      // Login bem sucedido
      const generatedToken = generateToken();
      const userData: UserData = {
        id: user.id,
        name: user.name,
        email: user.email
      };
      
      // Armazenar informações de autenticação
      localStorage.setItem('auth_token', generatedToken);
      localStorage.setItem('user_data', JSON.stringify(userData));
      
      // Redirecionar para a próxima etapa
      setSuccess('Login realizado com sucesso!');
      setTimeout(() => {
        router.push(`/subscribe/address?boxId=${boxId}&planId=${planId}`);
      }, 1000);
      
    } catch (error) {
      console.error('Erro no login:', error);
      setError('Ocorreu um erro durante o login. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateRegisterForm()) {
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Simular chamada de API para registro
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Em uma implementação real, isto seria uma chamada para o backend
      // que criaria um novo usuário e retornaria um token de autenticação
      
      // Verificar se o email já está em uso
      const users = JSON.parse(localStorage.getItem('users') || '[]') as StoredUser[];
      if (users.some(u => u.email === registerData.email)) {
        setError('Este email já está em uso.');
        setIsLoading(false);
        return;
      }
      
      // Criar novo usuário
      const newUser: StoredUser = {
        id: Date.now().toString(),
        name: registerData.name,
        email: registerData.email,
        password: registerData.password // Em uma implementação real, a senha seria hashada
      };
      
      // Adicionar usuário à "base de dados" local
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Gerar token e armazenar informações de autenticação
      const generatedToken = generateToken();
      const userData: UserData = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      };
      
      localStorage.setItem('auth_token', generatedToken);
      localStorage.setItem('user_data', JSON.stringify(userData));
      
      // Redirecionar para a próxima etapa
      setSuccess('Conta criada com sucesso!');
      setTimeout(() => {
        router.push(`/subscribe/address?boxId=${boxId}&planId=${planId}`);
      }, 1000);
      
    } catch (error) {
      console.error('Erro no registro:', error);
      setError('Ocorreu um erro durante o registro. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Função auxiliar para gerar um token (simulado)
  const generateToken = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 32; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>{isLogin ? 'Entre na sua conta' : 'Crie sua conta'} - CoreBox</title>
        <meta name="description" content="Faça login ou crie uma conta para continuar sua assinatura." />
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
            <div className={`${styles.progressStep} ${styles.activeStep}`}>
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

          <div className={styles.accountContainer}>
            {/* Botões de alternância entre login e registro */}
            <div className={styles.formToggle}>
              <button 
                className={`${styles.toggleButton} ${isLogin ? styles.activeToggle : ''}`}
                onClick={() => {
                  setIsLogin(true);
                  setError('');
                }}
              >
                Entrar
              </button>
              <button 
                className={`${styles.toggleButton} ${!isLogin ? styles.activeToggle : ''}`}
                onClick={() => {
                  setIsLogin(false);
                  setError('');
                }}
              >
                Criar Conta
              </button>
            </div>

            {/* Mensagem de erro */}
            {error && <div className={styles.errorMessage}>{error}</div>}
            
            {/* Mensagem de sucesso */}
            {success && (
              <div className={styles.successMessage}>
                <div className={styles.successIcon}>✓</div>
                <p>{success}</p>
              </div>
            )}

            {/* Formulário de login */}
            {isLogin && !success && (
              <form className={styles.accountForm} onSubmit={handleLoginSubmit}>
                <h1 className={styles.formTitle}>Entre na sua conta</h1>
                
                <div className={styles.formGroup}>
                  <label htmlFor="login-email">Email</label>
                  <input
                    type="email"
                    id="login-email"
                    name="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    className={styles.formInput}
                    placeholder="seu.email@exemplo.com"
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="login-password">Senha</label>
                  <input
                    type="password"
                    id="login-password"
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    className={styles.formInput}
                    placeholder="Sua senha"
                    required
                  />
                </div>
                
                <div className={styles.forgotPassword}>
                  <span>Esqueceu sua senha?</span>
                </div>
                
                <button 
                  type="submit" 
                  className={styles.continueButton}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processando...' : 'Entrar'}
                </button>
                
                <div className={styles.toggleAccount}>
                  Não tem uma conta?{" "}
                  <button 
                    type="button" 
                    className={styles.toggleLink}
                    onClick={() => {
                      setIsLogin(false);
                      setError('');
                    }}
                  >
                    Criar agora
                  </button>
                </div>
              </form>
            )}

            {/* Formulário de registro */}
            {!isLogin && !success && (
              <form className={styles.accountForm} onSubmit={handleRegisterSubmit}>
                <h1 className={styles.formTitle}>Crie sua conta</h1>
                
                <div className={styles.formGroup}>
                  <label htmlFor="register-name">Nome completo</label>
                  <input
                    type="text"
                    id="register-name"
                    name="name"
                    value={registerData.name}
                    onChange={handleRegisterChange}
                    className={styles.formInput}
                    placeholder="Seu nome completo"
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="register-email">Email</label>
                  <input
                    type="email"
                    id="register-email"
                    name="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    className={styles.formInput}
                    placeholder="seu.email@exemplo.com"
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="register-password">Senha</label>
                  <input
                    type="password"
                    id="register-password"
                    name="password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    className={styles.formInput}
                    placeholder="Crie uma senha forte"
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="register-confirm-password">Confirmar senha</label>
                  <input
                    type="password"
                    id="register-confirm-password"
                    name="confirmPassword"
                    value={registerData.confirmPassword}
                    onChange={handleRegisterChange}
                    className={styles.formInput}
                    placeholder="Digite a senha novamente"
                    required
                  />
                </div>
                
                <button 
                  type="submit" 
                  className={styles.continueButton}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processando...' : 'Criar Conta'}
                </button>
                
                <div className={styles.toggleAccount}>
                  Já tem uma conta?{" "}
                  <button 
                    type="button" 
                    className={styles.toggleLink}
                    onClick={() => {
                      setIsLogin(true);
                      setError('');
                    }}
                  >
                    Entrar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2023 CoreBox. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
} 