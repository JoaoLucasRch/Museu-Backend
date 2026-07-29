import { useCallback, useState } from "react";

import type { Event } from "@/types/Event";

export default function useEventUI() {
  const [activeTooltipId, setActiveTooltipId] =
    useState<number | null>(null);

  const [selectedEvento, setSelectedEvento] =
    useState<Event | null>(null);

  const handleMouseEnter = useCallback(
    (id: number) => {
      setActiveTooltipId(id);
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setActiveTooltipId(null);
  }, []);

  const handleCardClick = useCallback(
    (evento: Event) => {
      setSelectedEvento(evento);
    },
    []
  );

  const closeModal = useCallback(() => {
    setSelectedEvento(null);
    setActiveTooltipId(null);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedEvento(null);
  }, []);

  return {
    activeTooltipId,
    selectedEvento,

    handleMouseEnter,
    handleMouseLeave,
    handleCardClick,

    closeModal,
    clearSelection,

    setSelectedEvento,
  };
}