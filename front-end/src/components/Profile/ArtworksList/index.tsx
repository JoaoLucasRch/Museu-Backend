// src/components/dashboard/ArtworksList/index.tsx
import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import styles from './ArtworksList.module.css';
import ArtworkCard from '../ArtworkCard';
import { ArtworkService } from '../../Profile/types/artworkService';
import type { Artwork } from '../../Profile/types/Artwork';

// Importar os Modais
import DeleteConfirmationModal from '../../Profile/DeleteConfirmationModal';
// 1. IMPORTAR O NOVO MODAL DE CRIAR (Verifique se o caminho está correto)
import CreateArtworkModal from '../../Profile/CreateArtworkModal'; 

export default function ArtworksList() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados para o Delete
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [artworkToDelete, setArtworkToDelete] = useState<{id: number, title: string} | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 2. NOVO ESTADO PARA O MODAL DE CRIAR
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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

  // Funções de Delete
  function handleTrashClick(id: number, title: string) {
    setArtworkToDelete({ id, title });
    setIsDeleteModalOpen(true);
  }

  async function confirmDelete() {
    if (!artworkToDelete) return;
    
    setIsDeleting(true);
    try {
      await ArtworkService.deleteArtwork(artworkToDelete.id);
      setArtworks(artworks.filter(art => art.id_obra !== artworkToDelete.id));
      setIsDeleteModalOpen(false);
      setArtworkToDelete(null);
    } catch (error) {
      alert("Erro ao excluir obra.");
    } finally {
      setIsDeleting(false);
    }
  }

  // 3. ATUALIZADO: Agora abre o modal de criar
  function handleAddClick() {
    setIsCreateModalOpen(true);
  }

  // 4. NOVA FUNÇÃO: Adiciona a obra criada na lista visualmente
  function handleCreateSuccess(newArtwork: Artwork) {
    // Adiciona a nova obra no começo da lista
    setArtworks((prevArtworks) => [newArtwork, ...prevArtworks]);
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Minhas Obras</h2>
      </div>

      <div className={styles.grid}>
        {/* Card de Adicionar (+ big button) */}
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
              onDelete={() => handleTrashClick(art.id_obra, art.titulo_obra)} 
            />
          ))
        )}
      </div>

      {/* Modal de Exclusão */}
      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        artworkTitle={artworkToDelete?.title || ''}
        isDeleting={isDeleting}
      />

      {/* 5. NOVO MODAL DE CRIAR OBRA */}
      <CreateArtworkModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}