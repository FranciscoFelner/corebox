import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/BecomeASeller.module.css';
import { useState } from 'react';

export default function BecomeASeller() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    const formData = new FormData(e.target as HTMLFormElement);
    const formValues = Object.fromEntries(formData.entries());
    
    try {
      // Enviar dados para nossa API
      const response = await fetch('/api/sellers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSubmitSuccess(true);
        (e.target as HTMLFormElement).reset();
      } else {
        throw new Error(data.message || 'Ocorreu um erro ao enviar o formulário');
      }
    } catch (error: unknown) {
      console.error('Erro ao enviar formulário:', error);
      setSubmitError(error instanceof Error ? error.message : 'Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Torne-se um Vendedor - CoreBox</title>
        <meta name="description" content="Comece a vender suas caixas de assinatura na CoreBox" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Top navigation bar */}
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
        </div>
      </div>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>Torne-se um Vendedor</h1>
            <p className={styles.subtitle}>
              Transforme sua paixão em negócio. Venda suas caixas de assinatura para milhares de clientes.
            </p>
            <div className={styles.heroButtons}>
              <a href="#form" className={styles.ctaButton}>Comece Agora</a>
              <Link href="/seller/login">
                <span className={styles.secondaryButton}>Portal do Vendedor</span>
              </Link>
            </div>
          </div>
          <div className={styles.heroImage}>
            <img 
              src="https://images.unsplash.com/photo-1579208570378-8c970854bc23?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2335&q=80" 
              alt="Empreendedor preparando caixas de assinatura" 
            />
          </div>
        </section>

        <section className={styles.benefits}>
          <h2>Por que vender na CoreBox?</h2>
          
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3>Visibilidade no Mercado</h3>
              <p>Alcance milhares de clientes em busca de novas assinaturas.</p>
            </div>
            
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3>Gestão Simplificada</h3>
              <p>Ferramentas para pagamentos, envios e feedback centralizados.</p>
            </div>
            
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3>Análises e Crescimento</h3>
              <p>Dados e insights para otimizar vendas e estratégias.</p>
            </div>
            
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
              <h3>Modelo Baseado em Comissões</h3>
              <p>Sem custos fixos, você só paga quando vende.</p>
            </div>
          </div>
        </section>
        
        <section className={styles.howItWorks}>
          <h2>Como Funciona</h2>
          
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <h3>Cadastre-se como Vendedor</h3>
              <p>Preencha o formulário e envie seus documentos. Aprovação em até 48 horas.</p>
            </div>
            
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <h3>Configure sua Loja</h3>
              <p>Personalize o perfil da sua loja, logo, banner e descrição da sua marca.</p>
            </div>
            
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <h3>Crie suas Caixas</h3>
              <p>Crie caixas de assinatura com fotos, descrições e preços atrativos.</p>
            </div>
            
            <div className={styles.step}>
              <div className={styles.stepNumber}>4</div>
              <h3>Prepare e Envie</h3>
              <p>Receba pedidos, prepare suas caixas personalizadas e envie aos clientes.</p>
            </div>
          </div>
        </section>
        
        <section id="form" className={styles.formSection}>
          <h2>Comece a Vender Hoje</h2>
          <p className={styles.formIntro}>Preencha o formulário abaixo para se tornar um vendedor na CoreBox.</p>
          
          <form className={styles.sellerForm} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Nome Completo</label>
              <input type="text" id="name" name="name" placeholder="Seu nome completo" required />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" placeholder="seu@email.com" required />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="phone">Telefone</label>
              <input type="tel" id="phone" name="phone" placeholder="(00) 00000-0000" />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="storeName">Nome da Loja</label>
              <input type="text" id="storeName" name="storeName" placeholder="Nome da sua loja" required />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="description">Descreva suas Caixas</label>
              <textarea id="description" name="description" placeholder="Conte-nos um pouco sobre as caixas que pretende vender..." rows={4}></textarea>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" name="terms" required />
                <span>Concordo com os <a href="#" className={styles.link}>Termos e Condições</a> e <a href="#" className={styles.link}>Política de Privacidade</a></span>
              </label>
            </div>
            
            {submitSuccess && (
              <div className={styles.successMessage}>
                Cadastro enviado com sucesso! Entraremos em contato em breve.
              </div>
            )}
            
            {submitError && (
              <div className={styles.errorMessage}>
                {submitError}
              </div>
            )}
            
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Cadastro'}
            </button>
          </form>
        </section>
        
        <section className={styles.testimonials}>
          <h2>O que Nossos Vendedores Dizem</h2>
          
          <div className={styles.testimonialGrid}>
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialText}>
                <p>"A CoreBox transformou meu pequeno negócio de caixas artesanais em uma empresa de sucesso. Em apenas 6 meses, consegui mais de 500 assinantes mensais."</p>
              </div>
              <div className={styles.testimonialAuthor}>
                <img src="https://randomuser.me/api/portraits/women/42.jpg" alt="Ana Silva" />
                <div>
                  <h4>Ana Silva</h4>
                  <p>ArtBox</p>
                </div>
              </div>
            </div>
            
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialText}>
                <p>"A plataforma facilita todo o processo, desde cadastrar produtos até gerenciar assinaturas. O suporte é excelente e os pagamentos são sempre pontuais."</p>
              </div>
              <div className={styles.testimonialAuthor}>
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Carlos Mendes" />
                <div>
                  <h4>Carlos Mendes</h4>
                  <p>TechBox Premium</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className={styles.faq}>
          <h2>Perguntas Frequentes</h2>
          
          <div className={styles.faqItem}>
            <h3>Quanto custa para vender na CoreBox?</h3>
            <p>Não há taxa de inscrição. Cobramos apenas 15% de comissão sobre cada assinatura vendida, já incluindo as taxas de processamento de pagamento.</p>
          </div>
          
          <div className={styles.faqItem}>
            <h3>Como os pagamentos são processados?</h3>
            <p>Os pagamentos são processados automaticamente e transferidos para sua conta bancária em até 7 dias após a confirmação da entrega da caixa ao cliente.</p>
          </div>
          
          <div className={styles.faqItem}>
            <h3>Quem cuida da logística de envio?</h3>
            <p>Você é responsável pelo envio das caixas, mas oferecemos integrações com diversas transportadoras para facilitar o processo e reduzir custos.</p>
          </div>
          
          <div className={styles.faqItem}>
            <h3>Quanto tempo leva para minha loja ser aprovada?</h3>
            <p>O processo de aprovação geralmente leva até 48 horas úteis após o envio de todos os documentos necessários.</p>
          </div>
        </section>
      </main>
    </div>
  );
} 