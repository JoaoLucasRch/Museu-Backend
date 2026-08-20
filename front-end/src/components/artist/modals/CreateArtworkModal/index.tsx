import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";

import styles from "./CreateArtworkModal.module.css";

import { ArtworkService } from "@/services/artworks/artworkService";
import {
  EventService,
  type Edital,
} from "@/services/events/eventService";

import type {
  Artwork,
  CreateArtworkData,
} from "@/types/Artwork";

  
interface CreateArtworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newArtwork: Artwork) => void;
}


export default function CreateArtworkModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateArtworkModalProps) {

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [editais, setEditais] =
    useState<Edital[]>([]);


  const {
    register,
    handleSubmit,
    reset,
    formState:{ errors },
  } = useForm<CreateArtworkData>();


  useEffect(() => {

    if(!isOpen) return;

    EventService.getEditaisAbertos()
      .then(setEditais)
      .catch(console.error);

  },[isOpen]);



  if(!isOpen) return null;



  async function onSubmit(data:CreateArtworkData){

    setIsSubmitting(true);

    try{

      const payload = {
        ...data,
        imagens_obras:
          data.imagens_obras || "",

        edital_id:
          data.edital_id
            ? Number(data.edital_id)
            : undefined,
      };


      const artwork =
        await ArtworkService.createArtwork(payload);


      onSuccess(artwork);

      reset();
      onClose();


    }catch(error:any){

      alert(
        error.response?.data?.message ??
        "Erro ao cadastrar obra."
      );

    }finally{

      setIsSubmitting(false);

    }
  }



  return (

    <div className={styles.overlay}>

      <div className={styles.modal}>


        <header className={styles.header}>

          <div>

            <span className={styles.section}>
              OBRA
            </span>


            <h2 className={styles.title}>
              Adicionar obra
            </h2>


            <p className={styles.subtitle}>
              Envie sua obra para avaliação do museu.
            </p>

          </div>


          <button
            className={styles.closeButton}
            onClick={onClose}
          >
            <X size={20}/>
          </button>


        </header>




        <form
          className={styles.form}
          onSubmit={handleSubmit(onSubmit)}
        >


          <div className={styles.row}>


            <div className={styles.inputGroup}>

              <label>
                Título
              </label>


              <input
                placeholder="Nome da obra"
                {...register(
                  "titulo_obra",
                  {
                    required:true
                  }
                )}
              />


              {errors.titulo_obra && (
                <span className={styles.error}>
                  Campo obrigatório
                </span>
              )}

            </div>




            <div className={styles.inputGroup}>

              <label>
                Categoria
              </label>


              <select
                {...register(
                  "categoria_obra",
                  {
                    required:true
                  }
                )}
              >

                <option value="">
                  Selecione
                </option>

                <option value="Pintura">
                  Pintura
                </option>

                <option value="Escultura">
                  Escultura
                </option>

                <option value="Fotografia">
                  Fotografia
                </option>

                <option value="Arte Digital">
                  Arte Digital
                </option>

                <option value="Outro">
                  Outro
                </option>

              </select>


            </div>


          </div>





          <div className={styles.inputGroup}>

            <label>
              Submissão
            </label>


            <select
              {...register(
                "edital_id",
                {
                  setValueAs:(value)=>
                    value === ""
                    ? undefined
                    : Number(value)
                }
              )}
            >

              <option value="">
                Exponha sua Arte
              </option>


              {editais.map((edital)=>(

                <option
                  key={edital.id_evento}
                  value={edital.id_evento}
                >
                  {edital.titulo_evento}
                </option>

              ))}


            </select>


          </div>





          <div className={styles.inputGroup}>

            <label>
              Imagem
            </label>


            <input
              placeholder="https://exemplo.com/imagem.jpg"
              {...register(
                "imagens_obras",
                {
                  required:true
                }
              )}
            />


          </div>





          <div className={styles.inputGroup}>

            <label>
              Descrição
            </label>


            <textarea

              placeholder="Conte sobre a obra, inspiração ou técnica utilizada..."

              {...register(
                "descricao_obra",
                {
                  required:true
                }
              )}

            />

          </div>





          <footer className={styles.footer}>


            <button

              type="button"

              className={styles.cancelButton}

              onClick={onClose}

              disabled={isSubmitting}

            >
              Cancelar
            </button>



            <button

              type="submit"

              className={styles.submitButton}

              disabled={isSubmitting}

            >

              {isSubmitting
                ? "Enviando..."
                : "Enviar obra"}

            </button>


          </footer>


        </form>


      </div>

    </div>

  );
}