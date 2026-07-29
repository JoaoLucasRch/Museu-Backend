import styles from "./Loading.module.css";


export default function Loading() {

  return (

    <section
      id="eventos"
      className={styles.loadingSection}
    >

      <div className={styles.container}>

        <div className={styles.loadingContainer}>

          <div
            className="spinner-border text-primary"
            role="status"
          >

            <span className="visually-hidden">
              Carregando...
            </span>

          </div>

        </div>

      </div>

    </section>

  );

}