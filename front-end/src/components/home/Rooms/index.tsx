import styles from "./Rooms.module.css";

const roomsData = [
  {
    id: 1,
    title: "Pinturas",
    description:
      "Uma sala que celebra artistas regionais, convidando o visitante a viajar por telas e técnicas que fizeram de Marabá uma referência nacional na arte em bico de pena (nanquim).",
    image: "https://picsum.photos/900/600?random=1",
  },
  {
    id: 2,
    title: "Marcos Regionais",
    description:
      "Essa sala apresenta os principais acontecimentos que marcaram a cidade, incluindo a primeira grande enchente de 1926.",
    image: "https://picsum.photos/900/600?random=2",
  },
  {
    id: 3,
    title: "Etnologia Indígena",
    description:
      "Esta seção exibe artefatos indígenas de etnias do Pará, especialmente das regiões próximas a Marabá.",
    image: "https://picsum.photos/900/600?random=3",
  },
  {
    id: 4,
    title: "Geologia",
    description:
      "Esta sala apresenta minerais e pedras preciosas de Marabá e a evolução da geologia na região. Ela também destaca a descoberta da mina de Carajás em 1967 pelo arqueólogo Breno Augusto dos Santos.",
    image: "https://picsum.photos/900/600?random=4",
  },
];

export default function Rooms() {
  return (
    <section
      id="salas"
      className={styles.roomsContainer}
    >
      <div className={styles.textHeader}>
        <h2>Salas em Destaque</h2>

        <p>Acompanhe algumas das salas presentes no museu.</p>
      </div>

      <div className={styles.carousel}>
        {roomsData.map((room) => (
          <article
            key={room.id}
            className={styles.roomCard}
          >
            <img
              src={room.image}
              alt={room.title}
            />

            <div className={styles.overlay}>
              <h3>{room.title}</h3>
            </div>

            <div className={styles.description}>
              <p>{room.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}