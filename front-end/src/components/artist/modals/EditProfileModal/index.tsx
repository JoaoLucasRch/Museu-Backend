import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";

import styles from "./EditProfileModal.module.css";

import type { UserProfile } from "@/types/User";
import { UserService } from "@/services/users/userService";

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

  async function onSubmit(data: UpdateProfileFormData) {
    setIsSaving(true);

    try {
      const updated = await UserService.updateProfile(data);

      onSuccess(updated);
      onClose();
    } catch (error: any) {
      alert(
        error.response?.data?.message ??
          "Não foi possível atualizar o perfil."
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>

        <div className={styles.header}>

          <div>
            <span className={styles.section}>
              PERFIL
            </span>

            <h2 className={styles.title}>
              Dados da conta
            </h2>

            <p className={styles.subtitle}>
              Atualize suas informações pessoais.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={styles.closeButton}
            disabled={isSaving}
          >
            <X size={20} />
          </button>

        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.form}
        >

          <div className={styles.inputGroup}>
            <label>Nome</label>

            <input
              placeholder="Seu nome"
              disabled={isSaving}
              {...register("nome", {
                required: "Nome obrigatório",
                minLength: {
                  value: 3,
                  message: "Mínimo de 3 caracteres",
                },
              })}
            />

            {errors.nome && (
              <span className={styles.error}>
                {errors.nome.message}
              </span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label>E-mail</label>

            <input
              type="email"
              placeholder="email@exemplo.com"
              disabled={isSaving}
              {...register("email", {
                required: "Email obrigatório",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Email inválido",
                },
              })}
            />

            {errors.email && (
              <span className={styles.error}>
                {errors.email.message}
              </span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label>Telefone</label>

            <input
              placeholder="(94) 99999-9999"
              disabled={isSaving}
              {...register("contato")}
            />
          </div>

          <div className={styles.footer}>

            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={isSaving}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className={styles.saveButton}
              disabled={isSaving}
            >
              {isSaving
                ? "Salvando..."
                : "Salvar alterações"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}