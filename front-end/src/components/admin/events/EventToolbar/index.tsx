import {
  Search,
  Plus,
  Filter,
} from "lucide-react";

import styles from "./EventToolbar.module.css";

interface Props {
  search: string;
  onSearchChange: (
    value: string
  ) => void;

  status: string;
  onStatusChange: (
    value: string
  ) => void;

  onCreate: () => void;
}

export default function EventToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  onCreate,
}: Props) {
  return (
    <div className={styles.container}>

      <div className={styles.header}>

        <div>
          <h1 className={styles.title}>
            Eventos
          </h1>

          <p className={styles.subtitle}>
              Cadastre, acompanhe e gerencie a programação do museu.
          </p>
        </div>

        <button
          className={styles.createButton}
          onClick={onCreate}
        >
          <Plus size={18} />

          Novo Evento
        </button>

      </div>

      <div className={styles.filters}>

        <div className={styles.searchBox}>

          <Search size={18} />

          <input
            type="text"
            placeholder="Buscar eventos e editais..."
            value={search}
            onChange={(e) =>
              onSearchChange(
                e.target.value
              )
            }
          />

        </div>

        <div className={styles.selectWrapper}>

          <Filter size={16} />

          <select
            value={status}
            onChange={(e) =>
              onStatusChange(
                e.target.value
              )
            }
          >
            <option value="">
              Todos
            </option>

            <option value="ATIVO">
              Ativos
            </option>

            <option value="RASCUNHO">
              Rascunhos
            </option>

            <option value="ENCERRADO">
              Encerrados
            </option>
          </select>

        </div>

      </div>

    </div>
  );
}