import styles from "./LoginActions.module.css";

interface Props {
  isSubmitting: boolean;
  isGoogleLoading: boolean;
}

export default function LoginActions({
  isSubmitting,
  isGoogleLoading,
}: Props) {
  return (
    <div className={styles.actions}>
      <button
        type="submit"
        className={styles.submitButton}
        disabled={
          isSubmitting ||
          isGoogleLoading
        }
      >
        {isSubmitting
          ? "Entrando..."
          : "Entrar"}
      </button>
    </div>
  );
}