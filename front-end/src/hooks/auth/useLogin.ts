import { useEffect, useRef, useState, } from "react";
import { useForm, } from "react-hook-form";
import { useNavigate,useSearchParams, } from "react-router-dom";
import type { CredentialResponse, } from "@react-oauth/google";
import { AuthService, } from "@/services/auth/authService";

interface LoginFormInputs {
  email: string;
  senha: string;
}

export default function useLogin() {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] =
    useSearchParams();

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<LoginFormInputs>();

  const [showPassword, setShowPassword] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [isGoogleLoading, setIsGoogleLoading] =
    useState(false);

  const [containerWidth, setContainerWidth] =
    useState(0);

  const [isForgotOpen, setIsForgotOpen] =
    useState(false);

  const googleContainerRef =
    useRef<HTMLDivElement>(null);

  const resetToken =
    searchParams.get("token");

  const isResetOpen =
    Boolean(resetToken);

  const googleClientId =
    import.meta.env
      .VITE_GOOGLE_CLIENT_ID ?? "";

  useEffect(() => {
    function updateWidth() {
      if (googleContainerRef.current) {
        setContainerWidth(
          googleContainerRef.current.offsetWidth
        );
      }
    }

    updateWidth();

    window.addEventListener(
      "resize",
      updateWidth
    );

    return () =>
      window.removeEventListener(
        "resize",
        updateWidth
      );
  }, []);

  useEffect(() => {
    if (!AuthService.isAuthenticated())
      return;

    const role =
      AuthService.getRole();

    navigate(
      role === "ADMIN"
        ? "/admin/dashboard"
        : "/dashboard"
    );
  }, [navigate]);

  async function login(
    data: LoginFormInputs
  ) {
    try {
      setErrorMessage("");

      const role =
        await AuthService.login(data);

      navigate(
        role === "ADMIN"
          ? "/admin/dashboard"
          : "/dashboard"
      );
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message ??
          "Erro ao fazer login."
      );
    }
  }

  async function loginGoogle(
    credentialResponse: CredentialResponse
  ) {
    try {
      setIsGoogleLoading(true);

      setErrorMessage("");

      if (
        !credentialResponse.credential
      ) {
        throw new Error(
          "Token inválido."
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
        error.response?.data?.message ??
          "Erro ao autenticar com Google."
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

  function handleCloseReset() {
    setSearchParams({});
    navigate("/login");
  }

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    showPassword,
    setShowPassword,
    errorMessage,
    googleClientId,
    googleContainerRef,
    containerWidth,
    isGoogleLoading,
    isForgotOpen,
    setIsForgotOpen,
    isResetOpen,
    resetToken,
    handleCloseReset,
    login,
    loginGoogle,
    handleGoogleError,
  };
}