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
      "Uma sala que celebra artistas regionais, convidando o visitante a conhecer diferentes telas e técnicas presentes no acervo do museu.",
    image:
      "https://picsum.photos/900/600?random=1",
  },

  {
    id: 2,
    slug: "marcos-regionais",
    title: "Marcos Regionais",
    description:
      "Esta sala apresenta acontecimentos e objetos relacionados à história e à formação da cidade de Marabá.",
    image:
      "https://picsum.photos/900/600?random=2",
  },

  {
    id: 3,
    slug: "etnologia-indigena",
    title: "Etnologia Indígena",
    description:
      "Esta seção apresenta artefatos e elementos culturais relacionados aos povos indígenas da região.",
    image:
      "https://picsum.photos/900/600?random=3",
  },

  {
    id: 4,
    slug: "geologia",
    title: "Geologia",
    description:
      "A sala apresenta minerais, rochas e elementos relacionados à formação geológica e à exploração mineral da região.",
    image:
      "https://picsum.photos/900/600?random=4",
  },

  {
    id: 5,
    slug: "memoria-de-maraba",
    title: "Memória de Marabá",
    description:
      "Um espaço dedicado às memórias, fotografias e objetos que ajudam a contar diferentes momentos da história de Marabá.",
    image:
      "https://picsum.photos/900/600?random=5",
  },
];

export function getRoomBySlug(
  slug: string
): Room | undefined {
  return roomsData.find(
    (room) => room.slug === slug
  );
}