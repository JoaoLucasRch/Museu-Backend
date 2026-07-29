import { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";

import styles from "./ArtworkList.module.css";
import { ArtworkService } from "@/services/artworks/artworkService";
import type { Artwork } from "@/types/Artwork";

import {
  ArtworkCard,
  ArtworkDetailsModal,
  CreateArtworkModal,
  DeleteConfirmationModal,
} from "@/components/artist";

export default function ArtworksList() {

  const [artworks, setArtworks] =
    useState<Artwork[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("todas");

  const [selectedArtwork, setSelectedArtwork] =
    useState<Artwork | null>(null);

  const [deleteArtwork, setDeleteArtwork] =
    useState<Artwork | null>(null);

  const [detailsOpen, setDetailsOpen] =
    useState(false);

  const [createOpen, setCreateOpen] =
    useState(false);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const [isDeleting, setIsDeleting] =
    useState(false);

  useEffect(() => {
    loadArtworks();
  }, []);

  async function loadArtworks() {
    try {
      const data =
        await ArtworkService.getMyArtworks();
      setArtworks(data);
    } catch (error) {
      console.error(
        "Erro ao carregar obras:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  function openDetails(
    artwork: Artwork
  ) {
    setSelectedArtwork(artwork);
    setDetailsOpen(true);
  }

  function closeDetails() {
    setSelectedArtwork(null);
    setDetailsOpen(false);
  }

  function openDelete(
    artwork: Artwork
  ) {
    setDeleteArtwork(artwork);
    setDetailsOpen(false);
    setDeleteOpen(true);
  }

  async function confirmDelete() {

    if (!deleteArtwork)
      return;
    setIsDeleting(true);

    try {
      await ArtworkService.deleteArtwork(
        deleteArtwork.id_obra
      );

      setArtworks(prev =>
        prev.filter(
          item =>
            item.id_obra !==
            deleteArtwork.id_obra
        )
      );

      setDeleteOpen(false);
      setDeleteArtwork(null);

    } catch (error) {
      console.error(
        "Erro ao excluir obra:",
        error
      );
    } finally {
      setIsDeleting(false);
    }
  }

  function handleCreateSuccess(
    artwork: Artwork
  ) {
    setArtworks(prev => [
      artwork,
      ...prev,
    ]);
  }

  const filteredArtworks =
    useMemo(() => {
      const value =
        search.toLowerCase();

      return artworks.filter(
        artwork => {
          const matchesText =
            (
              artwork.titulo_obra +
              artwork.categoria_obra
            )
              .toLowerCase()
              .includes(value);
          const matchesStatus =
            statusFilter === "todas" ||
            artwork.status === statusFilter;
          return (
            matchesText &&
            matchesStatus
          );
        }
      );

    }, [
      artworks,
      search,
      statusFilter
    ]);

  return (
    <section className={styles.container}>

      <header className={styles.header}>
        <span className={styles.section}>
          PORTFÓLIO
        </span>

        <h2 className={styles.title}>
          Minhas obras
        </h2>

        <p className={styles.subtitle}>
          Gerencie suas submissões e acompanhe
          o andamento das suas obras.
        </p>
      </header>


      <div className={styles.toolbar}>

        <div className={styles.leftTools}>

          <div className={styles.search}>
            <Search size={17} />

            <input
              type="text"
              placeholder="Pesquisar obra..."
              value={search}
              onChange={e =>
                setSearch(e.target.value)
              }
            />
          </div>


          <div className={styles.selectWrapper}>

            <select
              value={statusFilter}
              onChange={e =>
                setStatusFilter(e.target.value)
              }
            >
              <option value="todas">
                Todas
              </option>

              <option value="pendente">
                Pendentes
              </option>

              <option value="aprovada">
                Aprovadas
              </option>

              <option value="rejeitada">
                Rejeitadas
              </option>

              <option value="exposta">
                Expostas
              </option>

            </select>

          </div>

        </div>


        <div className={styles.actions}>

          <div className={styles.counter}>
            <strong>
              {artworks.length}
            </strong>

            <span>
              obras
            </span>
          </div>


          <button
            className={styles.createButton}
            onClick={() =>
              setCreateOpen(true)
            }
          >
            <Plus size={17} />
            Nova obra
          </button>

        </div>

      </div>


      <div className={styles.tableHeader}>

        <span>
          Nome
        </span>

        <span>
          Origem
        </span>

        <span>
          Enviado
        </span>

        <span>
          Status
        </span>

      </div>


      <div className={styles.list}>

        {
          loading ? (

            <div className={styles.empty}>
              Carregando obras...
            </div>

          )

            :

            filteredArtworks.length === 0 ? (

              <div className={styles.empty}>
                Nenhuma obra encontrada.
              </div>

            )

              :

              filteredArtworks.map(
                artwork => (

                  <ArtworkCard
                    key={artwork.id_obra}
                    artwork={artwork}
                    onClick={openDetails}
                  />

                )
              )

        }

      </div>


      <CreateArtworkModal
        isOpen={createOpen}
        onClose={() =>
          setCreateOpen(false)
        }
        onSuccess={handleCreateSuccess}
      />


      <ArtworkDetailsModal
        isOpen={detailsOpen}
        artwork={selectedArtwork}
        onClose={closeDetails}
        onDelete={openDelete}
      />


      <DeleteConfirmationModal
        isOpen={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setDeleteArtwork(null);
        }}
        onConfirm={confirmDelete}
        artworkTitle={
          deleteArtwork?.titulo_obra ?? ""
        }
        isDeleting={isDeleting}
      />

    </section>
  );

}