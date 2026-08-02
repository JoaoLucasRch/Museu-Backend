import { useState } from "react";
import styles from "./Events.module.css";

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

  const { handleSubmit, handleDelete, isSubmitting, uploadProgress } =
    useEventoActions({
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

  const filteredEvents = eventos.filter((event) =>
    event.titulo_evento.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading) {
    return <div className={styles.container}>Carregando eventos...</div>;
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h3>Erro</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
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
          onEdit={(evento) => {
            openViewModal(evento);
          }}
          onDelete={openDeleteModal}
        />
      ) : (
        <div className={styles.emptyState}>
          <h2>Nenhum evento encontrado</h2>
          <p>Crie seu primeiro evento.</p>
        </div>
      )}

    {/* Modal de Criação / Edição */}
      {(isCreateModalOpen || isEditMode) && (
        <EventModal
          isOpen
          title={isEditMode ? "Editar Evento" : "Criar Evento"}
          formData={formData}
          selectedFile={selectedFile}
          isSubmitting={isSubmitting}
          uploadProgress={uploadProgress}
          onClose={() => {
            const tempEvento = selectedEvento; // Guarda a referência antes de limpar
            closeModal();
            if (isEditMode && tempEvento) {
              openViewModal(tempEvento); // Reabre os detalhes com o evento guardado
            }
          }}
          onSubmit={handleSubmit}
          onFileChange={handleFileChange}
          setFormData={setFormData}
        />
      )}
      
      {/* Modal de Detalhes */}
      {isDetailsOpen && selectedEvento && (
        <EventDetailsModal
          evento={selectedEvento}
          isOpen={isDetailsOpen}
          onClose={closeDetails}
          onEdit={() => {
            // Guarda o evento atual antes de fechar os detalhes
            const eventoAtual = selectedEvento;
            closeDetails();
            
            // Re-seleciona para garantir que a edição receba os dados
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

      {/* Modal de Exclusão */}
      {isDeleteOpen && selectedEvento && (
        <DeleteEventModal
          evento={selectedEvento}
          isOpen={isDeleteOpen}
          onClose={() => {
            const tempEvento = selectedEvento; // Guarda a referência antes de fechar
            closeDeleteModal();
            if (tempEvento) {
              openViewModal(tempEvento); // Reabre os detalhes
            }
          }}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
