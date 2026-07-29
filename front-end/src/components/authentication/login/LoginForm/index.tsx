import { Eye, EyeOff, ArrowLeft } from "lucide-react";

import { InputField } from "@/components/common";

import ForgotPasswordModal from "@/components/authentication/forgotPassword";
import ResetPasswordModal from "@/components/authentication/resetPassword";

import LoginHeader from "@/components/authentication/login/LoginHeader";
import LoginActions from "@/components/authentication/login/LoginActions/LoginActions";
import LoginGoogle from "@/components/authentication/login/LoginGoogle";
import LoginFooter from "@/components/authentication/login/LoginFooter";

import useLogin from "@/hooks/auth/useLogin";
import styles from "./LoginForm.module.css";

export default function LoginForm() {

  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    showPassword,
    setShowPassword,
    errorMessage,
    googleClientId,
    containerWidth,
    googleContainerRef,
    isGoogleLoading,
    isForgotOpen,
    setIsForgotOpen,
    isResetOpen,
    resetToken,
    handleCloseReset,
    login,
    loginGoogle,
    handleGoogleError,
  } = useLogin();

  return (
    <div className={styles.formContainer}>

      <div className={styles.scrollArea}>
        <div className={styles.content}>
          <button
            type="button"
            className={styles.backButton}
            onClick={() => (window.location.href = "/")}
          >
            <ArrowLeft size={18} />
            Voltar ao site
          </button>

          <LoginHeader />

          {errorMessage && (
            <div className={styles.errorBanner}>
              {errorMessage}
            </div>
          )}

          <form
            className={styles.form}
            onSubmit={handleSubmit(login)}
          >

            <InputField
              label="Email"
              type="email"
              register={register("email", {
                required: "E-mail obrigatório",
              })}
              error={errors.email?.message}
            />

            <div className={styles.passwordWrapper}>
              <InputField
                label="Senha"
                type={showPassword ? "text" : "password"}
                register={register("senha", {
                  required: "Senha obrigatória",
                })}
                error={errors.senha?.message}
              />

              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => setShowPassword(!showPassword)}
                disabled={
                  isSubmitting ||
                  isGoogleLoading
                }
              >
                {showPassword
                  ? <EyeOff size={18} />
                  : <Eye size={18} />}
              </button>
            </div>

            <div className={styles.forgotPassword}>
              <button
                type="button"
                className={styles.forgotButton}
                onClick={() => setIsForgotOpen(true)}
              >
                Esqueci a senha
              </button>
            </div>

            <LoginActions
              isSubmitting={isSubmitting}
              isGoogleLoading={isGoogleLoading}
            />

          </form>

          <LoginGoogle
            clientId={googleClientId}
            containerWidth={containerWidth}
            containerRef={googleContainerRef}
            loading={isGoogleLoading}
            onSuccess={loginGoogle}
            onError={handleGoogleError}
          />

          <LoginFooter />

        </div>
      </div>

      <ForgotPasswordModal
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
      />

      <ResetPasswordModal
        isOpen={isResetOpen}
        token={resetToken}
        onClose={handleCloseReset}
      />

    </div>
  );
}