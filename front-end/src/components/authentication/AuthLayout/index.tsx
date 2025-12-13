import type { ReactNode } from 'react';
import styles from './style.module.css';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <h1>Junte-se à nossa<br />comunidade</h1>
        <p>Entre no mundo da arte e compartilhe<br />suas criações</p>
      </div>

      <div className={styles.right}>
        {children}
      </div>
    </div>
  );
}
