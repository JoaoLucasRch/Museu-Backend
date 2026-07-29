import { Link } from "react-router-dom";

import styles from "./RegisterFooter.module.css";

export default function RegisterFooter() {
  return (
    <div className={styles.loginLink}>
      <span>
        Já possui uma conta?
      </span>

      {" "}

      <Link to="/login">
        Entrar
      </Link>
    </div>
  );
}