export interface Artwork {
  id: number;
  roomSlug: string;
  title: string;
  artist: string;
  year: string;
  image: string;
  description: string;
}

export const artworksData: Artwork[] = [
  {
    id: 1,
    roomSlug: "pinturas",
    title: "Paisagem de Marabá",
    artist: "Artista Regional",
    year: "1985",
    image: "https://picsum.photos/700/500?random=11",
    description:
      "Obra que representa aspectos da paisagem e da identidade visual da região de Marabá.",
  },

  {
    id: 2,
    roomSlug: "pinturas",
    title: "Memórias do Rio",
    artist: "Artista Regional",
    year: "1992",
    image: "https://picsum.photos/700/500?random=12",
    description:
      "Pintura inspirada na relação entre a população de Marabá e os rios que atravessam a região.",
  },

  {
    id: 3,
    roomSlug: "pinturas",
    title: "Cores da Amazônia",
    artist: "Artista Paraense",
    year: "2001",
    image: "https://picsum.photos/700/500?random=13",
    description:
      "Composição que explora cores, formas e elementos associados à paisagem amazônica.",
  },

  {
    id: 4,
    roomSlug: "pinturas",
    title: "Retratos Regionais",
    artist: "Artista Paraense",
    year: "2008",
    image: "https://picsum.photos/700/500?random=14",
    description:
      "Obra dedicada à representação de personagens e aspectos da cultura regional.",
  },

  {
    id: 5,
    roomSlug: "marcos-regionais",
    title: "A Grande Enchente",
    artist: "Acervo Histórico",
    year: "1926",
    image: "https://picsum.photos/700/500?random=15",
    description:
      "Registro histórico relacionado à grande enchente que marcou a história de Marabá.",
  },

  {
    id: 6,
    roomSlug: "marcos-regionais",
    title: "Marabá Antiga",
    artist: "Acervo Histórico",
    year: "Década de 1950",
    image: "https://picsum.photos/700/500?random=16",
    description:
      "Registro que apresenta aspectos da cidade de Marabá em seus primeiros períodos de desenvolvimento urbano.",
  },

  {
    id: 7,
    roomSlug: "etnologia-indigena",
    title: "Artefato Indígena",
    artist: "Acervo Etnológico",
    year: "Século XX",
    image: "https://picsum.photos/700/500?random=17",
    description:
      "Artefato relacionado às tradições e práticas culturais de povos indígenas da região.",
  },

  {
    id: 8,
    roomSlug: "etnologia-indigena",
    title: "Objetos Tradicionais",
    artist: "Acervo Etnológico",
    year: "Século XX",
    image: "https://picsum.photos/700/500?random=18",
    description:
      "Conjunto de objetos que representa práticas tradicionais de comunidades indígenas do Pará.",
  },

  {
    id: 9,
    roomSlug: "geologia",
    title: "Minerais de Carajás",
    artist: "Acervo Geológico",
    year: "1967",
    image: "https://picsum.photos/700/500?random=19",
    description:
      "Amostra relacionada à riqueza mineral da região de Carajás e à importância da mineração para a história regional.",
  },

  {
    id: 10,
    roomSlug: "geologia",
    title: "Formações Rochosas",
    artist: "Acervo Geológico",
    year: "Século XX",
    image: "https://picsum.photos/700/500?random=20",
    description:
      "Exemplo de formação rochosa encontrada na região amazônica e apresentada no acervo do museu.",
  },
];
