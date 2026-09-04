import {
  CalendarDays,
  ImageOff,
  MapPin,
  Tag,
  ArrowUpRight,
} from "lucide-react";

import type { Event } from "@/types/Event";

import styles from "./EventRow.module.css";

interface Props {
  event: Event;
  onView: () => void;
}

export default function EventRow({
  event,
  onView,
}: Props) {
  function formatDate(date: string) {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Data não informada";
    }

    return parsedDate.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  function formatType(type: Event["tipo_evento"]) {
    switch (type) {
      case "EXPOSICAO":
        return "Exposição";
      case "OFICINA":
        return "Oficina";
      case "PALESTRA":
        return "Palestra";
      case "LANCAMENTO":
        return "Lançamento";
      default:
        return "Outro";
    }
  }

  const imageUrl = event.imagem_evento
    ? event.imagem_evento.startsWith("http")
      ? event.imagem_evento
      : `http://localhost:3333/uploads/${event.imagem_evento}`
    : null;

  const isFinished =
    new Date(event.data_hora_fim).getTime() < Date.now();

  return (
    <article
      className={styles.row}
      onClick={onView}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onView();
        }
      }}
    >
      <div className={styles.thumbnail}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className={styles.placeholder}>
            <ImageOff
              size={24}
              strokeWidth={1.4}
              aria-hidden="true"
            />
            <span>Sem imagem</span>
          </div>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.topLine}>
          <span
            className={`${styles.status} ${isFinished
                ? styles.statusFinished
                : styles.statusActive
              }`}
          >
            <span className={styles.statusDot} />
            {isFinished ? "Encerrado" : "Ativo"}
          </span>

          <span className={styles.type}>
            {formatType(event.tipo_evento)}
          </span>
        </div>

        <h3 className={styles.title}>
          {event.titulo_evento}
        </h3>

        <p className={styles.description}>
          {event.descricao_evento}
        </p>

        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <CalendarDays
              size={15}
              strokeWidth={1.6}
              aria-hidden="true"
            />
            <span>
              {formatDate(event.data_hora_inicio)}
              {" — "}
              {formatDate(event.data_hora_fim)}
            </span>
          </span>

          <span className={styles.metaItem}>
            <MapPin
              size={15}
              strokeWidth={1.6}
              aria-hidden="true"
            />
            <span>{event.local_evento}</span>
          </span>
        </div>
      </div>

      <div className={styles.action}>
        <ArrowUpRight
          size={18}
          strokeWidth={1.7}
          aria-hidden="true"
        />
      </div>
    </article>
  );
}