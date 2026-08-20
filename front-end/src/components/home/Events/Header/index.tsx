import styles from "./Header.module.css";

export default function EventsHeader() {
  return (
    <header className={styles.header}>
      <span className={styles.label}>
        Agenda Cultural
      </span>

      <h1 className={styles.title}>
        Eventos
      </h1>

      <p className={styles.subtitle}>
        Confira exposições, atividades e experiências culturais
        que acontecem no Museu Municipal Francisco Coelho.
      </p>
    </header>
  );
}