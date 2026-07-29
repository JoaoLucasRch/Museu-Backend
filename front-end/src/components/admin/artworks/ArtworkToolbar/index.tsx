import { Search } from "lucide-react";

import styles from "./ArtworkToolbar.module.css";

type StatusFilter =
  | "todos"
  | "pendente"
  | "aprovada"
  | "rejeitada";

interface Props {
  searchTerm: string;

  statusFilter: StatusFilter;

  onSearchChange: (
    value: string
  ) => void;

  onStatusChange: (
    value: StatusFilter
  ) => void;
}

const filters: StatusFilter[] = [
  "todos",
  "pendente",
  "aprovada",
  "rejeitada",
];

export default function ArtworkToolbar({
  searchTerm,
  statusFilter,
  onSearchChange,
  onStatusChange,
}: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <Search
          size={18}
          className={styles.icon}
        />

        <input
          type="text"
          placeholder="Buscar obra..."
          value={searchTerm}
          onChange={(e) =>
            onSearchChange(e.target.value)
          }
        />
      </div>

      <div className={styles.filters}>
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() =>
              onStatusChange(filter)
            }
            className={`${styles.filterButton} ${
              statusFilter === filter
                ? styles.active
                : ""
            }`}
          >
            {filter.charAt(0).toUpperCase() +
              filter.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}