import EventRow from "@/components/admin/events/EventRow";

import type { Event } from "@/types/Event";

import styles from "./EventList.module.css";

interface Props {
  events: Event[];

  onView: (event: Event) => void;

  onEdit: (event: Event) => void;

  onDelete: (event: Event) => void;
}

export default function EventList({
  events,
  onView,
  onEdit,
  onDelete,
}: Props) {
  return (
    <section className={styles.container}>

      <div className={styles.header}>

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

      </div>

      <div className={styles.body}>

        {events.map((event) => (
          <EventRow
            key={event.id_evento}
            event={event}
            onView={() => onView(event)}
            onEdit={() => onEdit(event)}
            onDelete={() => onDelete(event)}
          />
        ))}

      </div>

    </section>
  );
}