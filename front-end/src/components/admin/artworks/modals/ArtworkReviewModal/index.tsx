import { X, CalendarDays, Palette, FolderOpen, User, Mail } from "lucide-react";
import styles from "./ArtworkReviewModal.module.css";

import type { Artwork } from "../../../../../types/Artwork";

import StatusBadge from "./StatusBadge";
import ApprovalModal from "./ApprovalModal";
import RejectionModal from "./RejectionModal";
import ExhibitionModal from "./ExhibitionModal";

interface Props {
  isOpen: boolean;
  artwork: Artwork | null;
  isUpdating: boolean;
  showApproval: boolean;
  showRejection: boolean;
  showExhibition: boolean;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  onExhibit: () => void;
  onConfirmApproval: () => void;
  onConfirmRejection: () => void;
  onConfirmExhibition: () => void;
  onCancelApproval: () => void;
  onCancelRejection: () => void;
  onCancelExhibition: () => void;
  formatDate?: (date?: string) => string;
}

const normalizeUrl = (url: string) => {
  const value = url.trim();

  if (!value) return "";

  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("//")
  ) {
    return value.startsWith("//") ? `https:${value}` : value;
  }

  return `https://${value}`;
};

export default function ArtworkReviewModal({
  isOpen,
  artwork,
  isUpdating,
  showApproval,
  showRejection,
  showExhibition,
  onClose,
  onApprove,
  onReject,
  onExhibit,
  onConfirmApproval,
  onConfirmRejection,
  onConfirmExhibition,
  onCancelApproval,
  onCancelRejection,
  onCancelExhibition,
  formatDate,
}: Props) {
  if (!isOpen || !artwork) return null;

  const hasActions =
    artwork.status === "pendente" || artwork.status === "aprovada";

  return (
    <>
      <div className={styles.overlay} onClick={onClose}>
        <div
          className={styles.modal}
          onClick={(e) => e.stopPropagation()}
        >
          <header className={styles.header}>
            <div>
              <h2 className={styles.title}>{artwork.titulo_obra}</h2>
            </div>

            <button
              className={styles.closeButton}
              onClick={onClose}
              type="button"
              aria-label="Fechar"
            >
              <X size={20} />
            </button>
          </header>

          <main className={styles.content}>
            <section className={styles.sectionBox}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Informações da obra</h3>
                <StatusBadge status={artwork.status} />
              </div>

              <div className={styles.descriptionBox}>
                <label>Descrição</label>
                <p>{artwork.descricao_obra || "Não informada."}</p>
              </div>

              <div className={styles.linksBlock}>
                <label>Link Enviado</label>

                {artwork.imagens_obras ? (
                  <div className={styles.linkBox}>
                    {artwork.imagens_obras.split(",").map((link, index) => {
                      const cleanedLink = link.trim();
                      const href = normalizeUrl(cleanedLink);

                      return (
                        <a
                          key={index}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.fileLink}
                        >
                          {cleanedLink}
                        </a>
                      );
                    })}
                  </div>
                ) : (
                  <p className={styles.emptyText}>Nenhum arquivo informado.</p>
                )}
              </div>

              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <User size={18} />
                  <div>
                    <span>Autor</span>
                    <strong>
                      {artwork.artista?.nome ?? "Não informado"}
                    </strong>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <Mail size={18} />
                  <div>
                    <span>E-mail</span>
                    <strong>
                      {artwork.artista?.email ? (
                        <a
                          href={`mailto:${artwork.artista.email}`}
                          className={styles.emailLink}
                        >
                          {artwork.artista.email}
                        </a>
                      ) : (
                        "Não informado"
                      )}
                    </strong>
                  </div>
                </div>

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

          {hasActions && (
            <footer className={styles.footer}>
              {artwork.status === "pendente" && (
                <>
                  <button
                    className={styles.rejectButton}
                    onClick={onReject}
                    type="button"
                    disabled={isUpdating}
                  >
                    Rejeitar
                  </button>

                  <button
                    className={styles.approveButton}
                    onClick={onApprove}
                    type="button"
                    disabled={isUpdating}
                  >
                    Aprovar
                  </button>
                </>
              )}

              {artwork.status === "aprovada" && (
                <button
                  className={styles.exhibitButton}
                  onClick={onExhibit}
                  type="button"
                  disabled={isUpdating}
                >
                  Marcar como exposta
                </button>
              )}
            </footer>
          )}
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

      <ExhibitionModal
        isOpen={showExhibition}
        obra={artwork.titulo_obra}
        loading={isUpdating}
        onCancel={onCancelExhibition}
        onConfirm={onConfirmExhibition}
      />
    </>
  );
}