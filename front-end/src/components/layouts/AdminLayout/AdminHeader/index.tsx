import { useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";
import styles from "./AdminHeader.module.css";

interface HeaderProps {
  onLogout?: () => void;
}

const PAGE_MESSAGES: Record<string, { title: string; subtitle: string }> = {
  "/admin/obras": {
    title: "Gestão de Obras",
    subtitle: "Cadastre, edite e organize o acervo histórico do museu.",
  },
  "/admin/eventos": {
    title: "Gestão de Eventos",
    subtitle: "Acompanhe a programação, exposições e eventos do museu.",
  },
};

const DEFAULT_MESSAGE = {
  title: "Bem-vindo ao Museu de Marabá",
  subtitle: "Gerencie eventos, obras, editais e usuários em um único ambiente.",
};

export default function Header({ onLogout }: HeaderProps) {
  const location = useLocation();

  const currentMessage = PAGE_MESSAGES[location.pathname] || DEFAULT_MESSAGE;

  // Verifica se a rota atual é Obras ou Eventos
  const isLeftAligned =
    location.pathname.includes("/obras") ||
    location.pathname.includes("/eventos");

  return (
    <header
      className={`${styles.header} ${isLeftAligned ? styles.alignLeft : ""}`}
    >
      <div className={styles.left}>
        <span className={styles.badge}>Painel Administrativo</span>

        <h1 className={styles.title}>{currentMessage.title}</h1>

        <p className={styles.subtitle}>{currentMessage.subtitle}</p>
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