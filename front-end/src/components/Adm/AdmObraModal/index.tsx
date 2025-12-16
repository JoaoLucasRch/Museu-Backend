import { useState } from "react";
import { X, Trash2 } from "lucide-react";
import styles from "./styles.module.css";

interface Artista {
  id: number;
  nome: string;
  email: string;
}

interface Obra {
  id_obra: number;
  titulo_obra: string;
  descricao_obra: string;
  imagens_obras: string;
  categoria_obra: string;
  data_exposicao: string;
  data_fim_exposicao: string;
  status: "pendente" | "aprovada" | "rejeitada";
  artista_id: number;
  artista?: Artista;
}

interface AdmObraModalProps {
  isOpen: boolean;
  onClose: () => void;
  obra: Obra | null;
  onStatusUpdate: (id: number, status: "aprovada" | "rejeitada") => Promise<void>;
}

export default function AdmObraModal({ isOpen, onClose, obra, onStatusUpdate }: AdmObraModalProps) {
  const [showConfirmApproval, setShowConfirmApproval] = useState(false);
  const [showConfirmRejection, setShowConfirmRejection] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isOpen || !obra) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pendente": return "#da9f408d";
      case "aprovada": return "#173c30f6";
      case "rejeitada": return "#5d1212cf";
      default: return "#6B7280";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pendente": return "Pendente";
      case "aprovada": return "Aprovada";
      case "rejeitada": return "Rejeitada";
      default: return status;
    }
  };

  const handleApprove = () => {
    setShowConfirmApproval(true);
  };

  const handleReject = () => {
    setShowConfirmRejection(true);
  };

  const confirmApproval = async () => {
    setIsUpdating(true);
    try {
      await onStatusUpdate(obra.id_obra, "aprovada");
      setShowConfirmApproval(false);
      onClose();
    } catch (error: any) {
      console.error("Erro ao aprovar obra:", error);
      const errorMessage = error?.message || "Erro desconhecido ao aprovar obra";
      alert(`Erro ao aprovar obra: ${errorMessage}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const confirmRejection = async () => {
    setIsUpdating(true);
    try {
      await onStatusUpdate(obra.id_obra, "rejeitada");
      setShowConfirmRejection(false);
      onClose();
    } catch (error: any) {
      console.error("Erro ao rejeitar obra:", error);
      const errorMessage = error?.message || "Erro desconhecido ao rejeitar obra";
      alert(`Erro ao rejeitar obra: ${errorMessage}`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      {/* Modal Principal - Detalhes da Obra */}
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          {/* Cabeçalho */}
          <div className={styles.header}>
            <h2 className={styles.title}>Avalie a Obra</h2>
            <button className={styles.closeButton} onClick={onClose}>
              <X size={24} />
            </button>
          </div>

          {/* Conteúdo */}
          <div className={styles.content}>
            {/* Status Badge */}
            <div 
              className={styles.statusBadge} 
              style={{ backgroundColor: getStatusColor(obra.status) }}
            >
              {getStatusText(obra.status)}
            </div>

            {/* Título da Obra */}
            <h3 className={styles.obraTitle}>{obra.titulo_obra}</h3>

            {/* Descrição */}
            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>Descrição</h4>
              <p className={styles.description}>{obra.descricao_obra}</p>
            </div>

            {/* Data de Envio */}
            <div className={styles.dateInfo}>
              {formatDate(obra.data_exposicao)}
            </div>

            {/* Informações do Artista */}
            <div className={styles.artistSection}>
              <h4 className={styles.artistName}>{obra.artista?.nome || "Artista Desconhecido"}</h4>
              <p className={styles.artistEmail}>{obra.artista?.email || ""}</p>
            </div>

            {/* Link de Imagens */}
            {obra.imagens_obras && (
              <div className={styles.imageSection}>
                <p className={styles.imageLabel}>acesse abaixo as imagens da obra</p>
                <a 
                  href={obra.imagens_obras} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.imageLink}
                >
                  {obra.imagens_obras}
                </a>
              </div>
            )}

            {/* Botões de Ação */}
            {obra.status === "pendente" && (
              <div className={styles.actionButtons}>
                <button 
                  className={styles.rejectButton}
                  onClick={handleReject}
                  disabled={isUpdating}
                >
                  Rejeitar
                </button>
                <button 
                  className={styles.approveButton}
                  onClick={handleApprove}
                  disabled={isUpdating}
                >
                  Aprovar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Confirmação de Aprovação */}
      {showConfirmApproval && (
        <div className={styles.overlay} onClick={() => setShowConfirmApproval(false)}>
          <div className={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
            <button 
              className={styles.closeButton} 
              onClick={() => setShowConfirmApproval(false)}
            >
              <X size={20} />
            </button>
            
            <h3 className={styles.confirmTitle}>Confirmar Aprovação</h3>
            <p className={styles.confirmText}>
              Você tem certeza que deseja aprovar a obra <strong>"{obra.titulo_obra}"</strong>?
            </p>
            
            <div className={styles.confirmButtons}>
              <button 
                className={styles.cancelButton}
                onClick={() => setShowConfirmApproval(false)}
                disabled={isUpdating}
              >
                Cancelar
              </button>
              <button 
                className={styles.confirmApproveButton}
                onClick={confirmApproval}
                disabled={isUpdating}
              >
                {isUpdating ? "Aprovando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Rejeição */}
      {showConfirmRejection && (
        <div className={styles.overlay} onClick={() => setShowConfirmRejection(false)}>
          <div className={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
            <button 
              className={styles.closeButton} 
              onClick={() => setShowConfirmRejection(false)}
            >
              <X size={20} />
            </button>
            
            <h3 className={styles.confirmTitle}>Confirmar Rejeição</h3>
            <p className={styles.confirmText}>
              Você tem certeza que deseja rejeitar a obra <strong>"{obra.titulo_obra}"</strong>?
            </p>
            
            <div className={styles.confirmButtons}>
              <button 
                className={styles.cancelButton}
                onClick={() => setShowConfirmRejection(false)}
                disabled={isUpdating}
              >
                Cancelar
              </button>
              <button 
                className={styles.confirmRejectButton}
                onClick={confirmRejection}
                disabled={isUpdating}
              >
                {isUpdating ? "Rejeitando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}