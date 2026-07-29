import { useMemo, useState } from "react";
import type { Artwork } from "@/types/Artwork";

export default function useArtworkFilters(
  obras: Artwork[]
) {
  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<
      "todos" | "pendente" | "aprovada" | "rejeitada"
    >("todos");

  const filteredObras = useMemo(() => {
    return obras.filter((obra) => {
      const matchesSearch =
        obra.titulo_obra
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||

        (obra.descricao_obra ?? "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||

        (obra.artista?.nome ?? "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "todos" ||
        obra.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [obras, searchTerm, statusFilter]);

  function clearFilters() {
    setSearchTerm("");
    setStatusFilter("todos");
  }

  return {
    searchTerm,
    setSearchTerm,

    statusFilter,
    setStatusFilter,

    filteredObras,

    clearFilters,
  };
}