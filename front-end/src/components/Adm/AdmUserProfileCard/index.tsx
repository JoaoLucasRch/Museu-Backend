import styles from "./AdmUserProfileCard.module.css";
import type { UserProfile } from "../../Profile/types/User";

interface UserProfileCardProps {
  user: UserProfile | null; 
  isLoading?: boolean;
  onEdit: () => void;
  onNewAdmin: () => void; // Reintroduzida a prop para abrir o modal de cadastro
}

export default function UserProfileCard({
  user,
  isLoading,
  onEdit,
  onNewAdmin,
}: UserProfileCardProps) {
  
  if (isLoading || !user) {
    return (
      <div className={styles.loadingContainer}>
        Carregando perfil...
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Título e Saudação FORA de retângulos */}
      <div className={styles.topSection}>
        <span className={styles.profileType}>Perfil Administrador</span>
        <h1 className={styles.greeting}>Olá, {user.nome}</h1>
      </div>

      {/* Informações e Botões de Ação */}
      <div className={styles.infoAndActionArea}>
        
        {/* Grupo de Botões (Editar e Novo Admin) */}
        <div className={styles.buttonGroup}>
          {/* Botão Novo Admin (Aparece apenas se a função for passada e o usuário for ADMIN) */}
          {user.role === "ADMIN" && (
            <button onClick={onNewAdmin} className={styles.newAdminButton}>
              <svg 
                className={styles.icon} 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="11" x2="20" y2="17" />
                <line x1="17" y1="14" x2="23" y2="14" />
              </svg>
              Novo Admin
            </button>
          )}

          {/* Botão de Editar Perfil */}
          <button onClick={onEdit} className={styles.editButton}>
            <svg 
              className={styles.icon} 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
            Editar Perfil
          </button>
        </div>
      </div>
    </div>
  );
}