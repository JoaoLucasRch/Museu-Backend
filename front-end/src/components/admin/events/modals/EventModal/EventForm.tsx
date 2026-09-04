import { Upload } from "lucide-react";

import type { Event } from "@/types/Event";

import styles from "./EventModal.module.css";

interface FormData {
  titulo_evento: string;
  descricao_evento: string;
  local_evento: string;
  data_hora_inicio: string;
  data_hora_fim: string;
  tipo_evento: Event["tipo_evento"];
  eh_edital: boolean;
  inicio_submissao: string;
  fim_submissao: string;
  imagemPreview: string;
}

interface Props {
  formData: FormData;
  selectedFile: File | null;
  isSubmitting: boolean;
  uploadProgress: boolean;
  isCreateMode: boolean;
  onSubmit: () => void;
  onFileChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  setFormData: React.Dispatch<
    React.SetStateAction<FormData>
  >;
}

function getCurrentDateTimeLocal() {
  const now = new Date();
  const offset = now.getTimezoneOffset();

  return new Date(now.getTime() - offset * 60000)
    .toISOString()
    .slice(0, 16);
}

export default function EventForm({
  formData,
  selectedFile,
  isSubmitting,
  uploadProgress,
  isCreateMode,
  onSubmit,
  onFileChange,
  setFormData,
}: Props) {
  return (
    <>
      <main className={styles.form}>

        {/* =========================
            Informações do evento
        ========================== */}

        <section className={styles.sectionBlock}>

          <h3 className={styles.sectionBlockTitle}>
            Informações do evento
          </h3>

          <div className={styles.inputGroup}>
            <label>Título</label>

            <input
              placeholder="Digite o nome do evento"
              value={formData.titulo_evento}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  titulo_evento: e.target.value,
                }))
              }
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Descrição</label>

            <textarea
              placeholder="Descreva o evento"
              maxLength={191}
              value={formData.descricao_evento}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  descricao_evento: e.target.value,
                }))
              }
            />

            <span className={styles.characterCount}>
              {formData.descricao_evento.length}/191
            </span>
          </div>

          <div className={styles.row}>

            <div className={styles.inputGroup}>
              <label>Categoria</label>

              <select
                value={formData.tipo_evento}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    tipo_evento: e.target.value as Event["tipo_evento"],
                  }))
                }
              >
                <option value="">
                  Selecione
                </option>

                <option value="EXPOSICAO">
                  Exposição
                </option>

                <option value="OFICINA">
                  Oficina
                </option>

                <option value="PALESTRA">
                  Palestra
                </option>

                <option value="LANCAMENTO">
                  Lançamento
                </option>

                <option value="OUTRO">
                  Outro
                </option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label>Local</label>

              <input
                placeholder="Local do evento"
                value={formData.local_evento}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    local_evento: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className={styles.row}>

            <div className={styles.inputGroup}>
              <label>Início do evento</label>

              <input
                type="datetime-local"
                min={isCreateMode ? getCurrentDateTimeLocal() : undefined}
                value={formData.data_hora_inicio}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    data_hora_inicio: e.target.value,
                  }))
                }
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Fim do evento</label>

              <input
                type="datetime-local"
                min={
                  formData.data_hora_inicio ||
                  (isCreateMode ? getCurrentDateTimeLocal() : undefined)
                }
                value={formData.data_hora_fim}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    data_hora_fim: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        </section>

        {/* =========================
            Edital
        ========================== */}

        <section className={styles.sectionBlock}>

          <h3 className={styles.sectionBlockTitle}>
            Edital
          </h3>

          <label className={styles.checkboxGroup}>
            <input
              type="checkbox"
              checked={formData.eh_edital}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  eh_edital: e.target.checked,
                }))
              }
            />

            <span>
              Este evento possui edital para submissão de obras
            </span>
          </label>

          {formData.eh_edital && (
            <div className={styles.row}>

              <div className={styles.inputGroup}>
                <label>Início das submissões</label>

                <input
                  type="datetime-local"
                  value={formData.inicio_submissao}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      inicio_submissao: e.target.value,
                    }))
                  }
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Fim das submissões</label>

                <input
                  type="datetime-local"
                  value={formData.fim_submissao}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      fim_submissao: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          )}
        </section>

        {/* =========================
            Imagem
        ========================== */}

        <section className={styles.sectionBlock}>

          <h3 className={styles.sectionBlockTitle}>
            Imagem do evento
          </h3>

          <label className={styles.upload}>

            <input
              hidden
              type="file"
              accept="image/*"
              onChange={onFileChange}
            />

            {formData.imagemPreview ? (
              <img
                src={formData.imagemPreview}
                alt="Preview"
                className={styles.preview}
              />
            ) : (
              <div className={styles.uploadEmpty}>
                <Upload size={32} />

                <strong>Selecione uma imagem</strong>

                <span>JPG, PNG ou WEBP</span>
              </div>
            )}
          </label>

          {selectedFile && (
            <small>{selectedFile.name}</small>
          )}
        </section>
      </main>

      <footer className={styles.footer}>

        <button
          type="button"
          className={styles.submitButton}
          disabled={isSubmitting || uploadProgress}
          onClick={onSubmit}
        >
          {isSubmitting ? "Salvando..." : "Salvar Evento"}
        </button>
      </footer>
    </>
  );
}