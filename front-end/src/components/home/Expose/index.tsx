import FotoAmbiente from "../../../assets/Expose/IMG_0071.jpg";
import PinturaRecortada from "../../../assets/Expose/pinturaManuel.png";
import styles from "./Expose.module.css";
import { Link } from "react-router-dom";

export default function Expose() {
  const handleParticipate = () => {
    console.log("Clicou em Quero Participar");
  };

  return (
    <section className={styles.exposeSection} id="exposicoes">
      {/* Texto */}
      <div className={styles.contentWrapper}>
        <span className={styles.tag}>Para artistas e criadores</span>

        <h2 className={styles.title}>
          Sua arte pode
          <br />
          fazer parte do
          <br />
          museu
        </h2>

        <p className={styles.description}>
          O Exponha sua Arte é um espaço dedicado a novos artistas que desejam
          apresentar seus trabalhos, participar de exposições e conectar sua
          produção artística com a comunidade.
        </p>

        <Link to="/saiba-mais" className={styles.learnMore}>
          Saiba mais
          </Link>

        <div>
          <button className={styles.participateBtn} onClick={() => window.location.href = "/login"}>
            <span>Participar</span>
          </button>
        </div>
      </div>

      {/* Container de imagem com alinhamento gêmeo */}
      <div className={styles.imageStage}>
        {/* 1. Camada do fundo com o recorte chanfrado */}
        <img
          src={FotoAmbiente}
          alt="Cenário do museu"
          className={`${styles.layer} ${styles.bgClipped}`}
        />

        {/* 2. Camada da pintura recortada (sem corte, alinhada 1:1) */}
        <img
          src={PinturaRecortada}
          alt="Pintura Manuel sobreposta"
          className={`${styles.layer} ${styles.easelPopout}`}
        />
      </div>
    </section>
  );
}