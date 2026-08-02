export interface Artist {
  id: number;
  nome: string;
  email: string;
}

export interface Edital {
  id_evento: number;
  titulo_evento: string;
}

export interface Artwork {
  autor: string | undefined;
  id_obra: number;
  titulo_obra: string;
  descricao_obra?: string | null;
  categoria_obra: string;
  imagens_obras?: string | null;

  status:
    | "pendente"
    | "aprovada"
    | "rejeitada"
    | "exposta";

  data_envio: string;

  data_exposicao?: string | null;
  data_fim_exposicao?: string | null;
  artista_id: number;
  edital_id?: number | null;
  artista?: Artist;
  edital?: Edital | null;
}

export interface CreateArtworkData {
  titulo_obra: string;
  descricao_obra: string;
  categoria_obra: string;
  imagens_obras: string;

  // Opcional: quando vazio, significa "Exponha sua Arte"
  edital_id?: number | string;
}