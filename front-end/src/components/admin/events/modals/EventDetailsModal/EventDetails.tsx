import { useState } from "react";
import type { Event } from "@/types/Event";

import {
  CalendarDays,
  MapPin,
  Pencil,
  Tag,
  Trash2,
  User,
  X,
  ZoomIn,
} from "lucide-react";

import styles from "./EventDetailsModal.module.css";

interface Props {
  evento: Event;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  formatDate: (date: string) => string;
}

export default function EventDetails({
  evento,
  onClose,
  onEdit,
  onDelete,
  formatDate,
}: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const imageSrc =
    evento.imagem_evento ??
    "https://placehold.co/800x400?text=Sem+Imagem";

  return (
    <>
      <div className={styles.overlay} onClick={onClose}>
        <div
          className={styles.modal}
          onClick={(e) => e.stopPropagation()}
        >
          <header className={styles.header}>
            <div>
              <h2 className={styles.title}>
                {evento.titulo_evento}
              </h2>
            </div>

            <button
              onClick={onClose}
              className={styles.closeButton}
              type="button"
              aria-label="Fechar"
            >
              <X size={20} />
            </button>
          </header>

          <main className={styles.content}>
            <button
              type="button"
              className={styles.imageContainer}
              onClick={() => setLightboxOpen(true)}
              title="Clique para ampliar"
            >
              <img
                src={imageSrc}
                alt={evento.titulo_evento}
                className={styles.image}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://placehold.co/800x400?text=Sem+Imagem";
                }}
              />
              <span className={styles.zoomHint}>
                <ZoomIn size={16} />
                Ampliar
              </span>
            </button>

            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>
                Informações do evento
              </h3>

              <div className={styles.inputGroup}>
                <label>Descrição</label>
                <p className={styles.description}>
                  {evento.descricao_evento}
                </p>
              </div>

              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <MapPin size={18} />
                  <div>
                    <span className={styles.infoLabel}>Local</span>
                    <strong>{evento.local_evento}</strong>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <Tag size={18} />
                  <div>
                    <span className={styles.infoLabel}>Categoria</span>
                    <strong>{evento.tipo_evento}</strong>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <CalendarDays size={18} />
                  <div>
                    <span className={styles.infoLabel}>
                      Período do evento
                    </span>
                    <strong>
                      {formatDate(evento.data_hora_inicio)}
                      {" até "}
                      {formatDate(evento.data_hora_fim)}
                    </strong>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <User size={18} />
                  <div>
                    <span className={styles.infoLabel}>Criado por</span>
                    <strong>
                      {evento.criado_por?.nome ?? "Administrador"}
                    </strong>
                  </div>
                </div>
              </div>

              {evento.eh_edital && (
                <div className={styles.editalBox}>
                  <span className={styles.editalBadge}>Edital</span>
                  <div className={styles.editalInfo}>
                    <strong>Período de submissão</strong>
                    <p>
                      {evento.inicio_submissao
                        ? formatDate(evento.inicio_submissao)
                        : "—"}
                      {" até "}
                      {evento.fim_submissao
                        ? formatDate(evento.fim_submissao)
                        : "—"}
                    </p>
                  </div>
                </div>
              )}
            </section>
          </main>

          {(onEdit || onDelete) && (
            <footer className={styles.footer}>
              <div className={styles.actions}>
                {onEdit && (
                  <button
                    className={styles.editButton}
                    onClick={onEdit}
                    type="button"
                    title="Editar evento"
                  >
                    <Pencil size={18} />
                    <span>Editar</span>
                  </button>
                )}

                {onDelete && (
                  <button
                    className={styles.deleteButton}
                    onClick={onDelete}
                    type="button"
                    title="Excluir evento"
                  >
                    <Trash2 size={18} />
                    <span>Excluir</span>
                  </button>
                )}
              </div>
            </footer>
          )}
        </div>
      </div>

      {/* Lightbox — imagem em tela cheia */}
      {lightboxOpen && (
        <div
          className={styles.lightbox}
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            className={styles.lightboxClose}
            onClick={() => setLightboxOpen(false)}
            aria-label="Fechar imagem"
          >
            <X size={24} />
          </button>

          <img
            src={imageSrc}
            alt={evento.titulo_evento}
            className={styles.lightboxImage}
            onClick={(e) => e.stopPropagation()}
            onError={(e) => {
              e.currentTarget.src =
                "https://placehold.co/800x400?text=Sem+Imagem";
            }}
          />
        </div>
      )}
    </>
  );
}