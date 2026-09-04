import styles from "./ArtworkCard.module.css";

import type { Artwork } from "@/types/Artwork";

interface ArtworkCardProps {
  artwork: Artwork;
  onClick: (artwork: Artwork) => void;
}

export default function ArtworkCard({
  artwork,
  onClick,
}: ArtworkCardProps) {
  const formatDate = (date?: string) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("pt-BR");
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pendente":
        return "PENDENTE";

      case "aprovada":
        return "APROVADA";

      case "rejeitada":
        return "NÃO APROVADA";

      case "exposta":
        return "EXPOSTA";

      default:
        return status.toUpperCase();
    }
  };

  const statusClass = styles[artwork.status];

  const origemObra =
    artwork.edital?.titulo_evento ??
    "Exponha sua Arte";

  return (
    <div
      className={styles.row}
      onClick={() => onClick(artwork)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick(artwork);
        }
      }}
    >
      {/* Desktop: grid layout */}
      <div className={styles.desktopGrid}>
        <div className={styles.artwork}>
          <strong>{artwork.titulo_obra}</strong>
          <span>{artwork.categoria_obra}</span>
        </div>

        <div className={styles.event}>
          {origemObra}
        </div>

        <div className={styles.date}>
          {formatDate(artwork.data_envio)}
        </div>

        <div className={styles.status}>
          <span
            className={`${styles.badge} ${statusClass}`}
          >
            {getStatusLabel(artwork.status)}
          </span>
        </div>
      </div>

      {/* Mobile: card layout */}
      <div className={styles.mobileCard}>
        <div className={styles.mobileHeader}>
          <strong className={styles.mobileTitle}>
            {artwork.titulo_obra}
          </strong>

          <span
            className={`${styles.mobileBadge} ${statusClass}`}
          >
            {getStatusLabel(artwork.status)}
          </span>
        </div>

        <div className={styles.mobileInfo}>
          <span className={styles.mobileCategoria}>
            {artwork.categoria_obra}
          </span>

          <span className={styles.mobileOrigem}>
            {origemObra}
          </span>

          <span className={styles.mobileData}>
            {formatDate(artwork.data_envio)}
          </span>
        </div>
      </div>
    </div>
  );
}