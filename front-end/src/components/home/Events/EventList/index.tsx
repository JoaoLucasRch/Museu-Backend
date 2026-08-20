import EventCard from "../EventCard";

import type { Event } from "@/types/Event";

import styles from "./EventList.module.css";

interface Props {
  eventos: Event[];

  eventosEmExibicao: Event[];

  editais: Event[];

  activeTooltipId: number | null;

  onClick: (evento: Event) => void;

  onMouseEnter: (id: number) => void;

  onMouseLeave: () => void;

  formatarData: (data: string) => string;

  formatarHorario: (
    inicio: string,
    fim: string
  ) => string;

  visibleEvents: Event[];
}

export default function EventList({
  eventosEmExibicao,
  editais,
  activeTooltipId,
  onClick,
  onMouseEnter,
  onMouseLeave,
  formatarData,
  visibleEvents,
}: Props) {
  return (
    <div className={styles.list}>
      {visibleEvents.map((evento) => {
        const isEmExibicao =
          eventosEmExibicao.some(
            (item) =>
              item.id_evento ===
              evento.id_evento
          );

        const isEdital =
          editais.some(
            (item) =>
              item.id_evento ===
              evento.id_evento
          );

        return (
          <EventCard
            key={evento.id_evento}
            evento={evento}
            isEmExibicao={isEmExibicao}
            isEdital={isEdital}
            isTooltipOpen={
              activeTooltipId ===
              evento.id_evento
            }
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            formatarData={formatarData}
          />
        );
      })}
    </div>
  );
}