import { Search } from "lucide-react";

import styles from "./UserToolbar.module.css";

export type RoleFilter =
  | "todos"
  | "ADMIN"
  | "ARTISTA";

interface Props {
  searchTerm: string;

  roleFilter: RoleFilter;

  onSearchChange: (
    value: string
  ) => void;

  onRoleChange: (
    value: RoleFilter
  ) => void;
}

const filters: RoleFilter[] = [
  "todos",
  "ADMIN",
  "ARTISTA",
];

export default function UserToolbar({
  searchTerm,
  roleFilter,
  onSearchChange,
  onRoleChange,
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
          placeholder="Buscar usuários..."
          value={searchTerm}
          onChange={(e) =>
            onSearchChange(
              e.target.value
            )
          }
        />
      </div>

      <div className={styles.filters}>
        {filters.map((filter) => (
          <button
            key={filter}
            className={`${styles.filterButton} ${
              roleFilter === filter
                ? styles.active
                : ""
            }`}
            onClick={() =>
              onRoleChange(filter)
            }
          >
            {filter === "todos"
              ? "Todos"
              : filter}
          </button>
        ))}
      </div>
    </div>
  );
}