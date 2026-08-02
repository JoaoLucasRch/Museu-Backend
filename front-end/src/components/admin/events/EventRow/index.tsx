import {
  CalendarDays,
  MapPin,
  Tag,
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
    return new Date(date).toLocaleDateString("pt-BR", {
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
          <img src={imageUrl} alt={event.titulo_evento} />
        ) : (
          <div className={styles.placeholder}>Sem imagem</div>
        )}
      </div>

      <div className={styles.content}>
        <h3>{event.titulo_evento}</h3>

        <p>{event.descricao_evento}</p>

        <div className={styles.meta}>
          <span>
            <MapPin size={15} />
            {event.local_evento}
          </span>

          <span>
            <Tag size={15} />
            {formatType(event.tipo_evento)}
          </span>

          <span>
            <CalendarDays size={15} />
            {formatDate(event.data_hora_inicio)}
            {" — "}
            {formatDate(event.data_hora_fim)}
          </span>
        </div>
      </div>
    </article>
  );
}