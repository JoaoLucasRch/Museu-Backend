// src/components/dashboard/ArtworkCard/index.tsx
import { Trash2, Calendar } from 'lucide-react';
import styles from './ArtworkCard.module.css';
import type { Artwork } from '../../Profile/types/Artwork';

interface ArtworkCardProps {
  artwork: Artwork;
  onDelete: () => void;
}

export default function ArtworkCard({ artwork, onDelete }: ArtworkCardProps) {
  
  const statusClass = styles[artwork.status];

  // Formata 2025-12-15T14... para 15/12/2025
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Data n/a';
    const date = new Date(dateString);
    // 'pt-BR' garante o formato dia/mês/ano
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className={styles.card}>
      
      {/* --- VISÃO PADRÃO (SEM MOUSE) --- */}
      <div className={styles.previewContent}>
        <span 
          className={`${styles.miniBadge} ${statusClass}`} 
          style={{alignSelf: 'flex-end', padding: '0.4rem 1rem'}}
        >
          {artwork.status.charAt(0).toUpperCase() + artwork.status.slice(1)}
        </span>

        <div style={{ marginTop: 'auto' }}>
          <h3 style={{fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 700}}>
            {artwork.titulo_obra}
          </h3>
          <p style={{fontSize: '0.85rem', color: '#666', margin: 0}} className="truncate">
             {artwork.descricao_obra.substring(0, 40)}...
          </p>
        </div>
      </div>

      {/* --- VISÃO DETALHADA (NO HOVER) --- */}
      <div className={styles.overlay}>
        
        {/* Título */}
        <h4 className={styles.overlayTitle}>{artwork.titulo_obra}</h4>
        
        {/* Descrição com rolagem se for grande */}
        <div className={styles.overlayDesc}>
          {artwork.descricao_obra}
        </div>

        {/* Linha de Informações (Rodapé do Hover) */}
        <div className={styles.infoRow}>
          {/* Data à esquerda */}
          <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
             <Calendar size={14} />
             {/* Usa a data de envio ou data de hoje como fallback */}
             <span>{formatDate(artwork.data_envio || new Date().toISOString())}</span>
          </div>
        </div>

      </div>

      {/* Botão de Excluir (Agora no Topo) */}
      <button 
        className={styles.deleteButton} 
        onClick={(e) => {
          e.stopPropagation(); 
          onDelete();
        }}
        title="Excluir obra"
      >
        <Trash2 size={16} />
      </button>

    </div>
  );
}