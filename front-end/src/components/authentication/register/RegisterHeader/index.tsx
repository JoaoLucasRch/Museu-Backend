import styles from "./RegisterHeader.module.css";

export default function RegisterHeader() {
  return (
    <header className={styles.header}>
      <h2 className={styles.title}>
        Criar conta
      </h2>

      <p className={styles.subtitle}>
        Cadastre-se para enviar obras e participar dos editais do Museu Francisco Coelho.
      </p>
    </header>
  );
}