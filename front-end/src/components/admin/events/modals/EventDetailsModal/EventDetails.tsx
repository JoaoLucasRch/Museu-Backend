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
  ImageOff,
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
  const [imageError, setImageError] = useState(false);

  console.log("EVENTO RECEBIDO PELO MODAL:", evento);
console.log("CRIADO POR:", evento.criado_por);
console.log("CRIADO POR ID:", evento.criado_por_id);

  const imageSrc = evento.imagem_evento
    ? evento.imagem_evento.startsWith("http")
      ? evento.imagem_evento
      : `http://localhost:3333/uploads/${evento.imagem_evento}`
    : null;

  const hasImage = Boolean(imageSrc) && !imageError;

  return (
    <>
      <div
        className={styles.overlay}
        onClick={onClose}
      >
        <div
          className={styles.modal}
          onClick={(e) => e.stopPropagation()}
        >
          {/* BOTÃO FECHAR */}
          <header className={styles.header}>
            <button
              onClick={onClose}
              className={styles.closeButton}
              type="button"
              aria-label="Fechar detalhes do evento"
            >
              <X
                size={19}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </button>
          </header>

          <main className={styles.content}>
            {/* IMAGEM */}
            {hasImage ? (
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
                  onError={() => setImageError(true)}
                />

                <span className={styles.zoomHint}>
                  <ZoomIn size={15} />
                  Ampliar
                </span>
              </button>
            ) : (
              <div className={styles.imagePlaceholder}>
                <ImageOff
                  size={32}
                  strokeWidth={1.3}
                  aria-hidden="true"
                />

                <span>Sem imagem</span>

                <span>
                  {evento.titulo_evento}
                </span>
              </div>
            )}

            {/* INFORMAÇÕES */}
            <section className={styles.section}>
              {/* TÍTULO */}
              <div className={styles.titleArea}>
                <span className={styles.eyebrow}>
                  Evento
                </span>

                <h2>{evento.titulo_evento}</h2>
              </div>

              {/* META-INFORMAÇÕES PRINCIPAIS */}
              <div className={styles.meta}>
                <div className={styles.metaItem}>
                  <MapPin
                    size={16}
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />

                  <span>
                    {evento.local_evento}
                  </span>
                </div>

                <div className={styles.metaDivider} />

                <div className={styles.metaItem}>
                  <CalendarDays
                    size={16}
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />

                  <span>
                    {formatDate(
                      evento.data_hora_inicio
                    )}
                    {" até "}
                    {formatDate(
                      evento.data_hora_fim
                    )}
                  </span>
                </div>
              </div>

              {/* DESCRIÇÃO */}
              {evento.descricao_evento && (
                <div className={styles.modalDescription}>
                  <p>
                    {evento.descricao_evento}
                  </p>
                </div>
              )}

              {/* INFORMAÇÕES ADMINISTRATIVAS */}
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <Tag
                    size={16}
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />

                  <div>
                    <span
                      className={styles.infoLabel}
                    >
                      Categoria
                    </span>

                    <strong>
                      {evento.tipo_evento}
                    </strong>
                  </div>
                </div>

                <div className={styles.infoItem}>
  <User
    size={16}
    strokeWidth={1.7}
    aria-hidden="true"
  />

  <div>
    <span className={styles.infoLabel}>
      Criado por
    </span>

    <strong>
      {evento.criado_por?.nome ?? "Não informado"}
    </strong>
  </div>
</div>
              </div>

              {/* EDITAL */}
              {evento.eh_edital && (
                <div className={styles.editalBox}>
                  <span className={styles.editalBadge}>
                    Edital
                  </span>

                  <div className={styles.editalInfo}>
                    <strong>
                      Período de submissão
                    </strong>

                    <p>
                      {evento.inicio_submissao
                        ? formatDate(
                          evento.inicio_submissao
                        )
                        : "—"}

                      {" até "}

                      {evento.fim_submissao
                        ? formatDate(
                          evento.fim_submissao
                        )
                        : "—"}
                    </p>
                  </div>
                </div>
              )}
            </section>
          </main>

          {/* AÇÕES */}
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
                    <Pencil
                      size={16}
                      strokeWidth={1.8}
                    />

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
                    <Trash2
                      size={16}
                      strokeWidth={1.8}
                    />

                    <span>Excluir</span>
                  </button>
                )}
              </div>
            </footer>
          )}
        </div>
      </div>

      {/* LIGHTBOX */}
      {lightboxOpen && hasImage && (
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
            <X
              size={24}
              strokeWidth={1.8}
            />
          </button>

          <img
            src={imageSrc}
            alt={evento.titulo_evento}
            className={styles.lightboxImage}
            onClick={(e) =>
              e.stopPropagation()
            }
            onError={() => {
              setImageError(true);
              setLightboxOpen(false);
            }}
          />
        </div>
      )}
    </>
  );
}