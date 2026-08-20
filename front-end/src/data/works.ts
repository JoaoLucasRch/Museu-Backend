export interface Work {
  id: number;
  roomSlug: string;
  title: string;
  image: string;
  description: string;
  author: string;
  year: string;
  category: string;
}

export const worksData: Work[] = [
  // =========================================================
  // PINTURAS
  // =========================================================

  {
    id: 1,
    roomSlug: "pinturas",
    title: "Paisagem de Marabá",
    image: "https://picsum.photos/900/700?random=11",
    description:
      "Obra que representa uma paisagem característica da região de Marabá, destacando elementos naturais e urbanos presentes na identidade da cidade.",
    author: "Artista regional",
    year: "1985",
    category: "Paisagens",
  },

  {
    id: 2,
    roomSlug: "pinturas",
    title: "Rio Tocantins",
    image: "https://picsum.photos/900/700?random=12",
    description:
      "Representação artística do Rio Tocantins e de sua importância para a formação histórica e cultural da região.",
    author: "João da Silva",
    year: "1992",
    category: "Paisagens",
  },

  {
    id: 3,
    roomSlug: "pinturas",
    title: "Memórias da Cidade",
    image: "https://picsum.photos/900/700?random=13",
    description:
      "Pintura inspirada em elementos históricos e cotidianos da cidade de Marabá.",
    author: "Maria Santos",
    year: "2001",
    category: "História",
  },

  {
    id: 4,
    roomSlug: "pinturas",
    title: "Cores do Tocantins",
    image: "https://picsum.photos/900/700?random=14",
    description:
      "Composição que explora as cores e paisagens encontradas ao longo das margens do Rio Tocantins.",
    author: "Carlos Oliveira",
    year: "1998",
    category: "Paisagens",
  },

  {
    id: 5,
    roomSlug: "pinturas",
    title: "Vida Ribeirinha",
    image: "https://picsum.photos/900/700?random=15",
    description:
      "Obra dedicada ao cotidiano das comunidades ribeirinhas e à relação entre população, rio e território.",
    author: "Ana Rodrigues",
    year: "2007",
    category: "Cotidiano",
  },

  {
    id: 6,
    roomSlug: "pinturas",
    title: "Retrato de uma Época",
    image: "https://picsum.photos/900/700?random=16",
    description:
      "Pintura que busca preservar visualmente aspectos da sociedade e da vida urbana regional em determinado período.",
    author: "Acervo do museu",
    year: "1978",
    category: "Retratos",
  },

  // =========================================================
  // MARCOS REGIONAIS
  // =========================================================

  {
    id: 7,
    roomSlug: "marcos-regionais",
    title: "A Grande Enchente",
    image: "https://picsum.photos/900/700?random=17",
    description:
      "Registro relacionado às grandes enchentes que marcaram a história de Marabá e transformaram a dinâmica da cidade.",
    author: "Acervo histórico",
    year: "1926",
    category: "História",
  },

  {
    id: 8,
    roomSlug: "marcos-regionais",
    title: "Marabá Antiga",
    image: "https://picsum.photos/900/700?random=18",
    description:
      "Imagem que apresenta aspectos da formação urbana de Marabá em seus primeiros períodos de desenvolvimento.",
    author: "Acervo histórico",
    year: "Século XX",
    category: "Fotografia",
  },

  {
    id: 9,
    roomSlug: "marcos-regionais",
    title: "Memória Regional",
    image: "https://picsum.photos/900/700?random=19",
    description:
      "Objeto representativo da memória e da história da região sudeste do Pará.",
    author: "Acervo do museu",
    year: "1970",
    category: "História",
  },

  {
    id: 10,
    roomSlug: "marcos-regionais",
    title: "Primeiros Caminhos",
    image: "https://picsum.photos/900/700?random=20",
    description:
      "Registro relacionado aos caminhos e meios de deslocamento utilizados durante os primeiros períodos de desenvolvimento regional.",
    author: "Acervo histórico",
    year: "1945",
    category: "História",
  },

  {
    id: 11,
    roomSlug: "marcos-regionais",
    title: "Centro de Marabá",
    image: "https://picsum.photos/900/700?random=21",
    description:
      "Fotografia que apresenta uma perspectiva do centro urbano de Marabá durante o processo de crescimento da cidade.",
    author: "Acervo fotográfico",
    year: "1962",
    category: "Fotografia",
  },

  {
    id: 12,
    roomSlug: "marcos-regionais",
    title: "Trabalho e Região",
    image: "https://picsum.photos/900/700?random=22",
    description:
      "Registro sobre atividades econômicas que contribuíram para a formação e transformação da região.",
    author: "Acervo do museu",
    year: "1958",
    category: "Cotidiano",
  },

  // =========================================================
  // ETNOLOGIA INDÍGENA
  // =========================================================

  {
    id: 13,
    roomSlug: "etnologia-indigena",
    title: "Artefato Indígena",
    image: "https://picsum.photos/900/700?random=23",
    description:
      "Artefato relacionado às tradições e aos modos de vida de povos indígenas da região.",
    author: "Acervo indígena",
    year: "Século XX",
    category: "Artefatos",
  },

  {
    id: 14,
    roomSlug: "etnologia-indigena",
    title: "Cultura e Tradição",
    image: "https://picsum.photos/900/700?random=24",
    description:
      "Objeto que representa práticas culturais tradicionais preservadas por comunidades indígenas.",
    author: "Acervo do museu",
    year: "Século XX",
    category: "Cultura",
  },

  {
    id: 15,
    roomSlug: "etnologia-indigena",
    title: "Trançados Tradicionais",
    image: "https://picsum.photos/900/700?random=25",
    description:
      "Peça relacionada às técnicas tradicionais de trançado e produção artesanal presentes em comunidades indígenas.",
    author: "Acervo indígena",
    year: "Século XX",
    category: "Artesanato",
  },

  {
    id: 16,
    roomSlug: "etnologia-indigena",
    title: "Cerâmica Tradicional",
    image: "https://picsum.photos/900/700?random=26",
    description:
      "Peça de cerâmica que evidencia técnicas de produção e elementos culturais transmitidos entre gerações.",
    author: "Acervo indígena",
    year: "Século XX",
    category: "Artefatos",
  },

  {
    id: 17,
    roomSlug: "etnologia-indigena",
    title: "Grafismos e Identidade",
    image: "https://picsum.photos/900/700?random=27",
    description:
      "Registro dedicado aos grafismos tradicionais e à sua relação com identidade, memória e pertencimento cultural.",
    author: "Acervo do museu",
    year: "Século XX",
    category: "Cultura",
  },

  {
    id: 18,
    roomSlug: "etnologia-indigena",
    title: "Objetos do Cotidiano",
    image: "https://picsum.photos/900/700?random=28",
    description:
      "Conjunto representativo de objetos utilizados em atividades cotidianas e práticas tradicionais.",
    author: "Acervo indígena",
    year: "Século XX",
    category: "Cotidiano",
  },

  // =========================================================
  // GEOLOGIA
  // =========================================================

  {
    id: 19,
    roomSlug: "geologia",
    title: "Amostra Mineral",
    image: "https://picsum.photos/900/700?random=29",
    description:
      "Amostra mineral representativa da riqueza geológica encontrada na região sudeste do Pará.",
    author: "Acervo geológico",
    year: "1967",
    category: "Minerais",
  },

  {
    id: 20,
    roomSlug: "geologia",
    title: "Minério de Ferro",
    image: "https://picsum.photos/900/700?random=30",
    description:
      "Amostra relacionada à exploração mineral e à importância econômica da região de Carajás.",
    author: "Acervo geológico",
    year: "Século XX",
    category: "Minerais",
  },

  {
    id: 21,
    roomSlug: "geologia",
    title: "Formações Rochosas",
    image: "https://picsum.photos/900/700?random=31",
    description:
      "Exemplo de formação rochosa que contribui para o estudo da composição e da história geológica regional.",
    author: "Acervo geológico",
    year: "1975",
    category: "Rochas",
  },

  {
    id: 22,
    roomSlug: "geologia",
    title: "Cristais da Região",
    image: "https://picsum.photos/900/700?random=32",
    description:
      "Conjunto de cristais utilizado para apresentar diferentes características minerais encontradas no território paraense.",
    author: "Acervo geológico",
    year: "1982",
    category: "Minerais",
  },

  {
    id: 23,
    roomSlug: "geologia",
    title: "Solo e Território",
    image: "https://picsum.photos/900/700?random=33",
    description:
      "Amostra utilizada para demonstrar características do solo e sua relação com a formação do território regional.",
    author: "Acervo geológico",
    year: "1990",
    category: "Geologia",
  },

  {
    id: 24,
    roomSlug: "geologia",
    title: "Riquezas de Carajás",
    image: "https://picsum.photos/900/700?random=34",
    description:
      "Conjunto representativo dos recursos minerais associados à região de Carajás e sua importância histórica e econômica.",
    author: "Acervo geológico",
    year: "2000",
    category: "Geologia",
  },

  // =========================================================
// MEMÓRIA DE MARABÁ
// =========================================================
{
  id: 25,
  roomSlug: "memoria-de-maraba",
  title: "Fotografias de Marabá",
  image:
    "https://picsum.photos/900/700?random=35",
  description:
    "Registro fotográfico que apresenta diferentes momentos da formação e transformação da cidade de Marabá.",
  author: "Acervo fotográfico",
  year: "1950",
  category: "Fotografia",
},
{
  id: 26,
  roomSlug: "memoria-de-maraba",
  title: "Retratos da Cidade",
  image:
    "https://picsum.photos/900/700?random=36",
  description:
    "Conjunto de fotografias que preserva rostos, espaços e acontecimentos importantes para a memória da cidade.",
  author: "Acervo do museu",
  year: "1965",
  category: "Fotografia",
},
{
  id: 27,
  roomSlug: "memoria-de-maraba",
  title: "Objetos do Cotidiano",
  image:
    "https://picsum.photos/900/700?random=37",
  description:
    "Objetos utilizados no cotidiano dos moradores de Marabá que ajudam a compreender hábitos e costumes de outras épocas.",
  author: "Acervo do museu",
  year: "1972",
  category: "Cotidiano",
},
{
  id: 28,
  roomSlug: "memoria-de-maraba",
  title: "Marabá em Transformação",
  image:
    "https://picsum.photos/900/700?random=38",
  description:
    "Registro de diferentes transformações urbanas que marcaram o crescimento e o desenvolvimento de Marabá.",
  author: "Acervo histórico",
  year: "1980",
  category: "História",
},
{
  id: 29,
  roomSlug: "memoria-de-maraba",
  title: "Memórias Ribeirinhas",
  image:
    "https://picsum.photos/900/700?random=39",
  description:
    "Fotografias e registros que revelam a relação das comunidades ribeirinhas com os rios e com a vida cotidiana da região.",
  author: "Acervo fotográfico",
  year: "1988",
  category: "Cultura",
},
{
  id: 30,
  roomSlug: "memoria-de-maraba",
  title: "Marabá Hoje",
  image:
    "https://picsum.photos/900/700?random=40",
  description:
    "Registro que conecta diferentes períodos da história de Marabá e evidencia as mudanças vivenciadas pela cidade ao longo do tempo.",
  author: "Acervo do museu",
  year: "2005",
  category: "História",
},
];

export function getWorksByRoom(roomSlug: string): Work[] {
  return worksData.filter(
    (work) => work.roomSlug === roomSlug
  );
}