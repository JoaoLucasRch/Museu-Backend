import EventRow from "@/components/admin/events/EventRow";
import type { Event } from "@/types/Event";
import styles from "./EventList.module.css";

interface Props {
  events: Event[];
  onView: (event: Event) => void;
}

export default function EventList({
  events,
  onView,
}: Props) {
  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>
            Eventos cadastrados
          </h2>

          <p className={styles.subtitle}>
            {events.length}{" "}
            {events.length === 1
              ? "evento cadastrado"
              : "eventos cadastrados"}
          </p>
        </div>
      </header>

      <div className={styles.body}>
        {events.map((event) => (
          <EventRow
            key={event.id_evento}
            event={event}
            onView={() => onView(event)}
          />
        ))}
      </div>
    </section>
  );
}