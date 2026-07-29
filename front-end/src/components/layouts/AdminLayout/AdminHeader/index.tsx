import styles from "./AdminHeader.module.css";

interface HeaderProps {
  onLogout: () => void;
}

export default function Header({
  onLogout,
}: HeaderProps) {
  return (
    <header className={styles.header}>
      <div>
        <h1 className={styles.title}>
          Dashboard Administrativo
        </h1>

        <span className={styles.subtitle}>
          Museu Municipal Francisco Coelho
        </span>
      </div>

      <button
        className={styles.logoutButton}
        onClick={onLogout}
      >
        Sair
      </button>
    </header>
  );
}