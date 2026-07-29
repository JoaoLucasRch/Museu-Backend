import { X } from "lucide-react";
import React, { useState } from "react";

import styles from "./RegisterAdminModal.module.css";

import type {
  RegisterAdminData,
} from "@/services/users/userService";

interface AdmRegisterFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    formData: RegisterAdminData
  ) => void | Promise<void>;
  isLoading?: boolean;
}

export default function RegisterAdminModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: AdmRegisterFormProps) {

  const [formData, setFormData] =
    useState<RegisterAdminData>({
      nome: "",
      email: "",
      senha: "",
      contato: "",
    });

  const [errors, setErrors] =
    useState<
      Partial<
        Record<
          keyof RegisterAdminData,
          string
        >
      >
    >({});

  const [touched, setTouched] =
    useState<
      Partial<
        Record<
          keyof RegisterAdminData,
          boolean
        >
      >
    >({});

  if (!isOpen) return null;

  function validateField(
    name: keyof RegisterAdminData,
    value: string
  ): string {

    switch (name) {

      case "nome":
        if (value.trim().length < 3)
          return "Nome deve ter pelo menos 3 letras";

        if (
          !/^[A-Za-zÀ-ÿ\s]+$/.test(value)
        )
          return "Nome deve conter apenas letras e espaços";

        return "";

      case "email":
        if (
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            value
          )
        )
          return "Formato de email inválido";

        return "";

      case "senha":
        if (value.length < 8)
          return "Senha deve ter pelo menos 8 caracteres";

        return "";

      case "contato":
        if (!value.trim())
          return "Telefone é obrigatório";

        if (/[a-zA-Z]/.test(value))
          return "Telefone não pode conter letras";

        if (
          !/^[\d\s()+-]+$/.test(value)
        )
          return "Telefone inválido";

        return "";

      default:
        return "";
    }
  }

  function validateForm() {

    const newErrors: Partial<
      Record<
        keyof RegisterAdminData,
        string
      >
    > = {};

    let valid = true;

    (
      Object.keys(formData) as Array<
        keyof RegisterAdminData
      >
    ).forEach((key) => {

      const error = validateField(
        key,
        formData[key]
      );

      if (error) {
        newErrors[key] = error;
        valid = false;
      }
    });

    setErrors(newErrors);

    return valid;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (
      touched[
      name as keyof RegisterAdminData
      ]
    ) {

      setErrors((prev) => ({
        ...prev,
        [name]: validateField(
          name as keyof RegisterAdminData,
          value
        ),
      }));

    }

  }

  function handleBlur(
    e: React.FocusEvent<HTMLInputElement>
  ) {

    const name =
      e.target.name as keyof RegisterAdminData;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(
        name,
        formData[name]
      ),
    }));

  }

  async function handleFormSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setTouched({
      nome: true,
      email: true,
      senha: true,
      contato: true,
    });

    if (!validateForm())
      return;

    await onSubmit(formData);

  }

  function handleCancel() {

    setFormData({
      nome: "",
      email: "",
      senha: "",
      contato: "",
    });

    setErrors({});
    setTouched({});

    onClose();

  }

  return (
    <div
      className={styles.overlay}
      onClick={handleCancel}
    >

      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >

        <header className={styles.header}>

          <div>
            <h2>
              Cadastrar Administrador
            </h2>

            <p className={styles.subtitle}>
              Crie uma nova conta administrativa para o sistema.
            </p>
          </div>


          <button
            type="button"
            className={styles.close}
            onClick={handleCancel}
            disabled={isLoading}
          >
            <X size={20} />
          </button>

        </header>


        <form
          className={styles.form}
          onSubmit={handleFormSubmit}
        >

          <main className={styles.content}>


            <div className={styles.grid}>


              <div className={styles.formGroup}>

                <label>
                  Nome *
                </label>

                <input
                  type="text"
                  name="nome"
                  placeholder="Nome completo"
                  value={formData.nome}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isLoading}
                />

                {errors.nome && (
                  <span className={styles.error}>
                    {errors.nome}
                  </span>
                )}

              </div>



              <div className={styles.formGroup}>

                <label>
                  Email *
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="email@exemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isLoading}
                />

                {errors.email && (
                  <span className={styles.error}>
                    {errors.email}
                  </span>
                )}

              </div>



              <div className={styles.formGroup}>

                <label>
                  Senha *
                </label>

                <input
                  type="password"
                  name="senha"
                  placeholder="Mínimo 8 caracteres"
                  value={formData.senha}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isLoading}
                />

                {errors.senha && (
                  <span className={styles.error}>
                    {errors.senha}
                  </span>
                )}

              </div>



              <div className={styles.formGroup}>

                <label>
                  Telefone *
                </label>

                <input
                  type="tel"
                  name="contato"
                  placeholder="(00) 00000-0000"
                  value={formData.contato}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isLoading}
                />

                {errors.contato && (
                  <span className={styles.error}>
                    {errors.contato}
                  </span>
                )}

              </div>


            </div>


          </main>



          <footer className={styles.footer}>

            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancelar
            </button>


            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {
                isLoading
                  ? "Cadastrando..."
                  : "Cadastrar Admin"
              }
            </button>

          </footer>


        </form>


      </div>

    </div>
  );

}