import { useState } from "react";

import type { Event } from "@/types/Event";
import type {
  CreateEventData,
  UpdateEventData,
} from "@/services/events/eventService";

interface FormData {
  titulo_evento: string;
  descricao_evento: string;
  local_evento: string;

  data_hora_inicio: string;
  data_hora_fim: string;

  tipo_evento: Event["tipo_evento"];

  imagemPreview: string;

  eh_edital: boolean;
  inicio_submissao: string;
  fim_submissao: string;
}

interface CreateEventoPayload extends CreateEventData {
  file?: File | null;
}

interface Props {
  selectedEvento: Event | null;
  selectedFile: File | null;
  formData: FormData;
  isCreateMode: boolean;
  closeModal: () => void;

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

export default function useEventoActions({
  selectedEvento,
  selectedFile,
  formData,
  isCreateMode,
  closeModal,
  criarEvento,
  editarEvento,
  excluirEvento,
}: Props) {
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [uploadProgress] =
    useState(false);

  async function handleSubmit() {
    try {
      setIsSubmitting(true);

      if (
        !formData.titulo_evento.trim() ||
        !formData.descricao_evento.trim() ||
        !formData.local_evento.trim()
      ) {
        throw new Error(
          "Preencha todos os campos obrigatórios."
        );
      }

      if (!formData.tipo_evento) {
        throw new Error(
          "Selecione o tipo do evento."
        );
      }

      if (
        !formData.data_hora_inicio ||
        !formData.data_hora_fim
      ) {
        throw new Error(
          "Informe as datas do evento."
        );
      }

      if (
        formData.eh_edital &&
        (
          !formData.inicio_submissao ||
          !formData.fim_submissao
        )
      ) {
        throw new Error(
          "Informe o período de submissão do edital."
        );
      }

      const payload: UpdateEventData = {
        titulo_evento:
          formData.titulo_evento.trim(),

        descricao_evento:
          formData.descricao_evento.trim(),

        local_evento:
          formData.local_evento.trim(),

        data_hora_inicio:
          new Date(
            formData.data_hora_inicio
          ).toISOString(),

        data_hora_fim:
          new Date(
            formData.data_hora_fim
          ).toISOString(),

        tipo_evento:
          formData.tipo_evento,

        eh_edital:
          formData.eh_edital,

        inicio_submissao:
          formData.eh_edital
            ? new Date(
              formData.inicio_submissao
            ).toISOString()
            : null,

        fim_submissao:
          formData.eh_edital
            ? new Date(
              formData.fim_submissao
            ).toISOString()
            : null,
      };

      console.log(
        "PAYLOAD FINAL:",
        JSON.stringify(payload, null, 2)
      );

      if (isCreateMode) {
        await criarEvento({
          ...payload,
          file: selectedFile,
        } as CreateEventoPayload);
      } else if (selectedEvento) {
        await editarEvento(
          selectedEvento.id_evento,
          payload,
          selectedFile
        );
      }

      closeModal();

    } catch (error: any) {

      console.error(
        "Erro completo:",
        error
      );

      if (error.response) {
        console.log(
          "Status:",
          error.response.status
        );

        console.log(
          "Resposta:",
          error.response.data
        );

        console.log(
          "Payload enviado:",
          {
            titulo_evento:
              formData.titulo_evento,
            descricao_evento:
              formData.descricao_evento,
            local_evento:
              formData.local_evento,
            tipo_evento:
              formData.tipo_evento,
            eh_edital:
              formData.eh_edital,
            inicio_submissao:
              formData.inicio_submissao,
            fim_submissao:
              formData.fim_submissao,
          }
        );
      }

      alert(
        error?.response?.data?.erro ??
        error?.response?.data?.message ??
        error?.message ??
        "Erro ao salvar evento."
      );

    } finally {

      setIsSubmitting(false);

    }
  }

  async function handleDelete() {
    if (!selectedEvento) return;

    const confirmed = confirm(
      `Excluir "${selectedEvento.titulo_evento}"?`
    );

    if (!confirmed) return;

    try {
      setIsSubmitting(true);

      await excluirEvento(selectedEvento.id_evento);

      closeModal();
    } catch (error: any) {
      console.error("Erro ao excluir:", error);

      alert(
        error?.response?.data?.erro ??
        error?.response?.data?.message ??
        "Erro ao excluir evento."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    handleSubmit,
    handleDelete,
    isSubmitting,
    uploadProgress,
  };
}