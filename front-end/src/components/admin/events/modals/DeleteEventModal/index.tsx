import {
  AlertTriangle,
  Trash2,
  X,
} from "lucide-react";

import type { Event } from "@/types/Event";

import styles from "./DeleteEventModal.module.css";

interface Props {
  isOpen: boolean;
  evento: Event | null;
  isDeleting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteEventModal({
  isOpen,
  evento,
  isDeleting = false,
  onClose,
  onConfirm,
}: Props) {
  if (!isOpen || !evento) {
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
          <div className={styles.headerContent}>
            <div className={styles.icon}>
              <AlertTriangle size={22} />
            </div>

            <div>
              <h2>Excluir evento</h2>

              <p className={styles.subtitle}>
                Esta ação é permanente.
              </p>
            </div>
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
          <p className={styles.message}>
            Tem certeza de que deseja excluir o
            evento abaixo?
          </p>

          <div className={styles.eventCard}>
            <span className={styles.label}>
              Evento
            </span>

            <strong className={styles.title}>
              {evento.titulo_evento}
            </strong>

            <small>
              {evento.local_evento}
            </small>
          </div>

          <div className={styles.warning}>
            <AlertTriangle size={18} />

            <span>
              Após a exclusão, o evento e suas
              informações não poderão ser
              recuperados.
            </span>
          </div>
        </main>

        <footer className={styles.footer}>
          <button
            type="button"
            className={styles.cancel}
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancelar
          </button>

          <button
            type="button"
            className={styles.delete}
            onClick={onConfirm}
            disabled={isDeleting}
          >
            <Trash2 size={17} />

            {isDeleting
              ? "Excluindo..."
              : "Excluir evento"}
          </button>
        </footer>
      </div>
    </div>
  );
}