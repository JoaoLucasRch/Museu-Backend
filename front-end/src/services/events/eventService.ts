import api from "@/services/api";
import type { Event } from "@/types/Event";

export type TipoEvento =
  | "EXPOSICAO"
  | "OFICINA"
  | "PALESTRA"
  | "LANCAMENTO"
  | "OUTRO";

export interface CreateEventData {
  titulo_evento: string;
  descricao_evento: string;
  local_evento: string;

  imagem_evento?: string | null;

  data_hora_inicio: string;
  data_hora_fim: string;

  tipo_evento: TipoEvento;

  // Edital
  eh_edital: boolean;
  inicio_submissao?: string | null;
  fim_submissao?: string | null;
}

export interface UpdateEventData {
  titulo_evento?: string;
  descricao_evento?: string;
  local_evento?: string;

  imagem_evento?: string | null;

  data_hora_inicio?: string;
  data_hora_fim?: string;

  tipo_evento?: TipoEvento;

  eh_edital?: boolean;
  inicio_submissao?: string | null;
  fim_submissao?: string | null;
}

export interface Edital {
  id_evento: number;
  titulo_evento: string;
}

export const EventService = {
  /**
   * Lista todos os eventos
   */
  async getAll(): Promise<Event[]> {
    const { data } = await api.get<Event[]>("/eventos");
    return data;
  },

  /**
   * Busca um evento pelo ID
   */
  async getById(id: number): Promise<Event> {
    const { data } = await api.get<Event>(`/eventos/${id}`);
    return data;
  },

  /**
   * Lista apenas os editais com submissão aberta
   */
  async getEditaisAbertos(): Promise<Edital[]> {
    const { data } = await api.get<Edital[]>("/eventos/editais");
    return data;
  },

  /**
   * Cria um novo evento
   */
  async create(payload: CreateEventData): Promise<Event> {
    const { data } = await api.post<Event>(
      "/eventos",
      payload
    );

    return data;
  },

  /**
   * Atualiza um evento existente
   */
  async update(
    id: number,
    payload: UpdateEventData
  ): Promise<Event> {
    const { data } = await api.put<Event>(
      `/eventos/${id}`,
      payload
    );

    return data;
  },

  /**
   * Exclui um evento
   */
  async delete(id: number): Promise<void> {
    await api.delete(`/eventos/${id}`);
  },
};