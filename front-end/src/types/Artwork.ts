export interface Artist {
  id: number;
  nome: string;
  email: string;
}

export interface Edital {
  id_evento: number;
  titulo_evento: string;
}

// src/types/Artwork.ts

export interface Artwork {
  autor: string | undefined;
  id_obra: number;
  titulo_obra: string;
  descricao_obra: string;
  imagens_obras: string | null;
  categoria_obra: string;
  status: 'pendente' | 'aprovada' | 'rejeitada' | 'exposta';
  data_envio: string;
  data_exposicao: string | null;
  data_fim_exposicao: string | null;
  artista_id: number;
  edital_id: number | null;
  artista?: {
    id: number;
    nome: string;
    email: string;
  };
  edital?: {
    id_evento: number;
    titulo_evento: string;
    eh_edital: boolean;
    inicio_submissao: string | null;
    fim_submissao: string | null;
  } | null;
}
export interface CreateArtworkData {
  titulo_obra: string;
  descricao_obra: string;
  categoria_obra: string;
  imagens_obras: string;

  // Opcional: quando vazio, significa "Exponha sua Arte"
  edital_id?: number | string;
}