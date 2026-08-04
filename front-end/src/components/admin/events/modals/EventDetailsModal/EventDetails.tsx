import type { Event } from "@/types/Event";

import {
  CalendarDays,
  MapPin,
  Pencil,
  Tag,
  Trash2,
  User,
  X,
} from "lucide-react";

import styles from "./EventDetailsModal.module.css";

interface Props {
  evento: Event;

  onClose: () => void;

  onEdit?: () => void;

  onDelete?: () => void;

  formatDate: (
    date: string
  ) => string;
}

export default function EventDetails({
  evento,
  onClose,
  onEdit,
  onDelete,
  formatDate,
}: Props) {
  return (
    <div
      className={styles.overlay}
      onClick={onClose}
    >
      <div
        className={styles.modal}
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <header className={styles.header}>
          <div>
            <h2>
              {evento.titulo_evento}
            </h2>

            <p className={styles.subtitle}>
              Visualização das informações do evento.
            </p>
          </div>

          <button
            onClick={onClose}
            className={styles.close}
            type="button"
          >
            <X size={20} />
          </button>
        </header>

        <div className={styles.content}>
          <div className={styles.imageContainer}>
            <img
              src={
                evento.imagem_evento ??
                "https://placehold.co/800x400?text=Sem+Imagem"
              }
              alt={evento.titulo_evento}
              className={styles.image}
              onError={(e) => {
                e.currentTarget.src =
                  "https://placehold.co/800x400?text=Sem+Imagem";
              }}
            />
          </div>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>
              Informações do evento
            </h3>

            <div className={styles.group}>
              <label>
                Descrição
              </label>

              <p className={styles.description}>
                {evento.descricao_evento}
              </p>
            </div>

            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <MapPin size={18} />

                <div>
                  <span className={styles.infoLabel}>
                    Local
                  </span>

                  <strong>
                    {evento.local_evento}
                  </strong>
                </div>
              </div>

              <div className={styles.infoItem}>
                <Tag size={18} />

                <div>
                  <span className={styles.infoLabel}>
                    Categoria
                  </span>

                  <strong>
                    {evento.tipo_evento}
                  </strong>
                </div>
              </div>

              <div className={styles.infoItem}>
                <CalendarDays size={18} />

                <div>
                  <span className={styles.infoLabel}>
                    Período do evento
                  </span>

                  <strong>
                    {formatDate(
                      evento.data_hora_inicio
                    )}
                    {" — "}
                    {formatDate(
                      evento.data_hora_fim
                    )}
                  </strong>
                </div>
              </div>

              <div className={styles.infoItem}>
                <User size={18} />

                <div>
                  <span className={styles.infoLabel}>
                    Criado por
                  </span>

                  <strong>
                    {evento.criado_por?.nome ??
                      "Administrador"}
                  </strong>
                </div>
              </div>
            </div>

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
        </div>

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

                <span>
                  Editar
                </span>
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

                <span>
                  Excluir
                </span>
              </button>
            )}
          </div>

          <button
            className={styles.closeButton}
            onClick={onClose}
            type="button"
          >
            Fechar
          </button>
        </footer>
      </div>
    </div>
  );
}