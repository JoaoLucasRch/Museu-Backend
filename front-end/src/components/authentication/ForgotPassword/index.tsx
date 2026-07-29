import { useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import axios from "axios";

import {
  InputField,
  CancelButton,
} from "@/components/common";

import styles from "./ForgotPasswordModal.module.css";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ForgotPasswordForm {
  email: string;
}

export default function ForgotPasswordModal({
  isOpen,
  onClose,
}: ForgotPasswordModalProps) {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordForm>();

  if (!isOpen) return null;

  function handleClose() {
    setStatus("idle");
    setMessage("");
    reset();
    onClose();
  }

  async function onSubmit(
    data: ForgotPasswordForm
  ) {
    try {
      setStatus("loading");
      setMessage("");

      await axios.post(
        "http://localhost:3333/auth/forgot-password",
        data
      );

      setStatus("success");

      setMessage(
        "Enviamos um código para o seu e-mail. Utilize-o para redefinir sua senha."
      );

      setTimeout(handleClose, 3000);

    } catch {

      setStatus("error");

      setMessage(
        "Não foi possível enviar o código. Verifique o e-mail informado."
      );
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>

        <div className={styles.header}>

          <div className={styles.headerText}>

            <span className={styles.subtitle}>
              RECUPERAÇÃO
            </span>

            <h2 className={styles.title}>
              Esqueci minha senha
            </h2>

          </div>

          <button
            type="button"
            onClick={handleClose}
            className={styles.closeButton}
          >
            <X size={20} />
          </button>

        </div>

        <p className={styles.description}>
          Informe o e-mail cadastrado. Enviaremos um código para redefinição da senha.
        </p>

        {status === "success" ? (

          <div className={styles.successMessage}>
            {message}
          </div>

        ) : (

          <form onSubmit={handleSubmit(onSubmit)}>

            <InputField
              label="E-mail"
              type="email"
              register={register("email", {
                required: "E-mail é obrigatório",
                pattern: {
                  value: /^\S+@\S+\.\S+$/i,
                  message: "E-mail inválido",
                },
              })}
              error={errors.email?.message}
            />

            {status === "error" && (
              <div className={styles.errorMessage}>
                {message}
              </div>
            )}

            <div className={styles.actions}>

              <CancelButton
                onClick={handleClose}
                className={styles.cancelButton}
                label="Cancelar"
              />

              <button
                type="submit"
                className={styles.submitButton}
                disabled={status === "loading"}
              >
                {status === "loading"
                  ? "Enviando..."
                  : "Enviar código"}
              </button>

            </div>

          </form>

        )}

      </div>
    </div>
  );
}