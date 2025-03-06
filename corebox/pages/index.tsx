import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>CoreBox - Marketplace de Caixas de Assinatura</title>
        <meta name="description" content="CoreBox - Encontre e assine as melhores caixas de assinatura" />
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
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>
              Descubra surpresas <span className={styles.highlight}>todo mês</span> na sua porta
            </h1>
            <p className={styles.subtitle}>
              O CoreBox reúne as melhores caixas de assinatura em um só lugar. Explore, escolha e receba produtos incríveis mensalmente!
            </p>
            <div className={styles.ctaContainer}>
              <Link href="/boxes">
                <span className={styles.ctaButton}>Ver Caixas</span>
              </Link>
              <Link href="/become-a-seller">
                <span className={styles.secondaryButton}>Torne-se um Vendedor</span>
              </Link>
            </div>
          </div>
          <div className={styles.heroImage}>
            <img 
              src="https://cdn.shopify.com/s/files/1/0680/1463/7353/files/QJNElp6XTAW8IiGHimmf.jpg?v=1728148977" 
              alt="Caixas de assinatura CoreBox" 
            />
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.features}>
          <h2 className={styles.sectionTitle}>Por que escolher o CoreBox?</h2>
          
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3>Variedade Exclusiva</h3>
              <p>Descubra caixas de assinatura únicas e inovadoras para todos os gostos e estilos.</p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3>Conveniência Total</h3>
              <p>Receba produtos selecionados diretamente na sua porta, sem preocupações.</p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3>Experiência Personalizada</h3>
              <p>Escolha entre diferentes categorias e encontre novas marcas incríveis.</p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3>Garantia e Segurança</h3>
              <p>Pagamentos protegidos e suporte ao cliente para uma experiência sem riscos.</p>
            </div>
          </div>
        </section>

        {/* Popular Boxes */}
        <section className={styles.popularBoxes}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Caixas Populares</h2>
            <Link href="/boxes">
              <span className={styles.sectionLink}>Ver todas</span>
            </Link>
          </div>
          
          <div className={styles.boxesGrid}>
            <div className={styles.boxCard}>
              <div className={styles.boxImageContainer}>
                <img 
                  src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
                  alt="Caixa de Tecnologia" 
                />
                <div className={styles.boxBadge}>Mais Popular</div>
              </div>
              <div className={styles.boxContent}>
                <h3>Caixa Tech Premium</h3>
                <p>Gadgets exclusivos e lançamentos tecnológicos todo mês para os verdadeiros entusiastas.</p>
                <div className={styles.boxFooter}>
                  <span className={styles.boxPrice}>39,90€ por caixa</span>
                  <Link href="/boxes">
                    <span className={styles.boxButton}>Ver Detalhes</span>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className={styles.boxCard}>
              <div className={styles.boxImageContainer}>
                <img 
                  src="https://images.unsplash.com/photo-1606914907313-3fde0444dd43?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="Caixa Gourmet" 
                />
              </div>
              <div className={styles.boxContent}>
                <h3>Caixa Gourmet</h3>
                <p>Produtos gourmet selecionados para você, desde iguarias até especiarias de todo o mundo.</p>
                <div className={styles.boxFooter}>
                  <span className={styles.boxPrice}>29,90€ por caixa</span>
                  <Link href="/boxes">
                    <span className={styles.boxButton}>Ver Detalhes</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className={styles.howItWorks}>
          <h2 className={styles.sectionTitle}>Como Funciona</h2>
          
          <div className={styles.stepsContainer}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <h3>Escolha sua caixa</h3>
              <p>Navegue por diversas categorias e encontre caixas que combinam com seus interesses.</p>
            </div>
            
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <h3>Assine um plano</h3>
              <p>Escolha entre planos mensais ou anuais com descontos especiais.</p>
            </div>
            
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <h3>Receba em casa</h3>
              <p>Suas caixas são entregues todo mês, cheias de surpresas e novidades.</p>
            </div>
            
            <div className={styles.step}>
              <div className={styles.stepNumber}>4</div>
              <h3>Surpreenda-se</h3>
              <p>Desembale produtos cuidadosamente selecionados para encantar seu mês.</p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className={styles.testimonials}>
          <h2 className={styles.sectionTitle}>O que nossos clientes dizem</h2>
          
          <div className={styles.testimonialGrid}>
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialText}>
                <p>"Assino a caixa de tecnologia há 6 meses e cada entrega é uma surpresa incrível. Produtos de qualidade e curadoria impecável!"</p>
              </div>
              <div className={styles.testimonialAuthor}>
                <img src="https://randomuser.me/api/portraits/men/54.jpg" alt="Pedro Almeida" />
                <div>
                  <h4>Pedro Almeida</h4>
                  <p>Assinante desde 2022</p>
                </div>
              </div>
            </div>
            
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialText}>
                <p>"As caixas gourmet são sensacionais! Descobri ingredientes que nunca tinha experimentado e agora são essenciais na minha cozinha."</p>
              </div>
              <div className={styles.testimonialAuthor}>
                <img src="https://randomuser.me/api/portraits/women/54.jpg" alt="Mariana Costa" />
                <div>
                  <h4>Mariana Costa</h4>
                  <p>Assinante desde 2023</p>
                </div>
              </div>
            </div>
            
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialText}>
                <p>"Os gadgets da caixa de tecnologia me surpreendem a cada mês. Produtos inovadores que realmente fazem a diferença no meu dia a dia."</p>
              </div>
              <div className={styles.testimonialAuthor}>
                <img src="https://randomuser.me/api/portraits/men/34.jpg" alt="Lucas Ferreira" />
                <div>
                  <h4>Lucas Ferreira</h4>
                  <p>Assinante desde 2022</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className={styles.finalCta}>
          <h2>Pronto para descobrir sua próxima caixa favorita?</h2>
          <p>Mais de 10.000 pessoas já estão aproveitando surpresas mensais. Junte-se a eles!</p>
          <Link href="/boxes">
            <span className={styles.ctaButton}>Explorar Todas as Caixas</span>
          </Link>
        </section>
      </main>
    </div>
  );
} 