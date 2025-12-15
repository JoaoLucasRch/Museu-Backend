// src/components/dashboard/CreateArtworkModal/index.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import styles from './CreateArtworkModal.module.css';

// Serviços e Tipos
import  { ArtworkService} from '../../Profile/types/artworkService';
import type { CreateArtworkData } from '../../Profile/types/artworkService';
import type { Artwork } from '../../Profile/types/Artwork';

// Seu componente de botão
import CancelButton from '../../CancelButton';

interface CreateArtworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newArtwork: Artwork) => void;
}

export default function CreateArtworkModal({ isOpen, onClose, onSuccess }: CreateArtworkModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateArtworkData>();

  if (!isOpen) return null;

  const onSubmit = async (data: CreateArtworkData) => {
    setIsSubmitting(true);
    try {
      // Prepara os dados: Garante que imagem vazia vá como string vazia
      // OBS: Não enviamos datas aqui, pois é papel do Admin definir isso depois.
      const payload = {
        ...data,
        imagens_obras: data.imagens_obras || "",
      };

      const newArtwork = await ArtworkService.createArtwork(payload);
      
      onSuccess(newArtwork); 
      reset(); 
      onClose(); 
    } catch (error: any) {
      console.error("Erro ao criar obra:", error);
      
      const msg = error.response?.data?.message || "Verifique os campos.";
      alert(`Falha ao criar: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        
        <div className={styles.header}>
          <h2>Criar Nova Obra</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          
          {/* Título */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Título da obra</label>
            <input 
              className={styles.input} 
              placeholder="Insira o nome da obra"
              {...register("titulo_obra", { required: true })}
            />
            {errors.titulo_obra && <span style={{color:'red', fontSize:'0.8rem'}}>Campo obrigatório</span>}
          </div>

          {/* Descrição */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Descrição</label>
            <textarea 
              className={styles.textarea} 
              placeholder="Descreva sua obra..."
              {...register("descricao_obra", { required: true })}
            />
          </div>

          {/* Categoria */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Categoria</label>
            <select 
              className={styles.select}
              {...register("categoria_obra", { required: true })}
            >
              <option value="">Selecione uma categoria...</option>
              <option value="Pintura">Pintura</option>
              <option value="Escultura">Escultura</option>
              <option value="Fotografia">Fotografia</option>
              <option value="Arte Digital">Arte Digital</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          {/* Imagem */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Imagem da obra (Link)</label>
            <input 
              className={styles.input} 
              placeholder="Cole o link da imagem aqui"
              {...register("imagens_obras")}
            />
          </div>

          {/* Botões */}
          <div className={styles.actions}>
            <CancelButton onClick={onClose} />
            
            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Submeter'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}