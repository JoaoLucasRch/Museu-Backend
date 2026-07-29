import { useState } from "react";
import type { Event } from "@/types/Event";

interface FormData {
  titulo_evento: string;
  descricao_evento: string;
  local_evento: string;

  data_hora_inicio: string;
  data_hora_fim: string;

  tipo_evento: Event["tipo_evento"];

  eh_edital: boolean;
  inicio_submissao: string;
  fim_submissao: string;

  imagemPreview: string;
}

const initialFormData: FormData = {
  titulo_evento: "",
  descricao_evento: "",
  local_evento: "",

  data_hora_inicio: "",
  data_hora_fim: "",

  tipo_evento: "" as Event["tipo_evento"],

  eh_edital: false,
  inicio_submissao: "",
  fim_submissao: "",

  imagemPreview: "",
};

export default function useEventForm() {

  const [formData, setFormData] =
    useState<FormData>(initialFormData);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [selectedEvento, setSelectedEvento] =
    useState<Event | null>(null);

  const [isEditMode, setIsEditMode] =
    useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] =
    useState(false);

  const [isDetailsOpen, setIsDetailsOpen] =
    useState(false);

  const [isDeleteOpen, setIsDeleteOpen] =
    useState(false);

  function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        imagemPreview: reader.result as string,
      }));
    };

    reader.readAsDataURL(file);
  }

  function openCreateModal() {
    resetForm();
    setIsCreateModalOpen(true);
  }

  function closeDetails() {
    setIsDetailsOpen(false);
    setSelectedEvento(null);
  }

  function openDeleteModal(evento: Event) {
    setSelectedEvento(evento);
    setIsDeleteOpen(true);
  }

  function closeDeleteModal() {
    setIsDeleteOpen(false);
  }

  function openViewModal(evento: Event) {

    setSelectedEvento(evento);

    setIsDetailsOpen(true);
    setIsEditMode(false);

    setFormData({
      titulo_evento: evento.titulo_evento,
      descricao_evento: evento.descricao_evento,
      local_evento: evento.local_evento,

      data_hora_inicio:
        evento.data_hora_inicio.slice(0, 16),

      data_hora_fim:
        evento.data_hora_fim.slice(0, 16),

      tipo_evento: evento.tipo_evento,

      eh_edital: evento.eh_edital ?? false,

      inicio_submissao:
        evento.inicio_submissao
          ? evento.inicio_submissao.slice(0, 16)
          : "",

      fim_submissao:
        evento.fim_submissao
          ? evento.fim_submissao.slice(0, 16)
          : "",

      imagemPreview:
        evento.imagem_evento ?? "",
    });

    setSelectedFile(null);
  }

  function startEdit() {
    setIsEditMode(true);
    setIsDetailsOpen(false);
  }

  function cancelEdit() {

    if (selectedEvento) {

      setFormData({
        titulo_evento:
          selectedEvento.titulo_evento,

        descricao_evento:
          selectedEvento.descricao_evento,

        local_evento:
          selectedEvento.local_evento,

        data_hora_inicio:
          selectedEvento.data_hora_inicio.slice(0, 16),

        data_hora_fim:
          selectedEvento.data_hora_fim.slice(0, 16),

        tipo_evento:
          selectedEvento.tipo_evento,

        eh_edital:
          selectedEvento.eh_edital ?? false,

        inicio_submissao:
          selectedEvento.inicio_submissao
            ? selectedEvento.inicio_submissao.slice(0, 16)
            : "",

        fim_submissao:
          selectedEvento.fim_submissao
            ? selectedEvento.fim_submissao.slice(0, 16)
            : "",

        imagemPreview:
          selectedEvento.imagem_evento ?? "",
      });

      setSelectedFile(null);
    }

    setIsEditMode(false);
  }

  function closeModal() {

    setSelectedEvento(null);

    setIsEditMode(false);

    setIsCreateModalOpen(false);

    setIsDetailsOpen(false);

    resetForm();
  }

  function resetForm() {

    setFormData(initialFormData);

    setSelectedFile(null);
  }

  return {
    formData,
    setFormData,

    selectedFile,

    selectedEvento,
    setSelectedEvento,

    isEditMode,
    setIsEditMode,

    isCreateModalOpen,
    setIsCreateModalOpen,

    isDetailsOpen,
    closeDetails,

    isDeleteOpen,
    openDeleteModal,
    closeDeleteModal,

    handleFileChange,

    openCreateModal,
    openViewModal,

    startEdit,
    cancelEdit,

    closeModal,
    resetForm,
  };
}