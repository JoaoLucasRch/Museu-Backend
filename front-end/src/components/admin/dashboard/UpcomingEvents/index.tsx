import {
  CalendarDays,
  ArrowRight,
} from "lucide-react";

import styles from "./UpcomingEvents.module.css";

export interface UpcomingEventItem {
  id: number;
  title: string;
  date: string;
}

interface Props {
  events: UpcomingEventItem[];
  onViewAll?: () => void;
}

export default function AdmUpcomingEvents({
  events,
  onViewAll,
}: Props) {

  return (
    <section className={styles.events}>

      <header className={styles.header}>

        <div>
          <h2>Próximos Eventos</h2>

          <span>
            Agenda dos próximos eventos do museu
          </span>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className={styles.viewAll}
        >
          Ver todos

          <ArrowRight size={14} />
        </button>

      </header>


      <div className={styles.list}>

        {
          events.length === 0 ? (

            <div className={styles.empty}>
              Nenhum evento programado.
            </div>

          ) : (

            events.map(event => (

              <article
                key={event.id}
                className={styles.item}
              >

                <div className={styles.icon}>
                  <CalendarDays size={17} />
                </div>


                <div className={styles.content}>

                  <strong title={event.title}>
                    {event.title}
                  </strong>

                  <span>
                    {new Date(event.date).toLocaleDateString(
                      "pt-BR",
                      {
                        weekday: "short",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </span>

                </div>

              </article>

            ))

          )
        }

      </div>

    </section>
  );
}