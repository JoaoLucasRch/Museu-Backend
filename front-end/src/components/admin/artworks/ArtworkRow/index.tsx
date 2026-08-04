import type { Artwork } from "@/types/Artwork";

import styles from "./ArtworkRow.module.css";

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
  function getStatusClass(status: string) {
    if (!status) {
      return "";
    }

    const value = status.toLowerCase().trim();

    if (value.includes("pendente")) {
      return styles.pendente;
    }

    if (value.includes("aprovad")) {
      return styles.aprovado;
    }

    if (
      value.includes("reprovad") ||
      value.includes("rejeitad")
    ) {
      return styles.reprovado;
    }

    return "";
  }

  function formatDate(dateString?: string) {
    if (!dateString) {
      return "-";
    }

    const [year, month, day] =
      dateString.split("T")[0].split("-");

    if (!year || !month || !day) {
      return "-";
    }

    const date = new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    );

    const dayFormatted = String(
      date.getDate()
    ).padStart(2, "0");

    const monthName = date
      .toLocaleDateString("pt-BR", {
        month: "short",
      })
      .replace(".", "");

    return `${dayFormatted} de ${monthName} ${year}`;
  }

  return (
    <div
      className={styles.row}
      onClick={() => onClick(artwork)}
    >
      <div className={styles.titleColumn}>
        <span className={styles.title}>
          {artwork.titulo_obra}
        </span>

        <div className={styles.meta}>
          <span>
            {artwork.categoria_obra}
          </span>

          <span className={styles.dot}>
            •
          </span>

          <span>
            Autor:{" "}

            <span className={styles.author}>
              {artwork.artista?.nome ??
                artwork.autor ??
                "Não informado"}
            </span>
          </span>
        </div>
      </div>

      <div className={styles.cellText}>
        {artwork.edital?.titulo_evento ?? "Exponha"}
      </div>

      <div className={styles.cellText}>
        {formatDate(artwork.data_envio)}
      </div>

      <div className={styles.statusColumn}>
        <span
          className={`${styles.status} ${getStatusClass(
            artwork.status
          )}`}
        >
          {artwork.status}
        </span>
      </div>
    </div>
  );
}