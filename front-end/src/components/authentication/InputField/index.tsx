import type { InputHTMLAttributes } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import styles from "./style.module.css";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: string;
  register: UseFormRegisterReturn;
  error?: string;
}

export function InputField({
  label,
  icon,
  register,
  error,
  type = "text",
  ...rest
}: InputFieldProps) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>

      <div className={`${styles.inputWrapper} ${error ? styles.error : ""}`}>
        <img src={icon} alt="" className={styles.icon} />

        <input
          type={type}
          className={styles.input}
          {...register}
          {...rest}
        />
      </div>

      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}
