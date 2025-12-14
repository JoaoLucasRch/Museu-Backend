import type { ReactNode } from 'react';
import styles from './style.module.css';

interface AuthLayoutProps {
  children: ReactNode;
  // Adicionamos title e subtitle como opcionais e do tipo ReactNode 
  // (para aceitar strings ou elementos com <br/>)
  title?: ReactNode;
  subtitle?: ReactNode;
}

export default function AuthLayout({ 
  children, 
  // Aqui definimos o valor padrão caso a prop não seja passada
  title = <>Junte-se à nossa<br />comunidade</>,
  subtitle = <>Entre no mundo da arte e compartilhe<br />suas criações</>
}: AuthLayoutProps) {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <div className={styles.right}>
        {children}
      </div>
    </div>
  );
}