import {
  X,
  CalendarDays,
  Palette,
  FolderOpen,
  User,
  Mail,
} from "lucide-react";

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

function getStatusClass(status: string) {
  const value = status.toLowerCase().trim();

  if (value.includes("pendente")) {
    return styles.statusPending;
  }

  if (value.includes("aprovad")) {
    return styles.statusApproved;
  }

  if (
    value.includes("reprovad") ||
    value.includes("rejeitad")
  ) {
    return styles.statusRejected;
  }

  // Uma obra exposta já foi aprovada.
  if (value.includes("expost")) {
    return styles.statusApproved;
  }

  return styles.statusPending;
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

  const hasActions = artwork.status.toLowerCase().trim().includes("pendente");

  const statusClass = getStatusClass(artwork.status);

  const links = artwork.imagens_obras
    ? artwork.imagens_obras
        .split(",")
        .map((link) => link.trim())
        .filter(Boolean)
    : [];

  return (
    <>
      <div className={styles.overlay} onClick={onClose}>
        <div
          className={`${styles.modal} ${statusClass}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.statusAccent} />

          <button
            className={styles.closeButton}
            onClick={onClose}
            type="button"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>

          <main className={styles.content}>
            <section className={styles.intro}>
              <div className={styles.eyebrowRow}>
                <span className={styles.eyebrow}>
                  Obra para análise
                </span>

                <StatusBadge status={artwork.status} />
              </div>

              <h2 className={styles.title}>
                {artwork.titulo_obra}
              </h2>

              <div className={styles.primaryMeta}>
                <div className={styles.metaItem}>
                  <Palette size={16} />
                  <span>{artwork.categoria_obra}</span>
                </div>

                {artwork.data_envio && (
                  <>
                    <span className={styles.metaDivider} />

                    <div className={styles.metaItem}>
                      <CalendarDays size={16} />

                      <span>
                        {formatDate
                          ? formatDate(artwork.data_envio)
                          : artwork.data_envio}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </section>

            <section className={styles.descriptionSection}>
              <span className={styles.sectionLabel}>
                Sobre a obra
              </span>

              <p className={styles.description}>
                {artwork.descricao_obra || "Não informada."}
              </p>
            </section>

            <section className={styles.artistSection}>
              <div className={styles.personItem}>
                <User size={17} />

                <div>
                  <span>Autor</span>

                  <strong>
                    {artwork.artista?.nome ?? "Não informado"}
                  </strong>
                </div>
              </div>

              <div className={styles.personItem}>
                <Mail size={17} />

                <div>
                  <span>E-mail</span>

                  {artwork.artista?.email ? (
                    <a
                      href={`mailto:${artwork.artista.email}`}
                      className={styles.emailLink}
                    >
                      {artwork.artista.email}
                    </a>
                  ) : (
                    <strong>Não informado</strong>
                  )}
                </div>
              </div>
            </section>

            {artwork.edital && (
              <section className={styles.editalSection}>
                <FolderOpen size={17} />

                <div>
                  <span>Edital de submissão</span>

                  <strong>
                    {artwork.edital.titulo_evento}
                  </strong>
                </div>
              </section>
            )}

            <section className={styles.filesSection}>
              <div className={styles.filesHeader}>
                <span>Arquivos enviados</span>

                {links.length > 0 && (
                  <span className={styles.filesCount}>
                    {links.length}
                  </span>
                )}
              </div>

              {links.length > 0 ? (
                <div className={styles.linksList}>
                  {links.map((link, index) => {
                    const href = normalizeUrl(link);

                    return (
                      <a
                        key={`${link}-${index}`}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.fileLink}
                      >
                        <span className={styles.fileIndex}>
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <span className={styles.fileName}>
                          {link}
                        </span>
                      </a>
                    );
                  })}
                </div>
              ) : (
                <p className={styles.emptyText}>
                  Nenhum arquivo informado.
                </p>
              )}
            </section>
          </main>

          {hasActions && (
            <footer className={styles.footer}>
              <button
                className={styles.rejectButton}
                onClick={onReject}
                type="button"
                disabled={isUpdating}
              >
                Não aprovar
              </button>

              <button
                className={styles.approveButton}
                onClick={onApprove}
                type="button"
                disabled={isUpdating}
              >
                Aprovar
              </button>
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
    </>
  );
}