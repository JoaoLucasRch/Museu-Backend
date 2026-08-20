export interface Room {
  id: number;
  slug: string;
  title: string;
  description: string;
  image: string;
}

export const roomsData: Room[] = [
  {
    id: 1,
    slug: "pinturas",
    title: "Pinturas",
    description:
      "Uma sala que celebra artistas regionais, convidando o visitante a viajar por telas e técnicas que fizeram de Marabá uma referência nacional na arte em bico de pena (nanquim).",
    image: "https://picsum.photos/900/600?random=1",
  },

  {
    id: 2,
    slug: "marcos-regionais",
    title: "Marcos Regionais",
    description:
      "Essa sala apresenta os principais acontecimentos que marcaram a cidade, incluindo a primeira grande enchente de 1926.",
    image: "https://picsum.photos/900/600?random=2",
  },

  {
    id: 3,
    slug: "etnologia-indigena",
    title: "Etnologia Indígena",
    description:
      "Esta seção exibe artefatos indígenas de etnias do Pará, especialmente das regiões próximas a Marabá.",
    image: "https://picsum.photos/900/600?random=3",
  },

  {
    id: 4,
    slug: "geologia",
    title: "Geologia",
    description:
      "Esta sala apresenta minerais e pedras preciosas de Marabá e a evolução da geologia na região. Ela também destaca a descoberta da mina de Carajás em 1967 pelo arqueólogo Breno Augusto dos Santos.",
    image: "https://picsum.photos/900/600?random=4",
  },
];