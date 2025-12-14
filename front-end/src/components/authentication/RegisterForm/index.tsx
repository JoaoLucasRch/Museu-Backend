import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

import { InputField } from "../InputField";
import styles from "./style.module.css";

import userIcon from "../../../icons/user.png";
import phoneIcon from "../../../icons/phone.png";
import mailIcon from "../../../icons/mail.png";
import lockIcon from "../../../icons/lock.png";

interface RegisterFormData {
  nome: string;
  contato: string;
  email: string;
  senha: string;
}

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>();

  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function formatPhone(value: string) {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 15);
  }

  async function onSubmit(data: RegisterFormData) {
    setApiError(null);

    try {
      await axios.post("http://localhost:3333/auth/register", {
        nome: data.nome,
        email: data.email,
        senha: data.senha,
        contato: data.contato.replace(/\D/g, ""),
      });

      setSuccess(true);
    } catch (error: any) {
      setApiError(
        error.response?.data?.message || "Erro ao realizar cadastro."
      );
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <h2 className={styles.title}>Cadastro</h2>
      <p className={styles.subtitle}>
        Crie sua conta e comece a compartilhar sua arte
      </p>

      <InputField
        label="Nome Completo"
        placeholder="Seu nome completo"
        icon={userIcon}
        register={register("nome", {
          required: "Nome obrigatório",
          minLength: {
            value: 3,
            message: "Nome deve ter no mínimo 3 caracteres",
          },
        })}
        error={errors.nome?.message}
      />

      <InputField
        label="Contato"
        placeholder="(00) 00000-0000"
        icon={phoneIcon}
        register={register("contato", {
          required: "Contato obrigatório",
          onChange: (e) =>
            setValue("contato", formatPhone(e.target.value)),
        })}
        error={errors.contato?.message}
      />

      <InputField
        label="Email"
        placeholder="seu@email.com"
        icon={mailIcon}
        type="email"
        register={register("email", {
          required: "Email obrigatório",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Email inválido",
          },
        })}
        error={errors.email?.message}
      />

      <InputField
        label="Senha"
        placeholder="********"
        icon={lockIcon}
        type="password"
        register={register("senha", {
          required: "Senha obrigatória",
          minLength: {
            value: 8,
            message: "Senha deve ter no mínimo 8 caracteres",
          },
        })}
        error={errors.senha?.message}
      />

      {apiError && <p className={styles.apiError}>{apiError}</p>}
      {success && (
        <p className={styles.success}>Cadastro realizado com sucesso!</p>
      )}

      <div className={styles.actions}>
        <button type="submit" className={styles.submit} disabled={isSubmitting}>
          Cadastre-se
        </button>
      </div>

      <p className={styles.loginLink}>
        Já tem uma conta? <a href="/login">Fazer login</a>
      </p>
    </form>
  );
}
