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
        if (
          e.key === "Enter" ||
          e.key === " "
        ) {
          onClick(artwork);
        }
      }}
    >
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
        <span className={`${styles.badge} ${statusClass}`}>
          {artwork.status.toUpperCase()}
        </span>
      </div>
    </div>
  );
}