import { X } from "lucide-react";

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
          <div>
            <span className={styles.badge}>
              EXCLUSÃO
            </span>

            <h2>Confirmar ação</h2>
          </div>

          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </header>

        <main className={styles.content}>
          <p className={styles.message}>
            Deseja realmente remover{" "}
            <strong>{evento.titulo_evento}</strong>?
          </p>
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
            {isDeleting ? "Excluindo..." : "Confirmar"}
          </button>
        </footer>
      </div>
    </div>
  );
}