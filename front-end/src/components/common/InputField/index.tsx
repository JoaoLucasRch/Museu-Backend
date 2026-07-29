import type { ReactNode, InputHTMLAttributes } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

import styles from "./style.module.css";

interface InputFieldProps
  extends InputHTMLAttributes<HTMLInputElement> {

  label: string;

  register: UseFormRegisterReturn;

  error?: string;

  icon?: ReactNode;
}

export default function InputField({
  label,
  register,
  error,
  icon,
  type = "text",
  ...rest
}: InputFieldProps) {

  return (
    <div className={styles.field}>

      <div
        className={`${styles.inputWrapper} ${
          error ? styles.error : ""
        }`}
      >

        {icon && (
          <span className={styles.icon}>
            {icon}
          </span>
        )}

        <input
          type={type}
          className={styles.input}
          placeholder=" "
          {...register}
          {...rest}
        />

        {label && (
          <label className={styles.label}>
            {label}
          </label>
        )}

      </div>

      {error && (
        <span className={styles.errorText}>
          {error}
        </span>
      )}

    </div>
  );
}