import { X } from "lucide-react";

import styles from "./DeleteConfirmationModal.module.css";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  artworkTitle: string;
  isDeleting?: boolean;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  artworkTitle,
  isDeleting,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
    >
      <div
        className={styles.modal}
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <header className={styles.header}>
          <div>
            <span className={styles.section}>
              EXCLUSÃO
            </span>

            <h2>
              Excluir obra
            </h2>

            <p>
              Remover esta submissão do museu.
            </p>
          </div>

          <button
            className={styles.closeButton}
            onClick={onClose}
            disabled={isDeleting}
          >
            <X size={20} />
          </button>
        </header>


        <main className={styles.content}>
          <p className={styles.message}>
            Você tem certeza que deseja apagar a obra{" "}
            <strong>
              {artworkTitle}
            </strong>
            ?
          </p>
        </main>


        <footer className={styles.footer}>
          <button
            className={styles.cancelButton}
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancelar
          </button>


          <button
            className={styles.deleteButton}
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting
              ? "Excluindo..."
              : "Excluir obra"}
          </button>
        </footer>

      </div>
    </div>
  );
}