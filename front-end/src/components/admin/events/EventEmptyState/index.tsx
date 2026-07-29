import { CalendarX } from "lucide-react";

import styles from "./EventEmptyState.module.css";

interface Props {
  onCreate: () => void;
}

export default function EventEmptyState({
  onCreate,
}: Props) {

  return (
    <div className={styles.container}>

      <div className={styles.icon}>

        <CalendarX size={56} />

      </div>
      <h2>
        Nenhum evento encontrado
      </h2>

      <p>
        Você ainda não possui eventos cadastrados.
        Crie seu primeiro evento para começar.
      </p>

      <button
        onClick={onCreate}
        className={styles.button}
      >
        Criar evento
      </button>
    </div>
  );
}