import styles from "./LoginHeader.module.css";

interface Props {
  title?: string;
  subtitle?: string;
}

export default function LoginHeader({
  title = "Login",
  subtitle = "Conecte-se para aproveitar a experiência completa!",
}: Props) {
  return (
    <div className={styles.header}>
      <h2 className={styles.title}>
        {title}
      </h2>

      <p className={styles.subtitle}>
        {subtitle}
      </p>
    </div>
  );
}