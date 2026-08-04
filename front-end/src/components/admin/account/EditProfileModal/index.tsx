import {
  useEffect,
  useState,
} from "react";

import {
  useForm,
} from "react-hook-form";

import {
  X,
} from "lucide-react";

import styles from "./EditProfileModal.module.css";

import type {
  UserProfile,
} from "@/types/User";

import {
  UserService,
} from "@/services/users/userService";


interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onSuccess: (user: UserProfile) => void;
}


interface FormData {
  nome: string;
  email: string;
  contato: string;
}


export default function EditProfileModal({
  isOpen,
  onClose,
  currentUser,
  onSuccess,
}: Props) {

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);


  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
    },
  } = useForm<FormData>();


  useEffect(() => {

    if (
      isOpen &&
      currentUser
    ) {

      reset({
        nome: currentUser.nome,
        email: currentUser.email,
        contato: currentUser.contato ?? "",
      });

    }

  }, [
    isOpen,
    currentUser,
    reset,
  ]);


  async function handleUpdate(
    data: FormData
  ) {

    setIsSaving(true);

    try {

      const updated =
        await UserService.updateProfile(data);


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


  if (!isOpen) {
    return null;
  }


  return (
    <div className={styles.overlay}>

      <div className={styles.modal}>

        <header className={styles.header}>

          <div>

            <span className={styles.section}>
              CONTA
            </span>

            <h2>
              Editar perfil
            </h2>

            <p>
              Atualize suas informações pessoais.
            </p>

          </div>


          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className={styles.close}
          >
            <X size={20} />
          </button>

        </header>


        <form
          onSubmit={handleSubmit(handleUpdate)}
          className={styles.form}
        >

          <div className={styles.inputGroup}>

            <label>
              Nome
            </label>

            <input
              disabled={isSaving}
              {...register(
                "nome",
                {
                  required:
                    "Nome obrigatório",

                  minLength: {
                    value: 3,
                    message:
                      "Mínimo 3 caracteres",
                  },
                }
              )}
            />

            {
              errors.nome && (
                <span className={styles.error}>
                  {errors.nome.message}
                </span>
              )
            }

          </div>


          <div className={styles.inputGroup}>

            <label>
              E-mail
            </label>

            <input
              type="email"
              disabled={isSaving}
              {...register(
                "email",
                {
                  required:
                    "Email obrigatório",
                }
              )}
            />

            {
              errors.email && (
                <span className={styles.error}>
                  {errors.email.message}
                </span>
              )
            }

          </div>


          <div className={styles.inputGroup}>

            <label>
              Telefone
            </label>

            <input
              disabled={isSaving}
              placeholder="(94) 99999-9999"
              {...register("contato")}
            />

          </div>


          <footer className={styles.footer}>

            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className={styles.cancel}
            >
              Cancelar
            </button>


            <button
              type="submit"
              disabled={isSaving}
              className={styles.save}
            >
              {
                isSaving
                  ? "Salvando..."
                  : "Salvar alterações"
              }
            </button>

          </footer>

        </form>

      </div>

    </div>
  );
}