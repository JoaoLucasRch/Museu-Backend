import styles from "./UserList.module.css";

import type { UserProfile } from "@/types/User";

import UserRow from "@/components/admin/users/UserRow";

interface Props {
  users: UserProfile[];

  searchTerm: string;

  roleFilter: string;

  onClearFilters: () => void;

  onUserClick: (
    user: UserProfile
  ) => void;
}

export default function UserGrid({
  users,
  searchTerm,
  roleFilter,
  onClearFilters,
  onUserClick,
}: Props) {

  if (users.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>
          {searchTerm || roleFilter !== "todos"
            ? "Nenhum usuário encontrado."
            : "Nenhum usuário cadastrado."}
        </p>

        {(searchTerm || roleFilter !== "todos") && (
          <button
            className={styles.clearButton}
            onClick={onClearFilters}
          >
            Limpar filtros
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={styles.table}>

      <div className={styles.header}>
        <span>Nome</span>

        <span>Email</span>

        <span>Tipo</span>

        <span>Status</span>

        <span></span>
      </div>

      <div className={styles.body}>
        {users.map((user) => (
          <UserRow
            key={user.id}
            user={user}
            onClick={onUserClick}
          />
        ))}
      </div>

    </div>
  );
}