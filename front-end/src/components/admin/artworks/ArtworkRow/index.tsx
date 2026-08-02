import styles from "./ArtworkRow.module.css";
import type { Artwork } from "@/types/Artwork";

interface Props {
  artwork: Artwork;
  onClick: (artwork: Artwork) => void;
}

export default function ArtworkRow({ artwork, onClick }: Props) {
  // Mapeia a classe de cor de acordo com o status
  const getStatusClass = (status: string) => {
    if (!status) return "";

    const s = status.toLowerCase().trim();

    // Trata 'pendente'
    if (s.includes("pendente")) {
      return styles.pendente;
    }

    // Trata 'aprovado' e 'aprovada'
    if (s.includes("aprovad")) {
      return styles.aprovado;
    }

    // Trata 'reprovado', 'reprovada', 'rejeitado' e 'rejeitada'
    if (s.includes("reprovad") || s.includes("rejeitad")) {
      return styles.reprovado;
    }

    return "";
  };

  // Formata a data no padrão "22 de maio 2026" / "12 de abr 2026"
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";

    // Tratamento de fuso horário UTC simples para evitar divergência de dias
    const [year, month, day] = dateString.split("T")[0].split("-");
    if (!year || !month || !day) return "-";

    const date = new Date(Number(year), Number(month) - 1, Number(day));
    const dayFormatted = String(date.getDate()).padStart(2, "0");
    const monthName = date
      .toLocaleDateString("pt-BR", { month: "short" })
      .replace(".", "");

    return `${dayFormatted} de ${monthName} ${year}`;
  };

  return (
    <div className={styles.row} onClick={() => onClick(artwork)}>
      {/* Coluna 1: Título + Categoria/Autor */}
      <div className={styles.titleColumn}>
        <span className={styles.title}>{artwork.titulo_obra}</span>
        <div className={styles.meta}>
          <span>{artwork.categoria_obra}</span>
          <span className={styles.dot}>•</span>
          <span>
            autor:{" "}
            <span className={styles.author}>
              {artwork.artista?.nome || artwork.autor || "Não informado"}
            </span>
          </span>
        </div>
      </div>

      {/* Coluna 2: Evento */}
      <div className={styles.cellText}>{artwork.evento || "Exponha"}</div>

      {/* Coluna 3: Data de Envio */}
      <div className={styles.cellText}>{formatDate(artwork.data_envio)}</div>

      {/* Coluna 4: Badge de Status */}
      <div className={styles.statusColumn}>
        <span className={`${styles.status} ${getStatusClass(artwork.status)}`}>
          {artwork.status}
        </span>
      </div>
    </div>
  );
}
