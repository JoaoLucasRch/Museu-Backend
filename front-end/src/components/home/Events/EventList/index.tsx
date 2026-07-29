import EventCard from "../EventCard";

import type { Event } from "@/types/Event";


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
}


export default function EventList({
  eventos,
  eventosEmExibicao,
  editais,
  activeTooltipId,
  onClick,
  onMouseEnter,
  onMouseLeave,
  formatarData,
}: Props) {

  return (
    <>
      {eventos.map((evento) => {

        const isEmExibicao =
          eventosEmExibicao.some(
            (item) =>
              item.id_evento === evento.id_evento
          );


        const isEdital =
          editais.some(
            (item) =>
              item.id_evento === evento.id_evento
          );


        return (
          <EventCard
            key={evento.id_evento}

            evento={evento}

            isEmExibicao={
              isEmExibicao
            }

            isEdital={
              isEdital
            }

            isTooltipOpen={
              activeTooltipId === evento.id_evento
            }

            onClick={
              onClick
            }

            onMouseEnter={
              onMouseEnter
            }

            onMouseLeave={
              onMouseLeave
            }

            formatarData={
              formatarData
            }
          />
        );
      })}
    </>
  );
}