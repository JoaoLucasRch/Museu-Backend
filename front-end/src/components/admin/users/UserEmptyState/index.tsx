import styles from "./UserEmptyState.module.css";

interface Props {
  loading?: boolean;

  error?: string | null;

  hasUsers?: boolean;

  message?: string;

  onRetry?: () => void;

  onReload?: () => void;
}

export default function UserEmptyState({
  loading,
  error,
  hasUsers,
  message,
  onRetry,
  onReload,
}: Props) {

  if (loading) {
    return (
      <div className={styles.container}>
        <p>
          Carregando usuários...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h3>
          Erro ao carregar usuários
        </h3>

        <p>{error}</p>

        {onRetry && (
          <button
            className={styles.button}
            onClick={onRetry}
          >
            Tentar novamente
          </button>
        )}
      </div>
    );
  }

  if (hasUsers) {
    return null;
  }

  return (
    <div className={styles.container}>
      <h3>
        Nenhum usuário encontrado
      </h3>

      <p>
        {message ??
          "Ainda não há usuários cadastrados."}
      </p>

      {onReload && (
        <button
          className={styles.button}
          onClick={onReload}
        >
          Atualizar
        </button>
      )}
    </div>
  );
}