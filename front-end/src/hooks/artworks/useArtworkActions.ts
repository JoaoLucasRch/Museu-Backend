import { useState } from "react";
import { ArtworkService } from "@/services/artworks/artworkService";
import type { Artwork } from "@/types/Artwork";

interface Props {
  selectedObra: Artwork | null;
  fetchObras: () => Promise<void>;
  closeModal: () => void;
  closeApproval: () => void;
  closeRejection: () => void;
  closeExhibition: () => void;
}

export default function useArtworkActions({
  selectedObra,
  fetchObras,
  closeModal,
  closeApproval,
  closeRejection,
  closeExhibition,
}: Props) {
  const [isUpdating, setIsUpdating] = useState(false);

  async function updateStatus(
    status: "aprovada" | "rejeitada" | "exposta"
  ) {
    if (!selectedObra) return;

    setIsUpdating(true);

    try {
      await ArtworkService.updateStatus(
        selectedObra.id_obra,
        status
      );

      await fetchObras();
      closeModal();
      closeApproval();
      closeRejection();
      closeExhibition();
    } finally {
      setIsUpdating(false);
    }
  }

  async function confirmApproval() {
    await updateStatus("aprovada");
  }

  async function confirmRejection() {
    await updateStatus("rejeitada");
  }

  async function confirmExhibition() {
    await updateStatus("exposta");
  }

  function formatDate(date?: string | null) {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("pt-BR");
  }

  return {
    isUpdating,
    confirmApproval,
    confirmRejection,
    confirmExhibition,
    formatDate,
  };
}