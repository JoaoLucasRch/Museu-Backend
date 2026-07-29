import { Link,} from "react-router-dom";
import styles from "./LoginFooter.module.css";

export default function LoginFooter(){

  return (
    <div className={styles.loginLink}>
      <span>
        Não tem uma conta?
      </span>
      {" "}
      <Link to="/register">
        Cadastre-se
      </Link>
    </div>
  );
}