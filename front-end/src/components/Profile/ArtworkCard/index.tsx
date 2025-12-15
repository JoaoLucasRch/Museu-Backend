import { Trash2 } from 'lucide-react';
import styles from './ArtworkCard.module.css';
import type { Artwork } from '../types/Artwork';

interface ArtworkCardProps {
  artwork: Artwork;
  onDelete: (id: number) => void;
}

export default function ArtworkCard({ artwork, onDelete }: ArtworkCardProps) {
  
  // Define a classe CSS baseada no status
  const statusClass = styles[artwork.status]; // 'aprovada', 'rejeitada' ou 'pendente'

  return (
    <div className={styles.card}>
      {/* Badge de Status */}
      <span className={`${styles.badge} ${statusClass}`}>
        {artwork.status.charAt(0).toUpperCase() + artwork.status.slice(1)}
      </span>

      {/* Conteúdo */}
      <div className={styles.content}>
        <h3 className={styles.title}>{artwork.titulo_obra}</h3>
        <p className={styles.description}>{artwork.descricao_obra}</p>
      </div>

      {/* Botão de Excluir */}
      <button 
        className={styles.deleteButton} 
        onClick={() => onDelete(artwork.id_obra)}
        title="Excluir obra"
      >
        <Trash2 size={20} color="#555" />
      </button>
    </div>
  );
}