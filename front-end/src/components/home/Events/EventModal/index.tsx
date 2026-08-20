import styles from "./EventModal.module.css";

import {
  CalendarDays,
  MapPin,
  X,
  ImageOff,
} from "lucide-react";

import type { Event } from "@/types/Event";

interface Props {
  evento: Event | null;

  onClose: () => void;

  formatarHorario: (
    inicio: string,
    fim: string
  ) => string;
}

export default function EventModal({
  evento,
  onClose,
  formatarHorario,
}: Props) {
  if (!evento) {
    return null;
  }

  const imagemEvento =
    evento.imagem_evento?.trim() || null;

  const temImagem = Boolean(imagemEvento);

  return (
    <div
      className={styles.modalOverlay}
      onClick={onClose}
    >
      <div
        className={styles.modalContent}
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* =====================================================
            BOTÃO FECHAR
        ===================================================== */}

        <button
          className={styles.modalClose}
          onClick={onClose}
          type="button"
          aria-label="Fechar detalhes do evento"
        >
          <X
            size={19}
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </button>

        {/* =====================================================
            IMAGEM
        ===================================================== */}

        <div className={styles.modalImage}>
          {temImagem ? (
            <img
              src={imagemEvento!}
              alt={evento.titulo_evento}
              onError={(event) => {
                event.currentTarget.style.display =
                  "none";

                const placeholder =
                  event.currentTarget
                    .parentElement
                    ?.querySelector(
                      `.${styles.imageError}`
                    );

                placeholder?.classList.add(
                  styles.imageErrorVisible
                );
              }}
            />
          ) : null}

          <div
            className={`${styles.placeholderImage} ${
              temImagem
                ? styles.imageError
                : styles.imageErrorVisible
            }`}
          >
            <div className={styles.placeholderIcon}>
              <ImageOff
                size={32}
                strokeWidth={1.3}
                aria-hidden="true"
              />
            </div>

            <span>Sem imagem</span>

            <strong>
              {evento.titulo_evento}
            </strong>
          </div>
        </div>

        {/* =====================================================
            INFORMAÇÕES
        ===================================================== */}

        <div className={styles.modalInfo}>
          {/* TÍTULO */}

          <div className={styles.titleArea}>
            <span className={styles.eyebrow}>
              Evento
            </span>

            <h3>
              {evento.titulo_evento}
            </h3>
          </div>

          {/* ===================================================
              META-INFORMAÇÕES
          =================================================== */}

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
                {formatarHorario(
                  evento.data_hora_inicio,
                  evento.data_hora_fim
                )}
              </span>
            </div>
          </div>

          {/* ===================================================
              DESCRIÇÃO
          =================================================== */}

          {evento.descricao_evento && (
            <div className={styles.modalDescription}>
              <p>
                {evento.descricao_evento}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}