import { useState } from "react";

import styles from "./Events.module.css";

import AdminHeader from "@/components/layouts/AdminLayout/AdminHeader";

import EventToolbar from "@/components/admin/events/EventToolbar";
import EventList from "@/components/admin/events/EventList";
import EventModal from "@/components/admin/events/modals/EventModal";
import EventDetailsModal from "@/components/admin/events/modals/EventDetailsModal";
import DeleteEventModal from "@/components/admin/events/modals/DeleteEventModal";

import useEventos from "@/hooks/events/useEvents";
import useEventForm from "@/hooks/events/useEventForm";
import useEventoActions from "@/hooks/events/useEventActions";

export default function AdmEventos() {
  const {
    eventos,
    isLoading,
    error,
    criarEvento,
    editarEvento,
    excluirEvento,
  } = useEventos();

  const {
    formData,
    setFormData,
    selectedFile,
    selectedEvento,
    isEditMode,
    isCreateModalOpen,
    isDetailsOpen,
    closeDetails,
    isDeleteOpen,
    openDeleteModal,
    closeDeleteModal,
    handleFileChange,
    openCreateModal,
    openViewModal,
    closeModal,
    startEdit,
  } = useEventForm();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const {
    handleSubmit,
    handleDelete,
    isSubmitting,
    uploadProgress,
  } = useEventoActions({
    selectedEvento,
    selectedFile,
    formData,
    isCreateMode: isCreateModalOpen,
    closeModal,
    criarEvento,
    editarEvento,
    excluirEvento,
  });

  function formatDate(date: string) {
    return new Date(date).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  }

  const filteredEvents = eventos
    .filter((event) => {
      const matchesSearch = event.titulo_evento
        .toLowerCase()
        .includes(search.toLowerCase());

      const now = new Date();
      const endDate = new Date(event.data_hora_fim);

      const matchesStatus =
        status === "" ||
        (status === "ATIVO" && endDate >= now) ||
        (status === "ENCERRADO" && endDate < now);

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const now = new Date();

      const aInicio = new Date(a.data_hora_inicio);
      const bInicio = new Date(b.data_hora_inicio);

      const aEncerrado =
        new Date(a.data_hora_fim) < now;

      const bEncerrado =
        new Date(b.data_hora_fim) < now;

      // Eventos ativos aparecem antes dos encerrados.
      if (aEncerrado !== bEncerrado) {
        return aEncerrado ? 1 : -1;
      }

      // Eventos ativos:
      // início mais próximo primeiro.
      if (!aEncerrado && !bEncerrado) {
        const diferencaInicio =
          aInicio.getTime() - bInicio.getTime();

        if (diferencaInicio !== 0) {
          return diferencaInicio;
        }
      }

      // Eventos encerrados:
      // início mais recente primeiro.
      if (aEncerrado && bEncerrado) {
        const diferencaInicio =
          bInicio.getTime() - aInicio.getTime();

        if (diferencaInicio !== 0) {
          return diferencaInicio;
        }
      }

      // Critério secundário:
      // evento criado primeiro aparece primeiro.
      if (a.criado_em && b.criado_em) {
        return (
          new Date(a.criado_em).getTime() -
          new Date(b.criado_em).getTime()
        );
      }

      return 0;
    });

  if (isLoading) {
    return (
      <div className={styles.container}>
        <AdminHeader />

        <div className={styles.feedback}>
          <p>Carregando eventos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <AdminHeader />

        <div className={styles.feedback}>
          <h3>Não foi possível carregar os eventos</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <AdminHeader />

      <EventToolbar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        onCreate={openCreateModal}
      />

      {filteredEvents.length > 0 ? (
        <EventList
          events={filteredEvents}
          onView={openViewModal}
        />
      ) : (
        <div className={styles.emptyState}>
          <h2>
            {eventos.length === 0
              ? "Nenhum evento cadastrado"
              : "Nenhum evento encontrado"}
          </h2>

          <p>
            {eventos.length === 0
              ? "Os eventos cadastrados aparecerão aqui."
              : "Tente ajustar a busca ou o filtro selecionado."}
          </p>
        </div>
      )}

      {(isCreateModalOpen || isEditMode) && (
        <EventModal
          isOpen
          title={isEditMode ? "Editar Evento" : "Criar Evento"}
          formData={formData}
          selectedFile={selectedFile}
          isSubmitting={isSubmitting}
          uploadProgress={uploadProgress}
          isCreateMode={isCreateModalOpen}
          onClose={() => {
            const tempEvento = selectedEvento;

            closeModal();

            if (isEditMode && tempEvento) {
              openViewModal(tempEvento);
            }
          }}
          onSubmit={handleSubmit}
          onFileChange={handleFileChange}
          setFormData={setFormData}
        />
      )}

      {isDetailsOpen && selectedEvento && (
        <EventDetailsModal
          evento={selectedEvento}
          isOpen={isDetailsOpen}
          onClose={closeDetails}
          onEdit={() => {
            const eventoAtual = selectedEvento;

            closeDetails();
            openViewModal(eventoAtual);
            startEdit();
          }}
          onDelete={() => {
            closeDetails();
            openDeleteModal(selectedEvento);
          }}
          formatDate={formatDate}
        />
      )}

      {isDeleteOpen && selectedEvento && (
        <DeleteEventModal
          evento={selectedEvento}
          isOpen={isDeleteOpen}
          onClose={() => {
            const tempEvento = selectedEvento;

            closeDeleteModal();

            if (tempEvento) {
              openViewModal(tempEvento);
            }
          }}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}