// src/components/dashboard/EditProfileModal/index.tsx
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { X, User, Phone, Mail, PenLine, Pencil } from "lucide-react"; // Ícones
import styles from "./EditProfileModal.module.css";

// Imports de Tipos e Serviços (cuidado com o caminho relativo!)
import type { UserProfile, UpdateProfileData } from "../types/User";
import { UserService } from "../types/UserService";
import { InputField } from "../../authentication/InputField"; // Reutilizando seu InputField

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onSuccess: (updatedUser: UserProfile) => void; // Para atualizar o dashboard sem recarregar
}

export default function EditProfileModal({
  isOpen,
  onClose,
  currentUser,
  onSuccess,
}: EditProfileModalProps) {
  const [isSaving, setIsSaving] = useState(false);

  // Configuração do Formulário
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProfileData>();

  // Resetar o formulário com os dados atuais sempre que o modal abrir
  useEffect(() => {
    if (isOpen && currentUser) {
      reset({
        nome: currentUser.nome,
        email: currentUser.email,
        contato: currentUser.contato || "",
        bio: currentUser.bio || "",
        foto: currentUser.foto || "", // Por enquanto tratamos como string/url
      });
    }
  }, [isOpen, currentUser, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: UpdateProfileData) => {
    setIsSaving(true);
    try {
      // Chama o backend
      const updatedProfile = await UserService.updateProfile(data);

      // Avisa o componente pai (Dashboard) que atualizou
      onSuccess(updatedProfile);
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      alert("Erro ao salvar alterações. Verifique os dados.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Cabeçalho */}
        <div className={styles.header}>
          <h2>Edite Seu Perfil</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.content}>
            {/* Coluna da Esquerda: Foto */}
            <div className={styles.photoSection}>
              <div className={styles.avatarWrapper}>
                <img
                  src={currentUser?.foto || "https://via.placeholder.com/150"}
                  alt="Avatar"
                  className={styles.avatar}
                />
                {/* Botão de lápis sobre a foto (apenas visual por enquanto) */}
                <div className={styles.editIconWrapper} title="Alterar foto">
                  <Pencil size={18} />
                </div>
              </div>
            </div>

            {/* Coluna da Direita: Inputs */}
            <div className={styles.formSection}>
              <InputField
                label="Nome"
                placeholder="Seu nome completo"
                icon={<User size={20} color="#9CA3AF" />}
                {...register("nome", { required: "Nome é obrigatório" })}
                error={errors.nome?.message}
              />

              <InputField
                label="Contato"
                placeholder="(00) 00000-0000"
                icon={<Phone size={20} color="#9CA3AF" />}
                {...register("contato")}
              />

              <InputField
                label="Email"
                placeholder="seu@email.com"
                type="email"
                icon={<Mail size={20} color="#9CA3AF" />}
                {...register("email", { required: "Email é obrigatório" })}
                error={errors.email?.message}
              />

              <InputField
                label="Bio"
                placeholder="Fale um pouco sobre você..."
                icon={<PenLine size={20} color="#9CA3AF" />}
                {...register("bio")}
              />
            </div>
          </div>

          {/* Rodapé: Botões */}
          <div className={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelBtn}
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
