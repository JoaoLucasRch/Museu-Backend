import ParticipateButton from "@/components/home/ParticipateButton";

import Pintura from "../../../assets/Expose/pinturaManuel.jpg";
import Arara from "../../../assets/Expose/Arara.jpg";
import Onca from "../../../assets/Expose/Onca.jpg";

import styles from "./Expose.module.css";

const images = [
  Pintura,
  Arara,
  Onca
];

export default function Expose() {

  const handleParticipate = () => {
    console.log("Clicou em Quero Participar");
  };

  return (
    <section
      className={styles.exposeContainer}
      id="exposicoes"
    >

      <div className={styles.exposeTextContent}>

        <span className={styles.tag}>
          Para artistas e criadores
        </span>

        <h2>
          Sua arte pode
          <br />
          fazer parte do museu
        </h2>

        <p>
          O Exponha sua Arte é um espaço dedicado a novos
          artistas que desejam apresentar seus trabalhos,
          participar de exposições e conectar sua produção
          artística com a comunidade.
        </p>

        <div className={styles.features}>

          <div>
            <strong>Envie</strong>
            <span>suas obras</span>
          </div>

          <div>
            <strong>Participe</strong>
            <span>de exposições</span>
          </div>

          <div>
            <strong>Compartilhe</strong>
            <span>sua história</span>
          </div>

        </div>

        <div className={styles.ctaWrapper}>

          <ParticipateButton
            onClick={handleParticipate}
          />

        </div>

      </div>


      <div className={styles.exposeImagesWrapper}>

        <div className={styles.cardsDisplay}>

          {images.map((imgUrl, index) => (

            <div
              key={index}
              className={styles.artCard}
            >

              <img
                src={imgUrl}
                alt={`Obra artística ${index + 1}`}
              />

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}