export interface Artwork {
  id_obra: number;
  titulo_obra: string;
  descricao_obra: string;
  imagens_obras?: string;
  status: 'pendente' | 'aprovada' | 'rejeitada';
}