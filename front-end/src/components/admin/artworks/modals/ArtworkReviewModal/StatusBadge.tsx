import styles from "./ArtworkReviewModal.module.css";

interface Props {
  status:
    | "pendente"
    | "aprovada"
    | "rejeitada"
    | "exposta";
}

export default function StatusBadge({ status }: Props) {
  const labels = {
    pendente: "PENDENTE",
    aprovada: "APROVADA",
    rejeitada: "NÃO APROVADA",
    exposta: "EXPOSTA",
  };

  const classes = {
    pendente: styles.statusBadgePending,
    aprovada: styles.statusBadgeApproved,
    rejeitada: styles.statusBadgeRejected,
    exposta: styles.statusBadgeExhibited,
  };

  return (
    <span className={`${styles.statusBadge} ${classes[status]}`}>
      {labels[status]}
    </span>
  );
}