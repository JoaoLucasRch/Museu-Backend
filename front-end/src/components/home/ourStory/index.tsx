import styles from "./OurStory.module.css";

import Museu2020 from "../../../assets/Museum/museu2020.png";
import Museu2022 from "../../../assets/Museum/museu2022.png";
import Museu2025 from "../../../assets/Museum/museu2025.png";

const historyData = [
  {
    year: "2020",
    title: "O nascimento do museu",
    text: "O Museu Municipal Francisco Coelho é inaugurado no antigo Palacete Augusto Dias, preservando a memória e a identidade cultural de Marabá.",
    image: Museu2020,
  },
  {
    year: "2022",
    title: "Cultura em movimento",
    text: "O primeiro Giro Cultural aproxima o museu da comunidade, celebrando manifestações culturais e histórias da região.",
    image: Museu2022,
  },
  {
    year: "2025",
    title: "Um espaço vivo",
    text: "O museu continua criando conexões através de exposições, ações culturais e novas formas de valorizar a arte local.",
    image: Museu2025,
  },
];


function OurStory() {

  return (

    <section className={styles.storyContainer}>

      <div className={styles.textSection}>

        <span className={styles.tag}>
          Memória e Cultura
        </span>

        <h2>
          Nossa História
        </h2>

        <p>
          Mais do que um espaço de exposição, o Museu Municipal
          Francisco Coelho guarda histórias, preserva memórias e
          aproxima a comunidade da cultura de Marabá.
        </p>

      </div>


      <div className={styles.cardsSection}>

        {historyData.map((item) => (

          <article
            key={item.year}
            className={styles.card}
            style={{
              backgroundImage:`url(${item.image})`,
            }}
          >

            <div className={styles.overlay} />

            <div className={styles.cardContent}>

              <span className={styles.year}>
                {item.year}
              </span>

              <h3>
                {item.title}
              </h3>

              <p>
                {item.text}
              </p>

            </div>

          </article>

        ))}

      </div>

    </section>

  );
}

export default OurStory;