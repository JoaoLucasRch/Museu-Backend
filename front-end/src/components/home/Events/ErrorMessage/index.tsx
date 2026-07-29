import styles from "./ErrorMessage.module.css";

interface Props {
  error: string;
  onRetry: () => void;
}

export default function ErrorMessage({
  error,
  onRetry,
}: Props) {
  return (
    <div className={styles.errorContainer}>
      <div
        className="alert alert-warning"
        role="alert"
      >
        {error}

        <button
          className="btn btn-sm btn-outline-primary ms-2"
          onClick={onRetry}
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}