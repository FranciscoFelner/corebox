import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const router = useRouter();
  
  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <h1>CoreBox</h1>
      </div>
      <ul className={styles.menu}>
        <li className={router.pathname === "/boxes" ? styles.active : ""}>
          <Link href="/boxes">
            <div className={styles.menuItem}>
              <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <span>Caixas</span>
            </div>
          </Link>
        </li>
        <li className={router.pathname === "/become-a-seller" ? styles.active : ""}>
          <Link href="/become-a-seller">
            <div className={styles.menuItem}>
              <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>Torne-se um Vendedor</span>
            </div>
          </Link>
        </li>
      </ul>
    </div>
  );
} 