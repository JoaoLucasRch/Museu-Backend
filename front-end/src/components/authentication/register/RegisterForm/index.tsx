import { Eye, EyeOff } from "lucide-react";

import { InputField } from "@/components/common";

import RegisterHeader from "@/components/authentication/register/RegisterHeader";
import RegisterGoogle from "@/components/authentication/register/RegisterGoogle";
import RegisterActions from "@/components/authentication/register/RegisterActions";
import RegisterFooter from "@/components/authentication/register/RegisterFooter";

import useRegister from "@/hooks/auth/useRegister";

import styles from "./RegisterForm.module.css";

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    watch,
    errors,
    isSubmitting,

    showPassword,
    setShowPassword,

    showConfirmPassword,
    setShowConfirmPassword,

    errorMessage,
    successMessage,

    registerUser,

    googleClientId,
    googleContainerRef,
    containerWidth,
    isGoogleLoading,
    registerGoogle,
    handleGoogleError,
  } = useRegister();

  return (
    <div className={styles.formContainer}>

      <RegisterActions
        onBack={() => (window.location.href = "/")}
      />

      <div className={styles.scrollArea}>

        <RegisterHeader />

        {errorMessage && (
          <div className={styles.errorBanner}>
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className={styles.successBanner}>
            {successMessage}
          </div>
        )}

        <form
          className={styles.form}
          onSubmit={handleSubmit(registerUser)}
        >

          <InputField
            label="Nome completo"
            type="text"
            register={register("nome", {
              required: "Nome obrigatório",
            })}
            error={errors.nome?.message}
          />

          <InputField
            label="Email"
            type="email"
            register={register("email", {
              required: "Email obrigatório",
            })}
            error={errors.email?.message}
          />

          <InputField
            label="Telefone"
            type="text"
            register={register("contato")}
            error={errors.contato?.message}
          />

          <div className={styles.passwordWrapper}>
            <InputField
              label="Senha"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              register={register("senha", {
                required: "Senha obrigatória",
              })}
              error={errors.senha?.message}
            />

            <button
              type="button"
              className={styles.eyeButton}
              onClick={() =>
                setShowPassword(!showPassword)
              }
              disabled={
                isSubmitting ||
                isGoogleLoading
              }
            >
              {showPassword
                ? <EyeOff size={18}/>
                : <Eye size={18}/>
              }
            </button>
          </div>

          <div className={styles.passwordWrapper}>
            <InputField
              label="Confirmar senha"
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              register={register(
                "confirmarSenha",
                {
                  validate: (value) =>
                    value === watch("senha") ||
                    "As senhas não coincidem",
                }
              )}
              error={
                errors.confirmarSenha?.message
              }
            />

            <button
              type="button"
              className={styles.eyeButton}
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
              disabled={
                isSubmitting ||
                isGoogleLoading
              }
            >
              {showConfirmPassword
                ? <EyeOff size={18}/>
                : <Eye size={18}/>
              }
            </button>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={
              isSubmitting ||
              isGoogleLoading
            }
          >
            {isSubmitting
              ? "Cadastrando..."
              : "Cadastrar"}
          </button>

        </form>

        <RegisterGoogle
          googleClientId={googleClientId}
          containerWidth={containerWidth}
          googleContainerRef={googleContainerRef}
          onSuccess={registerGoogle}
          onError={handleGoogleError}
        />

        <RegisterFooter />

      </div>

    </div>
  );
}