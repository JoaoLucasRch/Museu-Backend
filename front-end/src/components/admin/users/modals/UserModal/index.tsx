import {
  X,
  User,
  Mail,
  Phone,
  Shield,
  BarChart3,
} from "lucide-react";

import styles from "./UserModal.module.css";

import type { UserProfile } from "@/types/User";

interface UserStats {
  total: number;
  approved: number;
  pending: number;
}

interface Props {
  isOpen: boolean;
  user: UserProfile | null;
  stats?: UserStats;
  onClose: () => void;
}

export default function UserModal({
  isOpen,
  user,
  stats,
  onClose,
}: Props) {
  if (!isOpen || !user) {
    return null;
  }

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.header}>
          <div>
            <h2>{user.nome}</h2>

            <p className={styles.subtitle}>
              Informações da conta do usuário.
            </p>
          </div>

          <button
            type="button"
            className={styles.close}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </header>

        <main className={styles.content}>
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>
              Dados do usuário
            </h3>

            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <User size={18} />

                <div>
                  <span>Nome</span>

                  <strong>{user.nome}</strong>
                </div>
              </div>

              <div className={styles.infoItem}>
                <Mail size={18} />

                <div>
                  <span>E-mail</span>

                  <strong>{user.email}</strong>
                </div>
              </div>

              <div className={styles.infoItem}>
                <Phone size={18} />

                <div>
                  <span>Telefone</span>

                  <strong>
                    {user.contato || "Não informado"}
                  </strong>
                </div>
              </div>

              <div className={styles.infoItem}>
                <Shield size={18} />

                <div>
                  <span>Perfil</span>

                  <strong>{user.role}</strong>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>
              Estatísticas
            </h3>

            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <BarChart3 size={20} />

                <span>Total de obras</span>

                <strong>
                  {stats?.total ?? 0}
                </strong>
              </div>

              <div className={styles.statCard}>
                <BarChart3 size={20} />

                <span>Aprovadas</span>

                <strong>
                  {stats?.approved ?? 0}
                </strong>
              </div>

              <div className={styles.statCard}>
                <BarChart3 size={20} />

                <span>Pendentes</span>

                <strong>
                  {stats?.pending ?? 0}
                </strong>
              </div>
            </div>
          </section>
        </main>

        <footer className={styles.footer}>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
          >
            Fechar
          </button>
        </footer>
      </div>
    </div>
  );
}