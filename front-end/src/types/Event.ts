export interface Event {
  id_evento: number;
  titulo_evento: string;
  descricao_evento: string;
  local_evento: string;
  imagem_evento?: string | null;

  data_hora_inicio: string;
  data_hora_fim: string;

  tipo_evento:
    | "EXPOSICAO"
    | "OFICINA"
    | "PALESTRA"
    | "LANCAMENTO"
    | "OUTRO";

  eh_edital: boolean;
  inicio_submissao?: string | null;
  fim_submissao?: string | null;

  
  criado_em?: string;
  atualizado_em?: string;

    criado_por_id: number;

  criado_por?: {
    id: number;
    nome: string;
    email: string;
}}