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
    rejeitada: "REJEITADA",
    exposta: "EXPOSTA",
  };

  const classes = {
    pendente: styles.pending,
    aprovada: styles.approved,
    rejeitada: styles.rejected,
    exposta: styles.exhibited,
  };

  return (
    <span className={`${styles.statusBadge} ${classes[status]}`}>
      {labels[status]}
    </span>
  );
}