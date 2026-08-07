import styles from "./Artworks.module.css";

import {
  ArtworkToolbar,
  ArtworkEmptyState,
  ArtworkList
} from "@/components/admin/artworks";

import { ArtworkReviewModal } from "@/components/admin/artworks/modals";

import {
  useArtworks,
  useArtworkFilters,
  useArtworkModal,
  useArtworkActions,
} from "@/hooks/artworks";

export default function AdmObras() {
  const {
    obras,
    loading,
    error,
    fetchObras,
  } = useArtworks();

  const {
    searchTerm,
    setSearchTerm,

    statusFilter,
    setStatusFilter,

    filteredObras,

  } = useArtworkFilters(obras);

  const {
    selectedObra,
    isModalOpen,

    showApproval,
    showRejection,

    openModal,
    closeModal,

    openApproval,
    closeApproval,

    openRejection,
    closeRejection,
  } = useArtworkModal();

  const {
    isUpdating,
    confirmApproval,
    confirmRejection,
    formatDate,
  } = useArtworkActions({
    selectedObra,
    fetchObras,
    closeModal,
    closeApproval,
    closeRejection,
  });

  if (loading) {
    return (
      <div className={styles.container}>
        <ArtworkEmptyState
          loading
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <ArtworkEmptyState
          error={error}
          onRetry={fetchObras}
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <ArtworkToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />
      

      <ArtworkList
        obras={filteredObras}
        onArtworkClick={openModal}
      />

      <ArtworkReviewModal
        isOpen={isModalOpen}
        artwork={selectedObra}
        isUpdating={isUpdating}

        showApproval={showApproval}
        showRejection={showRejection}

        onClose={closeModal}

        onApprove={openApproval}
        onReject={openRejection}

        onConfirmApproval={confirmApproval}
        onConfirmRejection={confirmRejection}

        onCancelApproval={closeApproval}
        onCancelRejection={closeRejection}

        formatDate={formatDate}
      />
    </div>
  );
}