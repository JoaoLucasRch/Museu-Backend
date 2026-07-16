import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import styles from "./style.module.css";

import type { UserProfile } from "../../Profile/types/User";
import { UserService } from "../../Profile/types/UserService";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onSuccess: (updatedUser: UserProfile) => void;
}

interface UpdateProfileFormData {
  nome: string;
  email: string;
  contato: string;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  currentUser,
  onSuccess,
}: EditProfileModalProps) {
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProfileFormData>();

  useEffect(() => {
    if (isOpen && currentUser) {
      reset({
        nome: currentUser.nome,
        email: currentUser.email,
        contato: currentUser.contato || "",
      });
    }
  }, [isOpen, currentUser, reset]);

  const onSubmit = async (data: UpdateProfileFormData) => {
    setIsSaving(true);

    try {
      const updatedProfile = await UserService.updateProfile(data);
      onSuccess(updatedProfile);
      onClose();
    } catch (error: any) {
      console.error("Erro ao atualizar perfil:", error);
      
      if (error.message?.includes("token") || error.message?.includes("Sessão expirada")) {
        alert("Sessão expirada. Por favor, faça login novamente.");
      } else if (error.message?.includes("email") || error.message?.includes("já está em uso")) {
        alert("Este email já está em uso. Por favor, use outro.");
      } else {
        alert("Erro ao salvar alterações. Verifique os dados e tente novamente.");
      }
    } finally {
      setIsSaving(false);
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
            <div className={styles.formSection}>
              {/* Nome */}
              <div className={styles.inputGroup}>
                <label className={styles.label}>Nome</label>
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
                <label className={styles.label}>Contato</label>
                <input
                  type="text"
                  placeholder="(00) 00000-0000"
                  {...register("contato")}
                  className={styles.input}
                  disabled={isSaving}
                />
              </div>

              {/* Email */}
              <div className={styles.inputGroup}>
                <label className={styles.label}>Email</label>
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
              {isSaving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}