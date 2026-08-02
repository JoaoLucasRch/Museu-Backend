import { LogOut } from "lucide-react";
import styles from "./AdminHeader.module.css";

interface HeaderProps {
  onLogout: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div>
        <h1 className={styles.title}>
          Museu Municipal Francisco Coelho
        </h1>

        <span className={styles.subtitle}>
          Dashboard Administrativo
        </span>
      </div>

      <button
      
        className={styles.logoutButton}
        onClick={onLogout}
      >
        <span>Sair</span>
        <LogOut size={15} strokeWidth={2} />
      </button>
    </header>
  );
}