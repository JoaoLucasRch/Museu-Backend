import styles from "./Header.module.css";

export default function EventsHeader() {
  return (
    <div className={styles.header}>

      <span className={styles.label}>
        Agenda Cultural
      </span>

      <h2 className={styles.title}>
        Eventos
      </h2>

      <p className={styles.subtitle}>
        Confira exposições, atividades e experiências culturais
        que acontecem no Museu Municipal Francisco Coelho.
      </p>

    </div>
  );
}