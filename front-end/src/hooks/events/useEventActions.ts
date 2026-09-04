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

function formatDateTimeLocal(date: string | Date) {
  return new Date(date).toISOString().slice(0, 16);
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

      // Validação dos campos obrigatórios
      const camposFaltantes: string[] = [];

      if (!formData.titulo_evento.trim()) {
        camposFaltantes.push("título do evento");
      }

      if (!formData.descricao_evento.trim()) {
        camposFaltantes.push("descrição do evento");
      }

      if (!formData.local_evento.trim()) {
        camposFaltantes.push("local do evento");
      }

      if (!formData.data_hora_inicio) {
        camposFaltantes.push("data de início");
      }

      if (!formData.data_hora_fim) {
        camposFaltantes.push("data de término");
      }

      if (!formData.tipo_evento) {
        camposFaltantes.push("tipo do evento");
      }

      if (camposFaltantes.length > 0) {
        if (camposFaltantes.length === 1) {
          throw new Error(
            `Informe o ${camposFaltantes[0]}.`
          );
        }

        const ultimoCampo =
          camposFaltantes.pop();

        throw new Error(
          `Preencha ${camposFaltantes.join(", ")} e ${ultimoCampo}.`
        );
      }

      // Validação das datas
      const dataInicio = new Date(
        formData.data_hora_inicio
      );

      const dataFim = new Date(
        formData.data_hora_fim
      );

      const agora = new Date();

      if (
        isNaN(dataInicio.getTime()) ||
        isNaN(dataFim.getTime())
      ) {
        throw new Error(
          "Informe datas válidas para o evento."
        );
      }

      if (
        isCreateMode &&
        dataInicio < agora
      ) {
        throw new Error(
          "A data de início do evento não pode estar no passado."
        );
      }

      if (
        !isCreateMode &&
        selectedEvento &&
        formData.data_hora_inicio !==
        formatDateTimeLocal(
          selectedEvento.data_hora_inicio
        ) &&
        dataInicio < agora
      ) {
        throw new Error(
          "A nova data de início do evento não pode estar no passado."
        );
      }

      if (dataFim <= dataInicio) {
        throw new Error(
          "A data de término deve ser posterior à data de início."
        );
      }

      // Validação específica para edital
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
          "ERROS DE VALIDAÇÃO:",
          JSON.stringify(
            error.response?.data?.errors,
            null,
            2
          )
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

      await excluirEvento(
        selectedEvento.id_evento
      );

      closeModal();

    } catch (error: any) {
      console.error(
        "Erro ao excluir:",
        error
      );

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