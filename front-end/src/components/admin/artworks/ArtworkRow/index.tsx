import {
  ChevronRight,
} from "lucide-react";

import styles from "./ArtworkRow.module.css";

import type {
  Artwork,
} from "@/types/Artwork";

import {
  getArtworkStatusColor,
} from "@/utils/artwork";

interface Props {
  artwork: Artwork;

  onClick: (
    artwork: Artwork
  ) => void;
}

export default function ArtworkRow({
  artwork,
  onClick,
}: Props) {
  return (
    <div
      className={styles.row}
      onClick={() => onClick(artwork)}
    >
      <div className={styles.title}>
        <strong>
          {artwork.titulo_obra}
        </strong>
      </div>

      <div>
        {artwork.categoria_obra}
      </div>

      <div>
        <span
          className={styles.status}
          style={{
            backgroundColor:
              getArtworkStatusColor(
                artwork.status
              ),
          }}
        >
          {artwork.status}
        </span>
      </div>

      <div>
        {artwork.data_envio
          ? new Date(
              artwork.data_envio
            ).toLocaleDateString(
              "pt-BR"
            )
          : "-"}
      </div>

      <div className={styles.icon}>
        <ChevronRight size={18} />
      </div>
    </div>
  );
}