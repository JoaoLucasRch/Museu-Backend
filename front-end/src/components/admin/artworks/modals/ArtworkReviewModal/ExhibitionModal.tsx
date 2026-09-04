import { X } from "lucide-react";

import styles from "./ArtworkReviewModal.module.css";

interface Props {
  isOpen: boolean;
  obra: string;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ExhibitionModal({
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
        className={`${styles.confirmModal} ${styles.confirmExhibition}`}
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
            Exposição
          </span>

          <h3 className={styles.confirmTitle}>
            Marcar como exposta?
          </h3>

          <p className={styles.confirmText}>
            Confirma que a obra{" "}
            <strong>"{obra}"</strong> está sendo exposta
            publicamente? O status será alterado de{" "}
            <strong>Aprovada</strong> para{" "}
            <strong>Exposta</strong>.
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
            className={styles.confirmApproveButton}
            onClick={onConfirm}
            type="button"
            disabled={loading}
          >
            {loading ? "Confirmando..." : "Confirmar exposição"}
          </button>
        </div>
      </div>
    </div>
  );
}