// src/components/dashboard/ArtworksList/index.tsx
import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import styles from './ArtworksList.module.css';
import ArtworkCard from '../ArtworkCard';
import { ArtworkService } from '../../Profile/types/artworkService';
import type { Artwork } from '../../Profile/types/Artwork';

// 1. IMPORTAR O NOVO MODAL
import DeleteConfirmationModal from '../../Profile/DeleteConfirmationModal';

export default function ArtworksList() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. ESTADOS NOVOS PARA O DELETE
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [artworkToDelete, setArtworkToDelete] = useState<{id: number, title: string} | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchArtworks();
  }, []);

  async function fetchArtworks() {
    try {
      const data = await ArtworkService.getMyArtworks();
      setArtworks(data);
    } catch (error) {
      console.error("Erro ao buscar obras", error);
    } finally {
      setIsLoading(false);
    }
  }

  // 3. ESSA FUNÇÃO AGORA SÓ ABRE O MODAL
  function handleTrashClick(id: number, title: string) {
    setArtworkToDelete({ id, title });
    setIsDeleteModalOpen(true);
  }

  // 4. ESSA FUNÇÃO DELETA DE VERDADE (Chamada pelo Modal)
  async function confirmDelete() {
    if (!artworkToDelete) return;
    
    setIsDeleting(true);
    try {
      await ArtworkService.deleteArtwork(artworkToDelete.id);
      
      // Remove da lista visualmente
      setArtworks(artworks.filter(art => art.id_obra !== artworkToDelete.id));
      
      // Fecha o modal
      setIsDeleteModalOpen(false);
      setArtworkToDelete(null);
    } catch (error) {
      alert("Erro ao excluir obra.");
    } finally {
      setIsDeleting(false);
    }
  }

  function handleAddClick() {
    console.log("Abrir modal de criar obra...");
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Minhas Obras</h2>
      </div>

      <div className={styles.grid}>
        <div className={styles.addCard} onClick={handleAddClick}>
          <Plus size={60} color="#fff" strokeWidth={3} />
        </div>

        {isLoading ? (
          <p>Carregando obras...</p>
        ) : (
          artworks.map((art) => (
            <ArtworkCard 
              key={art.id_obra} 
              artwork={art} 
              // 5. ATUALIZAR O PASSAGEM DA FUNÇÃO DELETE
              // Agora passamos o ID e o Título, pois o ArtworkCard precisa mandar os dois
              onDelete={() => handleTrashClick(art.id_obra, art.titulo_obra)} 
            />
          ))
        )}
      </div>

      {/* 6. COLOCAR O MODAL AQUI NO FINAL */}
      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        artworkTitle={artworkToDelete?.title || ''}
        isDeleting={isDeleting}
      />
    </div>
  );
}