import { X, CalendarDays, Palette, FolderOpen } from "lucide-react";

import styles from "./ArtworkReviewModal.module.css";

import type { Artwork } from "../../../../../types/Artwork";

import StatusBadge from "./StatusBadge";
import ApprovalModal from "./ApprovalModal";
import RejectionModal from "./RejectionModal";

interface Props {
  isOpen: boolean;
  artwork: Artwork | null;
  isUpdating: boolean;
  showApproval: boolean;
  showRejection: boolean;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  onConfirmApproval: () => void;
  onConfirmRejection: () => void;
  onCancelApproval: () => void;
  onCancelRejection: () => void;
  formatDate?: (date?: string) => string;
}

export default function ArtworkReviewModal({
  isOpen,
  artwork,
  isUpdating,
  showApproval,
  showRejection,
  onClose,
  onApprove,
  onReject,
  onConfirmApproval,
  onConfirmRejection,
  onCancelApproval,
  onCancelRejection,
  formatDate,
}: Props) {
  if (!isOpen || !artwork) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <header className={styles.header}>
            <div>
              <h2>{artwork.titulo_obra}</h2>

              <p className={styles.subtitle}>Visualização da obra enviada.</p>
            </div>

            <button className={styles.close} onClick={onClose} type="button">
              <X size={20} />
            </button>
          </header>

          <main className={styles.content}>
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Arquivos enviados</h3>

              {artwork.imagens_obras ? (
                <div className={styles.linkBox}>
                  {artwork.imagens_obras.split(",").map((link, index) => (
                    <a
                      key={index}
                      href={link.trim()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.fileLink}
                    >
                      Arquivo {index + 1}
                    </a>
                  ))}
                </div>
              ) : (
                <p className={styles.emptyText}>Nenhum arquivo informado.</p>
              )}
            </section>

            <StatusBadge status={artwork.status} />

            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Informações da obra</h3>

              {/* Envolvemos o trecho em um container de linha */}
              <div className={styles.infoRow}>
                <span className={styles.label}>autor:</span>
                <span className={styles.author}>
                  {artwork.artista?.nome || artwork.autor || "Não informado"}
                </span>
              </div>

              <div className={styles.descriptionBox}>
                <label>Descrição</label>

                <p>{artwork.descricao_obra || "Não informada."}</p>
              </div>

              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <Palette size={18} />

                  <div>
                    <span>Categoria</span>
                    <strong>{artwork.categoria_obra}</strong>
                  </div>
                </div>

                {artwork.edital && (
                  <div className={styles.infoItem}>
                    <FolderOpen size={18} />

                    <div>
                      <span>Edital</span>

                      <strong>{artwork.edital.titulo_evento}</strong>
                    </div>
                  </div>
                )}

                {artwork.data_envio && (
                  <div className={styles.infoItem}>
                    <CalendarDays size={18} />

                    <div>
                      <span>Data de envio</span>

                      <strong>
                        {formatDate
                          ? formatDate(artwork.data_envio)
                          : artwork.data_envio}
                      </strong>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </main>

          <footer className={styles.footer}>
            <button className={styles.cancel} onClick={onClose}>
              Fechar
            </button>

            {artwork.status === "pendente" && (
              <>
                <button className={styles.reject} onClick={onReject}>
                  Rejeitar
                </button>

                <button className={styles.approve} onClick={onApprove}>
                  Aprovar
                </button>
              </>
            )}
          </footer>
        </div>
      </div>

      <ApprovalModal
        isOpen={showApproval}
        obra={artwork.titulo_obra}
        loading={isUpdating}
        onCancel={onCancelApproval}
        onConfirm={onConfirmApproval}
      />

      <RejectionModal
        isOpen={showRejection}
        obra={artwork.titulo_obra}
        loading={isUpdating}
        onCancel={onCancelRejection}
        onConfirm={onConfirmRejection}
      />
    </>
  );
}
