import styles from "./Artworks.module.css";
import AdminHeader from "@/components/layouts/AdminLayout/AdminHeader";

import {
  ArtworkToolbar,
  ArtworkEmptyState,
  ArtworkList,
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
    showExhibition,
    openModal,
    closeModal,
    openApproval,
    closeApproval,
    openRejection,
    closeRejection,
    openExhibition,
    closeExhibition,
  } = useArtworkModal();

  const {
    isUpdating,
    confirmApproval,
    confirmRejection,
    confirmExhibition,
    formatDate,
  } = useArtworkActions({
    selectedObra,
    fetchObras,
    closeModal,
    closeApproval,
    closeRejection,
    closeExhibition,
  });

  if (loading) {
    return (
      <div className={styles.container}>
        <ArtworkEmptyState loading />
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
      <AdminHeader />

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
        showExhibition={showExhibition}
        onClose={closeModal}
        onApprove={openApproval}
        onReject={openRejection}
        onExhibit={openExhibition}
        onConfirmApproval={confirmApproval}
        onConfirmRejection={confirmRejection}
        onConfirmExhibition={confirmExhibition}
        onCancelApproval={closeApproval}
        onCancelRejection={closeRejection}
        onCancelExhibition={closeExhibition}
        formatDate={formatDate}
      />
    </div>
  );
}