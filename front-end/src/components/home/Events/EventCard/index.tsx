import {
  CalendarDays,
  MapPin,
  ArrowUpRight,
  ImageOff,
} from "lucide-react";

import styles from "./EventCard.module.css";

import type { Event } from "@/types/Event";

interface Props {
  evento: Event;
  isEmExibicao: boolean;
  isEdital: boolean;
  isTooltipOpen: boolean;

  onClick: (evento: Event) => void;

  onMouseEnter: (id: number) => void;
  onMouseLeave: () => void;

  formatarData: (data: string) => string;
}

export default function EventCard({
  evento,
  isEmExibicao,
  isEdital,
  onClick,
  formatarData,
}: Props) {
  const imagemEvento =
    typeof evento.imagem_evento === "string" &&
    evento.imagem_evento.trim() !== ""
      ? evento.imagem_evento.trim()
      : null;

  const temImagem = imagemEvento !== null;

  function getStatusLabel() {
    if (isEdital) {
      return "Edital aberto";
    }

    if (isEmExibicao) {
      return "Em exibição";
    }

    return "Em breve";
  }

  function getStatusClass() {
    if (isEdital) {
      return `${styles.status} ${styles.edital}`;
    }

    if (isEmExibicao) {
      return `${styles.status} ${styles.exibicao}`;
    }

    return `${styles.status} ${styles.breve}`;
  }

  function handleImageError(
    event: React.SyntheticEvent<HTMLImageElement>
  ) {
    /*
     * Quando a URL existe mas a imagem não consegue carregar,
     * escondemos a imagem e mostramos o placeholder.
     */
    event.currentTarget.style.display = "none";

    const placeholder =
      event.currentTarget.parentElement?.querySelector(
        '[data-image-placeholder="true"]'
      );

    if (placeholder instanceof HTMLElement) {
      placeholder.style.display = "flex";
    }
  }

  return (
    <article
      className={styles.card}
      onClick={() => onClick(evento)}
    >
      {/* =====================================================
          ÁREA VISUAL
      ===================================================== */}

      <div className={styles.imageContainer}>

        {/* ===================================================
            IMAGEM
        =================================================== */}

        {temImagem && (
          <img
            src={imagemEvento}
            alt={evento.titulo_evento}
            className={styles.image}
            loading="lazy"
            onError={handleImageError}
          />
        )}

        {/* ===================================================
            PLACEHOLDER
            Só existe inicialmente quando NÃO há imagem.
            Caso a imagem quebre, ele é exibido pelo
            handleImageError.
        =================================================== */}

        <div
          className={styles.imagePlaceholder}
          data-image-placeholder="true"
          aria-label={
            !temImagem
              ? `Evento sem imagem: ${evento.titulo_evento}`
              : undefined
          }
          style={{
            display: temImagem ? "none" : "flex",
          }}
        >
          <div className={styles.placeholderIcon}>
            <ImageOff
              size={30}
              strokeWidth={1.3}
              aria-hidden="true"
            />
          </div>

          <span>Sem imagem</span>
        </div>

        {/* ===================================================
            STATUS
        =================================================== */}

        <span className={getStatusClass()}>
          {getStatusLabel()}
        </span>

        {/* ===================================================
            TÍTULO
            Somente para eventos que possuem imagem.
        =================================================== */}

        {temImagem && (
          <div className={styles.titleOverlay}>
            <h3>{evento.titulo_evento}</h3>
          </div>
        )}
      </div>

      {/* =====================================================
          CONTEÚDO
      ===================================================== */}

      <div className={styles.content}>
        {/* ===================================================
            LOCAL + DATA
        =================================================== */}

        <div className={styles.info}>
          <span>
            <MapPin
              size={15}
              strokeWidth={1.7}
              aria-hidden="true"
            />

            <span className={styles.infoText}>
              {evento.local_evento}
            </span>
          </span>

          <span>
            <CalendarDays
              size={15}
              strokeWidth={1.7}
              aria-hidden="true"
            />

            <span className={styles.infoText}>
              {formatarData(
                evento.data_hora_inicio
              )}
            </span>
          </span>
        </div>

        {/* ===================================================
            DESCRIÇÃO
        =================================================== */}

        {evento.descricao_evento && (
          <p className={styles.description}>
            {evento.descricao_evento}
          </p>
        )}

        {/* ===================================================
            BOTÃO
        =================================================== */}

        <button
          className={styles.viewButton}
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onClick(evento);
          }}
        >
          <span>Ver detalhes</span>

          <ArrowUpRight
            size={16}
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </button>
      </div>
    </article>
  );
}