import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Boxes.module.css';
import Image from 'next/image';

export default function Boxes() {
  const boxesData = [
    {
      id: 'tech',
      name: 'Caixa de Tecnologia',
      description: 'Receba os mais recentes gadgets tech todo mês em uma seleção especial feita por especialistas.',
      price: '39,90€ por caixa',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'
    },
    {
      id: 'gourmet',
      name: 'Caixa Gourmet',
      description: 'Produtos gourmet selecionados para você, desde iguarias até especiarias de todo o mundo.',
        price: '29,90€ por caixa',
        image: 'https://cdn.shopify.com/s/files/1/0680/1463/7353/files/QJNElp6XTAW8IiGHimmf.jpg?v=1728148977',
    }
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Caixas - CoreBox</title>
        <meta name="description" content="Explore nossas caixas de assinatura" />
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
        <h1 className={styles.title}>
          Nossas Caixas
        </h1>
        <p className={styles.description}>
          Explore nossa variedade de caixas de assinatura
        </p>
        
        <div className={styles.grid}>
          {boxesData.map((box) => (
            <div key={box.id} className={styles.card}>
              <div className={styles.cardImageContainer}>
                <img 
                  src={box.image} 
                  alt={box.name} 
                  className={styles.cardImage}
                />
              </div>
              <div className={styles.cardContent}>
                <h2>{box.name}</h2>
                <p>{box.description}</p>
              </div>
              <div className={styles.cardFooter}>
                <div className={styles.price}>{box.price}</div>
                <div>
                  <Link href={`/box/${box.id}`}>
                    <span className={styles.viewDetailsButton}>Ver Detalhes</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
} 