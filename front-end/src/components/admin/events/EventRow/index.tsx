import {
  ImageOff,
  MapPin,
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
  function parseDate(date: string) {
    const parsedDate = new Date(date);

    return Number.isNaN(parsedDate.getTime())
      ? null
      : parsedDate;
  }

  function formatDate(
    date: Date,
    options?: Intl.DateTimeFormatOptions
  ) {
    return date
      .toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        ...options,
      })
      .replace(".", "");
  }

  function formatPeriod(
    startDate: string,
    endDate: string
  ) {
    const start = parseDate(startDate);
    const end = parseDate(endDate);

    if (!start && !end) {
      return "Período não informado";
    }

    if (!start) {
      return formatDate(end!);
    }

    if (!end) {
      return formatDate(start);
    }

    const sameDay =
      start.getFullYear() === end.getFullYear() &&
      start.getMonth() === end.getMonth() &&
      start.getDate() === end.getDate();

    const sameMonth =
      start.getFullYear() === end.getFullYear() &&
      start.getMonth() === end.getMonth();

    const sameYear =
      start.getFullYear() === end.getFullYear();

    if (sameDay) {
      return formatDate(start);
    }

    if (sameMonth) {
      return `${String(start.getDate()).padStart(2, "0")} — ${formatDate(
        end,
        {
          day: undefined,
        }
      )}`;
    }

    if (sameYear) {
      return `${formatDate(start, {
        year: undefined,
      })} — ${formatDate(end)}`;
    }

    return `${formatDate(start)} — ${formatDate(end)}`;
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

  function getStatus() {
    const finished =
      new Date(event.data_hora_fim).getTime() < Date.now();

    return {
      label: finished ? "Encerrado" : "Ativo",
      className: finished
        ? styles.statusFinished
        : styles.statusActive,
    };
  }

  const imageUrl = event.imagem_evento
    ? event.imagem_evento.startsWith("http")
      ? event.imagem_evento
      : `http://localhost:3333/uploads/${event.imagem_evento}`
    : null;

  const status = getStatus();

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
      {/* STATUS */}
      <div className={styles.statusArea}>
        <span
          className={`${styles.status} ${status.className}`}
        >
          <span className={styles.statusDot} />
          {status.label}
        </span>
      </div>

      {/* EVENTO */}
      <div className={styles.eventColumn}>
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
                size={20}
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </div>
          )}
        </div>

        <div className={styles.eventInfo}>
          <span className={styles.title}>
            {event.titulo_evento}
          </span>

          <span className={styles.description}>
            {event.descricao_evento || "Sem descrição"}
          </span>
        </div>
      </div>

      {/* TIPO */}
      <div className={styles.cellText}>
        {formatType(event.tipo_evento)}
      </div>

      {/* PERÍODO */}
      <div className={styles.cellText}>
        <span className={styles.dateRange}>
          {formatPeriod(
            event.data_hora_inicio,
            event.data_hora_fim
          )}
        </span>
      </div>

      {/* LOCAL */}
      <div className={styles.cellText}>
        <span className={styles.location}>
          <MapPin
            size={14}
            strokeWidth={1.6}
            aria-hidden="true"
          />

          <span>
            {event.local_evento || "Não informado"}
          </span>
        </span>
      </div>
    </article>
  );
}