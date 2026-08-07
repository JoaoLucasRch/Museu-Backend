import styles from "./ArtworkEmptyState.module.css";

interface Props {
  loading?: boolean;

  error?: string | null;

  message?: string;

  onRetry?: () => void;
}



export default function ArtworkEmptyState({
  loading,
  error,
  message,
  onRetry,
}: Props) {

  if (loading) {
    return (
      <div className={styles.emptyDashboard}>
        <p>Carregando obras...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.emptyDashboard}>

        <h3>Erro ao carregar obras</h3>

        <p>{error}</p>

        {onRetry && (
          <button
            className={styles.retryButton}
            onClick={onRetry}
          >
            Tentar novamente
          </button>
        )}

      </div>
    );
  }

  return (
    <div className={styles.emptyDashboard}>

      <h3>Nenhuma obra encontrada</h3>

      <p>
        {message ??
          "Ainda não há obras cadastradas."}
      </p>

    </div>
  );
}