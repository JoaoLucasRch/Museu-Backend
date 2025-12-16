import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { X, Pencil, Upload } from "lucide-react";
import styles from "./EditProfileModal.module.css";

import type { UserProfile } from "../types/User";
import { UserService } from "../types/UserService";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onSuccess: (updatedUser: UserProfile) => void;
}

// Interface específica para o formulário
interface UpdateProfileFormData {
  nome: string;
  email: string;
  contato: string;
  bio: string;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  currentUser,
  onSuccess,
}: EditProfileModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [fileError, setFileError] = useState<string>("");

  // Configuração do Formulário
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProfileFormData>();

  // Resetar o formulário com os dados atuais sempre que o modal abrir
  useEffect(() => {
    if (isOpen && currentUser) {
      reset({
        nome: currentUser.nome,
        email: currentUser.email,
        contato: currentUser.contato || "",
        bio: currentUser.bio || "",
      });
      setSelectedFile(null);
      setPreviewUrl("");
      setFileError("");
      setUploadProgress(0);
    }
  }, [isOpen, currentUser, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      return;
    }

    setFileError("");

    // Validação de tamanho (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setFileError("Arquivo muito grande. Tamanho máximo: 5MB.");
      return;
    }

    // Validação de tipo
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      setFileError("Formato inválido. Use JPG, PNG ou WEBP.");
      return;
    }

    setSelectedFile(file);
    setUploadProgress(0);

    // Criar preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: UpdateProfileFormData) => {
    setIsSaving(true);
    setUploadProgress(0);

    try {
      let updatedProfile: UserProfile;

      // Se houver arquivo selecionado, fazer upload primeiro
      if (selectedFile) {
        setUploadProgress(10);
        
        // Simular progresso para melhor UX
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 200);

        try {
          // Fazer upload da foto usando o UserService
          const photoResponse = await UserService.uploadProfilePhoto(selectedFile);
          setUploadProgress(100);
          
          // Atualizar o perfil com a nova URL da foto
          updatedProfile = await UserService.updateProfile({
            ...data,
            foto: photoResponse.foto,
          });
        } catch (uploadError) {
          clearInterval(progressInterval);
          setUploadProgress(0);
          throw uploadError;
        } finally {
          clearInterval(progressInterval);
        }
      } else {
        updatedProfile = await UserService.updateProfile(data);
      }

      onSuccess(updatedProfile);
      onClose();
      
    } catch (error: any) {
      console.error("Erro ao atualizar perfil:", error);
      
      if (error.message?.includes("token") || error.message?.includes("Sessão expirada")) {
        alert("Sessão expirada. Por favor, faça login novamente.");
      } else if (error.message?.includes("email") || error.message?.includes("já está em uso")) {
        alert("Este email já está em uso. Por favor, use outro.");
      } else if (error.message?.includes("arquivo") || error.message?.includes("Formato inválido")) {
        alert("Erro ao fazer upload da foto. Verifique o formato e tamanho.");
      } else {
        alert("Erro ao salvar alterações. Verifique os dados e tente novamente.");
      }
    } finally {
      setIsSaving(false);
      setUploadProgress(0);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Edite Seu Perfil</h2>
          <button 
            onClick={onClose} 
            className={styles.closeButton}
            disabled={isSaving}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.content}>
            {/* Coluna da Esquerda: Foto */}
            <div className={styles.photoSection}>
              <div className={styles.avatarWrapper}>
                <img
                  src={
                    previewUrl || 
                    currentUser?.foto || 
                    "https://via.placeholder.com/150"
                  }
                  alt="Avatar do usuário"
                  className={styles.avatar}
                />
                
                {/* Botão de upload */}
                <label 
                  htmlFor="file-upload" 
                  className={styles.editIconWrapper}
                  title="Alterar foto"
                >
                  <Pencil size={18} />
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileChange}
                    className={styles.fileInput}
                    disabled={isSaving}
                  />
                </label>
              </div>
              
              {/* Informações do arquivo */}
              {selectedFile && (
                <div className={styles.fileInfo}>
                  <p className={styles.fileName}>
                    <Upload size={12} /> {selectedFile.name}
                  </p>
                  <p className={styles.fileSize}>
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                  
                  {/* Barra de progresso */}
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progressFill}
                        style={{ width: `${uploadProgress}%` }}
                      />
                      <span className={styles.progressText}>
                        {uploadProgress}%
                      </span>
                    </div>
                  )}
                </div>
              )}
              
              {/* Mensagem de erro do arquivo */}
              {fileError && (
                <p className={styles.fileError}>{fileError}</p>
              )}
              
              <p className={styles.photoHint}>
                Clique no ícone para alterar sua foto
              </p>
            </div>

            {/* Coluna da Direita: Inputs */}
            <div className={styles.formSection}>
              {/* Nome */}
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  Nome
                </label>
                <input
                  type="text"
                  placeholder="Seu nome completo"
                  {...register("nome", { 
                    required: "Nome é obrigatório",
                    minLength: {
                      value: 3,
                      message: "Nome deve ter pelo menos 3 caracteres"
                    }
                  })}
                  className={styles.input}
                  disabled={isSaving}
                />
                {errors.nome && (
                  <span className={styles.errorText}>{errors.nome.message}</span>
                )}
              </div>

              {/* Contato */}
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  Contato
                </label>
                <input
                  type="text"
                  placeholder="(00) 00000-0000"
                  {...register("contato", {
                    pattern: {
                      value: /^[0-9\s()+-]*$/, 
                      message: "Apenas números e caracteres de telefone (+, -, (, )) são permitidos.",
                    },
                    //Validação para Tamanho
                    validate: (value) => {
                      const digitsOnly = (value || '').replace(/[^\d]/g, '');
                      if (digitsOnly.length === 0) {
                        return true;
                      }

                      if (digitsOnly.length < 8) {
                        return "O contato deve ter pelo menos 8 dígitos.";
                      }

                      return true; // Passou na validação
                    }
                  })}
                  className={styles.input}
                  disabled={isSaving}
                />
                {errors.contato && (
                  <span className={styles.errorText}>{errors.contato.message}</span>
                )}
              </div>

              {/* Email */}
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  Email
                </label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  {...register("email", { 
                    required: "Email é obrigatório",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Email inválido"
                    }
                  })}
                  className={styles.input}
                  disabled={isSaving}
                />
                {errors.email && (
                  <span className={styles.errorText}>{errors.email.message}</span>
                )}
              </div>

              {/* Bio */}
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  Bio
                </label>
                <textarea
                  placeholder="Fale um pouco sobre você..."
                  {...register("bio")}
                  className={styles.textarea}
                  disabled={isSaving}
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Rodapé: Botões */}
          <div className={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelBtn}
              disabled={isSaving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className={styles.saveBtn}
            >
              {isSaving ? (
                <>
                  {uploadProgress > 0 ? `Salvando... ${uploadProgress}%` : "Salvando..."}
                </>
              ) : (
                "Salvar"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}