import styles from "./SlideButton.module.css";

interface SlideButtonProps {
  direction: "left" | "right";
  onClick: () => void;
}

export default function SlideButton({
  direction,
  onClick,
}: SlideButtonProps) {
  const isLeft = direction === "left";

  return (
    <button
      className={styles.slideBtn}
      onClick={onClick}
      aria-label={isLeft ? "Anterior" : "Próximo"}
    >
      {isLeft ? (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      ) : (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      )}
    </button>
  );
}