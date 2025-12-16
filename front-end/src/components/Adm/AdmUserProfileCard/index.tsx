import styles from "./AdmUserProfileCard.module.css";
import type { UserProfile } from "../../Profile/types/User";

interface UserProfileCardProps {
  user: UserProfile | null; 
  isLoading?: boolean;
  onEdit: () => void;
  onNewAdmin?: () => void; // Nova prop para abrir o formulário de cadastro
}

export default function UserProfileCard({
  user,
  isLoading,
  onEdit,
  onNewAdmin,
}: UserProfileCardProps) {
  // Estado de carregamento
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
          <p className={styles.bio}>{user.bio || ""}</p>
        </div>
      </div>
      
      <div className={styles.buttonGroup}>
        <button onClick={onEdit} className={styles.editButton}>
          Editar Perfil
        </button>
        {user.role === 'ADMIN' && onNewAdmin && (
          <button onClick={onNewAdmin} className={styles.newAdminButton}>
            Novo Admin
          </button>
        )}
      </div>
    </div>
  );
}