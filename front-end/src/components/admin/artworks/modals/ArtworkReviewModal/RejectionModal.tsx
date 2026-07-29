import { X } from "lucide-react";
import styles from "./ArtworkReviewModal.module.css";

interface Props {
  isOpen: boolean;
  obra: string;
  loading: boolean;

  onCancel: () => void;
  onConfirm: () => void;
}

export default function RejectionModal({
  isOpen,
  obra,
  loading,
  onCancel,
  onConfirm,
}: Props) {
  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onClick={onCancel}
    >
      <div
        className={styles.confirmModal}
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <button
          className={styles.closeButton}
          onClick={onCancel}
        >
          <X size={20} />
        </button>

        <h3 className={styles.confirmTitle}>
          Confirmar Rejeição
        </h3>

        <p className={styles.confirmText}>
          Deseja realmente rejeitar a obra{" "}
          <strong>{obra}</strong>?
        </p>

        <div className={styles.confirmButtons}>
          <button
            className={styles.cancelButton}
            onClick={onCancel}
          >
            Cancelar
          </button>

          <button
            className={
              styles.confirmRejectButton
            }
            onClick={onConfirm}
            disabled={loading}
          >
            {loading
              ? "Rejeitando..."
              : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}