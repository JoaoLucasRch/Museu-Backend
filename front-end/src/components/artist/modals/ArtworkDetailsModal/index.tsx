import { ExternalLink, X } from "lucide-react";

import styles from "./ArtworkDetailsModal.module.css";

import type { Artwork } from "@/types/Artwork";

interface ArtworkDetailsModalProps {
  isOpen: boolean;
  artwork: Artwork | null;
  onClose: () => void;
  onDelete: (artwork: Artwork) => void;
}

export default function ArtworkDetailsModal({
  isOpen,
  artwork,
  onClose,
  onDelete,
}: ArtworkDetailsModalProps) {
  if (!isOpen || !artwork) return null;

  const formatDate = (date?: string | null) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("pt-BR");
  };

  const origem =
    artwork.edital?.titulo_evento ??
    "Exponha sua Arte";

  const statusLabel = {
    pendente: "Pendente",
    aprovada: "Aprovada",
    rejeitada: "Rejeitada",
    exposta: "Em exposição",
  };

  const statusMessage = {
    pendente:
      "Aguardando avaliação da equipe do museu.",

    aprovada:
      "Aprovada para futuras exposições.",

    rejeitada:
      "Não selecionada nesta avaliação.",

    exposta:
      "Atualmente em exposição no museu.",
  };

  const canDelete =
    artwork.status !== "aprovada";


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
            <span className={styles.section}>
              OBRA
            </span>

            <h2>
              {artwork.titulo_obra}
            </h2>

            <p>
              {artwork.categoria_obra}
              {" • "}
              enviada em{" "}
              {formatDate(
                artwork.data_envio
              )}
            </p>
          </div>


          <button
            className={styles.closeButton}
            onClick={onClose}
          >
            <X size={20}/>
          </button>

        </header>


        <main className={styles.content}>


          <section className={styles.status}>

            <span
              className={`${styles.badge} ${
                styles[artwork.status]
              }`}
            >
              {statusLabel[artwork.status]}
            </span>

            <p>
              {statusMessage[artwork.status]}
            </p>

          </section>



          <section className={styles.description}>

            <span>
              DESCRIÇÃO
            </span>

            <p>
              {artwork.descricao_obra ||
                "Nenhuma descrição informada."}
            </p>

          </section>



          <section className={styles.details}>


            <div>
              <span>
                Evento
              </span>

              <strong>
                {origem}
              </strong>
            </div>



            <div>
              <span>
                Imagens
              </span>


              {artwork.imagens_obras ? (

                <a
                  href={artwork.imagens_obras}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Abrir coleção

                  <ExternalLink size={14}/>

                </a>

              ) : (

                <strong>
                  Não informado
                </strong>

              )}

            </div>


          </section>


        </main>



        {canDelete && (

          <footer className={styles.footer}>

            <button
              className={styles.deleteButton}
              onClick={() =>
                onDelete(artwork)
              }
            >
              Excluir obra
            </button>

          </footer>

        )}


      </div>
    </div>
  );
}