import { useEffect, useRef, useState, } from "react";
import {useForm, } from "react-hook-form";
import { useNavigate, } from "react-router-dom";
import type { CredentialResponse, } from "@react-oauth/google";
import { AuthService, } from "@/services/auth/authService";

interface RegisterFormInputs {
  nome: string;
  email: string;
  contato: string;
  senha: string;
  confirmarSenha: string;
}

export default function useRegister() {

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: {
      errors,
      isSubmitting
    }

  } = useForm<RegisterFormInputs>();

  const [
    showPassword,
    setShowPassword
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage
  ] = useState("");

  const [
    successMessage,
    setSuccessMessage
  ] = useState("");

  const [
    isGoogleLoading,
    setIsGoogleLoading
  ] = useState(false);

  const [
    containerWidth,
    setContainerWidth
  ] = useState(0);

  const googleContainerRef =
    useRef<HTMLDivElement>(null);

  const googleClientId =
    import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

  useEffect(() => {

    function updateWidth() {
      if (
        googleContainerRef.current
      ) {
        setContainerWidth(
          googleContainerRef.current
            .offsetWidth
        );
      }
    }

    updateWidth();
    window.addEventListener(
      "resize",
      updateWidth
    );
    return () => {
      window.removeEventListener(
        "resize",
        updateWidth
      );
    };
  }, []);

  async function registerUser(
    data: RegisterFormInputs
  ) {
    try {
      setErrorMessage("");
      setSuccessMessage("");
      await AuthService.register({
        nome: data.nome,
        email: data.email,
        contato: data.contato,
        senha: data.senha
      });
      setSuccessMessage(
        "Cadastro realizado com sucesso!"
      );
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message
        ||
        "Erro ao realizar cadastro."
      );
    }
  }

  async function registerGoogle(
    credentialResponse: CredentialResponse
  ) {

    try {
      setIsGoogleLoading(true);

      if (
        !credentialResponse.credential
      ) {
        throw new Error(
          "Token inválido"
        );
      }

      const role =
        await AuthService.loginGoogle(
          credentialResponse.credential
        );
      navigate(
        role === "ADMIN"
          ? "/admin/dashboard"
          : "/dashboard"
      );
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message
        ||
        "Erro ao cadastrar com Google."
      );
    } finally {
      setIsGoogleLoading(false);
    }
  }

  function handleGoogleError() {
    setErrorMessage(
      "Falha ao autenticar com Google."
    );
  }

  return {
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
  };
}