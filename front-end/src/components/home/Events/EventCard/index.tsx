import {
  CalendarDays,
  MapPin,
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
  isTooltipOpen,
  onClick,
  onMouseEnter,
  onMouseLeave,
  formatarData,
}: Props) {


  function getStatusLabel() {

    if (isEdital)
      return "Edital aberto";

    if (isEmExibicao)
      return "Em exibição";

    return "Em breve";
  }


  function getStatusClass() {

    if (isEdital)
      return styles.edital;

    if (isEmExibicao)
      return styles.status;

    return `${styles.status} ${styles.breve}`;
  }


  return (

    <article
      className={`
        ${styles.card}
        ${isTooltipOpen ? styles.open : ""}
      `}
      onMouseEnter={() =>
        onMouseEnter(evento.id_evento)
      }
      onMouseLeave={onMouseLeave}
      onClick={() =>
        onClick(evento)
      }
    >

      <div className={styles.imageContainer}>

        {
          evento.imagem_evento ? (

            <img
              src={evento.imagem_evento}
              alt={evento.titulo_evento}
              className={styles.image}
            />

          ) : (

            <div className={styles.placeholder}>
              Cultura
            </div>

          )
        }


        <span className={getStatusClass()}>
          {getStatusLabel()}
        </span>


        <div className={styles.gradient}/>


        <div className={styles.titleOverlay}>

          <h3>
            {evento.titulo_evento}
          </h3>

        </div>

      </div>


      <aside className={styles.details}>

        <div className={styles.detailsContent}>

          <h4>
            {evento.titulo_evento}
          </h4>


          <div className={styles.info}>

            <span>
              <MapPin size={16}/>
              {evento.local_evento}
            </span>


            <span>
              <CalendarDays size={16}/>
              {formatarData(
                evento.data_hora_inicio
              )}
            </span>

          </div>


          <p>
            {evento.descricao_evento ||
              "Confira mais informações sobre este evento."}
          </p>


          <button
            className={styles.viewButton}
            type="button"
          >
            Ver detalhes
          </button>

        </div>

      </aside>


    </article>
  );
}