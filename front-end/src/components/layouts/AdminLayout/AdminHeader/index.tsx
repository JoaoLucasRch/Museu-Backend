import { LogOut } from "lucide-react";

import styles from "./AdminHeader.module.css";

interface HeaderProps {
  onLogout?: () => void;
}

export default function Header({
  onLogout,
}: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <span className={styles.badge}>
          Painel Administrativo
        </span>

        <h1 className={styles.title}>
          Bem-vindo ao Museu de Marabá
        </h1>

        <p className={styles.subtitle}>
          Gerencie eventos, obras, editais e usuários em um único ambiente.
        </p>
      </div>

      {onLogout && (
        <button
          type="button"
          className={styles.logoutButton}
          onClick={onLogout}
        >
          <span>Sair</span>

          <LogOut size={16} />
        </button>
      )}
    </header>
  );
}