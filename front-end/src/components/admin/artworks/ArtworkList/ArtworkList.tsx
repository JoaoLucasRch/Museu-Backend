import styles from "./ArtworkList.module.css";
import ArtworkRow from "../ArtworkRow";
import type { Artwork } from "@/types/Artwork";

interface Props {
  obras: Artwork[];
  onArtworkClick: (artwork: Artwork) => void;
}

export default function ArtworkList({ obras, onArtworkClick }: Props) {
  return (
    <div className={styles.tableCard}>
      {/* Cabeçalho Fixo */}
      <div className={styles.header}>
        <div>Obra</div>
        <div>Evento</div>
        <div>Enviado</div>
        <div>Status</div>
      </div>

      {/* Conteúdo com Scroll Interno */}
      <div className={styles.scrollArea}>
        {obras.map((obra) => (
          <ArtworkRow
            key={obra.id_obra}
            artwork={obra}
            onClick={onArtworkClick}
          />
        ))}
      </div>
    </div>
  );
}