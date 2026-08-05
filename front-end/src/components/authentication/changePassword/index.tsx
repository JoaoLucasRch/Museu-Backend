import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Eye, EyeOff, Lock, X } from "lucide-react";

import {
  InputField,
  CancelButton,
} from "@/components/common";

import api from "@/services/api";

import styles from "./ChangePasswordModal.module.css";


interface Props {
  isOpen: boolean;
  onClose: () => void;
}


interface FormData {
  senhaAtual: string;
  novaSenha: string;
  confirmarSenha: string;
}


export default function ChangePasswordModal({
  isOpen,
  onClose,
}: Props) {

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const [message, setMessage] = useState("");


  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: {
      errors,
    },
  } = useForm<FormData>();


  if (!isOpen) {
    return null;
  }


  function handleClose() {
    setStatus("idle");
    setMessage("");

    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);

    reset();

    onClose();
  }


  async function onSubmit(data: FormData) {

    try {

      setStatus("loading");

      await api.patch(
        "/auth/change-password",
        {
          senhaAtual: data.senhaAtual,
          novaSenha: data.novaSenha,
        }
      );


      setStatus("success");

      setMessage(
        "Senha alterada com sucesso."
      );


      setTimeout(handleClose, 2000);


    } catch (error) {

      setStatus("error");

      if (axios.isAxiosError(error)) {

        setMessage(
          error.response?.data?.message ??
          "Não foi possível alterar a senha."
        );

      } else {

        setMessage(
          "Erro inesperado ao alterar senha."
        );

      }

    }
  }


  return (
    <div className={styles.overlay}>

      <div className={styles.modal}>

        <header className={styles.header}>

          <div>
            <span className={styles.subtitle}>
              SEGURANÇA
            </span>

            <h2>
              Alterar senha
            </h2>
          </div>


          <button
            type="button"
            className={styles.closeButton}
            onClick={handleClose}
          >
            <X size={20} />
          </button>

        </header>


        <p className={styles.description}>
          Informe sua senha atual e escolha uma nova senha para sua conta.
        </p>


        {
          status === "success" ? (

            <div className={styles.success}>
              {message}
            </div>

          ) : (

            <form onSubmit={handleSubmit(onSubmit)}>


              <div className={styles.passwordField}>

                <InputField
                  label="Senha atual"
                  type={showCurrent ? "text" : "password"}
                  icon={<Lock size={18} />}
                  register={register(
                    "senhaAtual",
                    {
                      required:
                        "Informe sua senha atual."
                    }
                  )}
                  error={errors.senhaAtual?.message}
                />


                <button
                  type="button"
                  className={styles.eyeButton}
                  onClick={() =>
                    setShowCurrent(value => !value)
                  }
                >
                  {
                    showCurrent
                      ? <EyeOff size={18} />
                      : <Eye size={18} />
                  }
                </button>

              </div>



              <div className={styles.passwordField}>

                <InputField
                  label="Nova senha"
                  type={showNew ? "text" : "password"}
                  icon={<Lock size={18} />}
                  register={register(
                    "novaSenha",
                    {
                      required:
                        "Informe uma nova senha.",

                      minLength: {
                        value: 6,
                        message:
                          "Mínimo de 6 caracteres."
                      }
                    }
                  )}
                  error={errors.novaSenha?.message}
                />


                <button
                  type="button"
                  className={styles.eyeButton}
                  onClick={() =>
                    setShowNew(value => !value)
                  }
                >
                  {
                    showNew
                      ? <EyeOff size={18} />
                      : <Eye size={18} />
                  }
                </button>

              </div>




              <div className={styles.passwordField}>

                <InputField
                  label="Confirmar nova senha"
                  type={showConfirm ? "text" : "password"}
                  icon={<Lock size={18} />}
                  register={register(
                    "confirmarSenha",
                    {
                      required:
                        "Confirme a senha.",

                      validate:
                        value =>
                          value === getValues("novaSenha")
                          ||
                          "As senhas não coincidem."
                    }
                  )}
                  error={errors.confirmarSenha?.message}
                />


                <button
                  type="button"
                  className={styles.eyeButton}
                  onClick={() =>
                    setShowConfirm(value => !value)
                  }
                >
                  {
                    showConfirm
                      ? <EyeOff size={18} />
                      : <Eye size={18} />
                  }
                </button>

              </div>



              {
                status === "error" && (

                  <div className={styles.error}>
                    {message}
                  </div>

                )
              }



              <div className={styles.actions}>

                <CancelButton
                  label="Cancelar"
                  onClick={handleClose}
                />


                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={
                    status === "loading"
                  }
                >

                  {
                    status === "loading"
                      ? "Salvando..."
                      : "Alterar senha"
                  }

                </button>

              </div>


            </form>

          )
        }

      </div>

    </div>
  );
}