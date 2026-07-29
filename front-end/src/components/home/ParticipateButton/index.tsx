import { useNavigate } from "react-router-dom";
import styles from "./ParticipateButton.module.css";

interface ParticipateButtonProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  text?: string;
}

export default function ParticipateButton({
  onClick,
  text = "Quero Participar",
}: ParticipateButtonProps) {
  const navigate = useNavigate();

  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    onClick?.(e);
    navigate("/login");
  };

  return (
    <button
      className={styles.participateBtn}
      onClick={handleClick}
    >
      <span className={styles.btnText}>
        {text}
      </span>

      <svg
        className={styles.btnIcon}
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  );
}