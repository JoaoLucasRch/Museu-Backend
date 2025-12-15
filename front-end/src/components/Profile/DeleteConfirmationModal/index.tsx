// src/components/dashboard/DeleteConfirmationModal/index.tsx
import { X } from 'lucide-react';
import styles from './DeleteConfirmationModal.module.css';
import CancelButton from '../../CancelButton';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  artworkTitle: string; // Título da obra para mostrar na mensagem
  isDeleting?: boolean; // Para mostrar estado de carregamento
}

export default function DeleteConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  artworkTitle,
  isDeleting 
}: DeleteConfirmationModalProps) {
  
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        
        {/* Cabeçalho */}
        <div className={styles.header}>
          <h2>Confirmar exclusão</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        {/* Mensagem com o nome da obra em negrito */}
        <p className={styles.message}>
          Você tem certeza que deseja apagar a obra “
          <span className={styles.highlight}>{artworkTitle}</span>
          ”?
        </p>

        {/* Botões de Ação */}
        <div className={styles.actions}>
          <CancelButton onClick={onClose}/>
          
          <button 
            onClick={onConfirm} 
            className={styles.confirmBtn}
            disabled={isDeleting}
          >
            {isDeleting ? 'Apagando...' : 'Confirmar'}
          </button>
        </div>

      </div>
    </div>
  );
}