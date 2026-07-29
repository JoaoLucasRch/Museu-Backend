import { useState } from "react";

import type { Artwork } from "@/types/Artwork";

export default function useArtworkModal() {

  const [selectedObra, setSelectedObra] =
    useState<Artwork | null>(null);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [showApproval, setShowApproval] =
    useState(false);

  const [showRejection, setShowRejection] =
    useState(false);

  function openModal(obra: Artwork) {
    setSelectedObra(obra);
    setIsModalOpen(true);
  }

  function closeModal() {
    setSelectedObra(null);
    setIsModalOpen(false);

    setShowApproval(false);
    setShowRejection(false);
  }

  function openApproval() {
    setShowApproval(true);
  }

  function closeApproval() {
    setShowApproval(false);
  }

  function openRejection() {
    setShowRejection(true);
  }

  function closeRejection() {
    setShowRejection(false);
  }

  return {
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
  };

}