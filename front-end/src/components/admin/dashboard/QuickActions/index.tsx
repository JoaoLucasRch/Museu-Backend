import {
  CalendarPlus,
  CheckCircle2,
  UserPlus,
} from "lucide-react";

import styles from "./QuickActions.module.css";

interface Props {
  onRegisterAdmin: () => void;
  onCreateEvent?: () => void;
  onApproveArtworks?: () => void;
}

export default function AdmQuickActions({
  onRegisterAdmin,
  onCreateEvent,
  onApproveArtworks,
}: Props) {
  return (
    <section className={styles.actionsSection}>
      <div className={styles.header}>
        <h2>Ações Rápidas</h2>

        <p>
          Execute rapidamente as principais tarefas do painel.
        </p>
      </div>

      <div className={styles.actions}>
        <button
          onClick={onCreateEvent}
          className={styles.actionButton}
        >
          <CalendarPlus size={20} />

          <span>Novo Evento</span>
        </button>

        <button
          onClick={onApproveArtworks}
          className={styles.actionButton}
        >
          <CheckCircle2 size={20} />

          <span>Aprovar Obras</span>
        </button>

        <button
          onClick={onRegisterAdmin}
          className={styles.actionButton}
        >
          <UserPlus size={20} />

          <span>Cadastrar Admin</span>
        </button>
      </div>
    </section>
  );
}