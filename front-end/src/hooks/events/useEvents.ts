import { useEffect, useState } from "react";

import type { Event } from "@/types/Event";

import {
  EventService,
  type CreateEventData,
  type UpdateEventData,
} from "@/services/events/eventService";

import { UploadService } from "@/services/upload/uploadService";

interface CreateEventoPayload extends CreateEventData {
  file?: File | null;
}

interface UseEventosReturn {
  eventos: Event[];

  isLoading: boolean;

  error: string | null;

  carregarEventos: () => Promise<void>;

  criarEvento: (
    data: CreateEventoPayload
  ) => Promise<void>;

  editarEvento: (
  id: number,
  data: UpdateEventData,
  file?: File | null
) => Promise<void>;

  excluirEvento: (
    id: number
  ) => Promise<void>;
}

export default function useEventos(): UseEventosReturn {

  const [eventos, setEventos] =
    useState<Event[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    carregarEventos();
  }, []);

  console.log("useEvents criado");
  
  async function carregarEventos() {

    try {

      setIsLoading(true);
      setError(null);

      const data =
        await EventService.getAll();

      setEventos(data);

    } catch (err) {

      console.error(
        "Erro ao carregar eventos:",
        err
      );

      setError(
        "Erro ao carregar eventos."
      );

    } finally {

      setIsLoading(false);

    }

  }

  async function criarEvento(
    data: CreateEventoPayload
  ) {

    try {

      let imagem_evento =
        data.imagem_evento ?? null;

      if (data.file) {

        imagem_evento =
          await UploadService.uploadEventImage(
            data.file
          );

      }

      const payload: CreateEventData = {

        titulo_evento:
          data.titulo_evento,

        descricao_evento:
          data.descricao_evento,

        local_evento:
          data.local_evento,

        imagem_evento,

        data_hora_inicio:
          data.data_hora_inicio,

        data_hora_fim:
          data.data_hora_fim,

        tipo_evento:
          data.tipo_evento,

        eh_edital:
          data.eh_edital ?? false,

        inicio_submissao:
          data.eh_edital
            ? data.inicio_submissao ?? null
            : null,

        fim_submissao:
          data.eh_edital
            ? data.fim_submissao ?? null
            : null,
      };

      const novoEvento =
        await EventService.create(
          payload
        );

      setEventos(prev => [
        novoEvento,
        ...prev,
      ]);

    } catch (err) {

      console.error(
        "Erro ao criar evento:",
        err
      );

      throw err;

    }

  }

  async function editarEvento(
  id: number,
  data: UpdateEventData,
  file?: File | null
) {
  try {

    let imagem_evento =
      data.imagem_evento ?? null;

    if (file) {
      imagem_evento =
        await UploadService.uploadEventImage(file);
    }

    const atualizado =
      await EventService.update(
        id,
        {
          ...data,
          imagem_evento,
          inicio_submissao: data.eh_edital
            ? data.inicio_submissao ?? null
            : null,
          fim_submissao: data.eh_edital
            ? data.fim_submissao ?? null
            : null,
        }
      );

    setEventos(prev =>
      prev.map(evento =>
        evento.id_evento === id
          ? atualizado
          : evento
      )
    );

  } catch (err) {

    console.error(
      "Erro ao editar evento:",
      err
    );

    throw err;

  }
}

  async function excluirEvento(
    id: number
  ) {

    try {

      await EventService.delete(id);

      setEventos(prev =>
        prev.filter(
          evento =>
            evento.id_evento !== id
        )
      );

    } catch (err) {

      console.error(
        "Erro ao excluir evento:",
        err
      );

      throw err;

    }

  }

  return {
    eventos,
    isLoading,
    error,
    carregarEventos,
    criarEvento,
    editarEvento,
    excluirEvento,
  };

}