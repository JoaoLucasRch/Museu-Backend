import { ArrowLeft } from "lucide-react";
import styles from "./RegisterActions.module.css";

interface Props {
  onBack: () => void;
}

export default function RegisterActions({
  onBack,
}: Props) {
  return (
    <button
      type="button"
      className={styles.backButton}
      onClick={onBack}
    >
      <ArrowLeft size={18} />
      Voltar ao site
    </button>
  );
}