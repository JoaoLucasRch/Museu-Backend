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
    <div className={styles.overlay} onClick={onCancel}>
      <div
        className={`${styles.confirmModal} ${styles.confirmReject}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className={styles.closeButton}
          onClick={onCancel}
          type="button"
          disabled={loading}
          aria-label="Fechar"
        >
          <X size={20} />
        </button>

        <div className={styles.confirmContent}>
          <span className={styles.confirmEyebrow}>
            Não aprovação
          </span>

          <h3 className={styles.confirmTitle}>
            Confirmar não aprovação
          </h3>

          <p className={styles.confirmText}>
            Deseja realmente não aprovar a obra{" "}
            <strong>{obra}</strong>?
          </p>
        </div>

        <div className={styles.confirmButtons}>
          <button
            className={styles.cancelButton}
            onClick={onCancel}
            type="button"
            disabled={loading}
          >
            Cancelar
          </button>

          <button
            className={styles.confirmRejectButton}
            onClick={onConfirm}
            type="button"
            disabled={loading}
          >
            {loading ? "Não aprovando..." : "Confirmar não aprovação"}
          </button>
        </div>
      </div>
    </div>
  );
}