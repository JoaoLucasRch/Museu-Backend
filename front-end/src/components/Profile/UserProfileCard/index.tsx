// src/components/dashboard/UserProfileCard/index.tsx
import styles from "./UserProfileCard.module.css";
import type { UserProfile } from "../types/User";

interface UserProfileCardProps {
  user: UserProfile | null; // Pode ser null enquanto carrega
  isLoading?: boolean;
  onEdit: () => void;
}

export default function UserProfileCard({
  user,
  isLoading,
  onEdit,
}: UserProfileCardProps) {
  // Estado de carregamento (Skeleton simples)
  if (isLoading || !user) {
    return (
      <div
        className={styles.card}
        style={{ justifyContent: "center", color: "#888" }}
      >
        Carregando perfil...
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.leftSection}>
        <img
          src={user.foto || "https://via.placeholder.com/150"}
          alt={`Foto de ${user.nome}`}
          className={styles.avatar}
        />

        <div className={styles.info}>
          <h2 className={styles.name}>{user.nome}</h2>
          <p className={styles.email}>{user.email}</p>
          <p className={styles.bio}>{user.bio || "Sem biografia definida."}</p>
        </div>
      </div>

      <button onClick={onEdit} className={styles.editButton}>
        Editar Perfil
      </button>
    </div>
  );
}
