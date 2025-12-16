import React, { useState } from "react";
import styles from "./AdmRegisterForm.module.css";

interface AdmRegisterFormProps {
  onSubmit: (formData: RegisterFormData) => void;
  isLoading?: boolean;
}

export interface RegisterFormData {
  nome: string;
  email: string;
  senha: string;
  contato: string;
}

export default function AdmRegisterForm({ onSubmit, isLoading }: AdmRegisterFormProps) {
  const [formData, setFormData] = useState<RegisterFormData>({
    nome: "",
    email: "",
    senha: "",
    contato: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof RegisterFormData, boolean>>>({});

  const validateField = (name: keyof RegisterFormData, value: string): string => {
    switch (name) {
      case "nome":
        if (value.trim().length < 3) return "Nome deve ter pelo menos 3 letras";
        if (!/^[A-Za-zÀ-ÿ\s]+$/.test(value)) return "Nome deve conter apenas letras e espaços";
        return "";
      
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "Formato de email inválido";
        return "";
      
      case "senha":
        if (value.length < 8) return "Senha deve ter pelo menos 8 caracteres";
        return "";
      
      case "contato":
        if (!value.trim()) return "Contato é obrigatório";
        if (/[a-zA-Z]/.test(value)) return "Contato não pode conter letras";
        if (!/^[\d\s()+-]+$/.test(value)) return "Contato deve conter apenas números e caracteres de telefone";
        return "";
      
      default:
        return "";
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof RegisterFormData, string>> = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const fieldName = key as keyof RegisterFormData;
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (touched[name as keyof RegisterFormData]) {
      const error = validateField(name as keyof RegisterFormData, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    
    const error = validateField(name as keyof RegisterFormData, formData[name as keyof RegisterFormData]);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setTouched({
      nome: true,
      email: true,
      senha: true,
      contato: true,
    });

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleCancel = () => {
    setFormData({
      nome: "",
      email: "",
      senha: "",
      contato: "",
    });
    setErrors({});
    setTouched({});
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="nome">Nome *</label>
        <input
          type="text"
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.nome ? styles.inputError : ""}
          placeholder="Digite o nome completo"
          disabled={isLoading}
        />
        {errors.nome && <span className={styles.error}>{errors.nome}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email">Email *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.email ? styles.inputError : ""}
          placeholder="exemplo@email.com"
          disabled={isLoading}
        />
        {errors.email && <span className={styles.error}>{errors.email}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="senha">Senha *</label>
        <input
          type="password"
          id="senha"
          name="senha"
          value={formData.senha}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.senha ? styles.inputError : ""}
          placeholder="Mínimo 8 caracteres"
          disabled={isLoading}
        />
        {errors.senha && <span className={styles.error}>{errors.senha}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="contato">Contato *</label>
        <input
          type="tel"
          id="contato"
          name="contato"
          value={formData.contato}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.contato ? styles.inputError : ""}
          placeholder="(11) 91234-5678"
          disabled={isLoading}
        />
        {errors.contato && <span className={styles.error}>{errors.contato}</span>}
      </div>

      <div className={styles.buttonGroup}>
        <button
          type="button"
          onClick={handleCancel}
          className={`${styles.button} ${styles.cancelButton}`}
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className={`${styles.button} ${styles.submitButton}`}
          disabled={isLoading}
        >
          {isLoading ? "Cadastrando..." : "Cadastrar Admin"}
        </button>
      </div>
    </form>
  );
}