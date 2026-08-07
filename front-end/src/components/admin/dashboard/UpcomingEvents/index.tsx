import {
  CalendarDays,
  ArrowRight,
  CalendarX2,
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

/**
 * Faz o parse da data sem sofrer alterações
 * indesejadas de fuso horário.
 */
function parseEventDate(dateString: string) {
  const [year, month, day] = dateString
    .split("T")[0]
    .split("-")
    .map(Number);

  const date = new Date(year, month - 1, day);

  const dayNumber = date
    .getDate()
    .toString()
    .padStart(2, "0");

  const monthName = date
    .toLocaleDateString("pt-BR", {
      month: "short",
    })
    .replace(".", "")
    .toUpperCase();

  const weekDay = date.toLocaleDateString("pt-BR", {
    weekday: "long",
  });

  return {
    dayNumber,
    monthName,
    weekDay,
  };
}

export default function AdmUpcomingEvents({
  events = [],
  onViewAll,
}: Props) {
  return (
    <section className={styles.eventsCard}>
      <header className={styles.header}>
        <div className={styles.titleBadge}>
          <div className={styles.calendarIconWrapper}>
            <CalendarDays
              size={18}
              strokeWidth={2.1}
            />
          </div>

          <div>
            <h2 className={styles.title}>
              Próximos Eventos
            </h2>

            <p className={styles.subtitle}>
              Agenda cultural do museu
            </p>
          </div>
        </div>

        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className={styles.viewAllBtn}
            aria-label="Ver todos os eventos"
          >
            <span>Ver todos</span>

            <ArrowRight
              size={14}
              className={styles.arrowIcon}
            />
          </button>
        )}
      </header>

      {events.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIconWrapper}>
            <CalendarX2
              size={22}
              strokeWidth={1.8}
            />
          </div>

          <div className={styles.emptyContent}>
            <strong>Nenhum evento programado</strong>
            <span>
              Os próximos eventos aparecerão aqui.
            </span>
          </div>
        </div>
      ) : (
        <div className={styles.list}>
          {events.map((event, index) => {
            const {
              dayNumber,
              monthName,
              weekDay,
            } = parseEventDate(event.date);

            return (
              <article
                key={event.id}
                className={styles.item}
                style={
                  {
                    "--item-index": index,
                  } as React.CSSProperties
                }
              >
                <div className={styles.dateBadge}>
                  <div className={styles.dateHeader}>
                    {monthName}
                  </div>

                  <div className={styles.dateBody}>
                    <span className={styles.day}>
                      {dayNumber}
                    </span>
                  </div>

                  <span className={styles.dateGlow} />
                </div>

                <div className={styles.content}>
                  <h3 className={styles.eventTitle}>
                    {event.title}
                  </h3>

                  <div className={styles.eventMeta}>
                    <CalendarDays
                      size={13}
                      className={styles.metaIcon}
                    />

                    <time dateTime={event.date}>
                      {weekDay}
                    </time>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
