import { useState } from "react"; // Remova useEffect
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

import ForgotPasswordModal from '../ForgotPassword/ForgotPasswordModal';
import ResetPasswordModal from '../ResetPassword/ResetPasswordModal';
import { InputField } from "../InputField";
import styles from "./style.module.css";

interface LoginFormInputs {
  email: string;
  senha: string;
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // 1. LER A URL
  const [searchParams, setSearchParams] = useSearchParams();
  const resetTokenFromUrl = searchParams.get('token');

  // 2. ESTADO DERIVADO (A Correção Mágica ✨)
  // Se o token existe (não é null), o modal ESTÁ aberto. Se for null, está fechado.
  // Não precisa de useState nem useEffect!
  const isResetOpen = !!resetTokenFromUrl; 

  // Estado apenas para o modal de "Esqueci a senha" (esse sim precisa de state pois não vem da URL)
  const [isForgotOpen, setIsForgotOpen] = useState(false);

  // --- REMOVIDO TODO O BLOCO useEffect ---
  // A lógica antiga causava o erro. Agora é automático.

  const handleCloseReset = () => {
    // Ao limpar a URL, a variável isResetOpen vira 'false' automaticamente
    setSearchParams({}); 
    navigate('/login');
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>();

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      setErrorMessage("");
      const response = await axios.post("http://localhost:3333/auth/login", data);
      const { token } = response.data;

      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (error: any) {
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Ocorreu um erro ao tentar entrar.");
      }
    }
  };

  const handleGoogleLogin = async () => {
    console.log("Fluxo do Google pendente");
  };
  
  return (
    <div className={styles.formContainer}>
      <div className={styles.header}>
        <h2>Login</h2>
      </div>

      {errorMessage && <div className={styles.errorBanner}>{errorMessage}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <InputField
          label="Email"
          placeholder="seu@email.com"
          type="email"
          icon={<Mail size={20} color="#9CA3AF" />}
          {...register("email", {
            required: "E-mail é obrigatório",
            pattern: { value: /^\S+@\S+$/i, message: "E-mail inválido" },
          })}
          error={errors.email?.message}
        />

        <div className={styles.passwordWrapper}>
          <InputField
            label="Senha"
            placeholder="********"
            type={showPassword ? "text" : "password"}
            icon={<Lock size={20} color="#9CA3AF" />}
            {...register("senha", { required: "Senha é obrigatória" })}
            error={errors.senha?.message}
          />
          <button
            type="button"
            className={styles.eyeButton}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className={styles.forgotPassword}>
           <button 
             type="button" 
             onClick={() => setIsForgotOpen(true)}
             style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit', color: 'inherit' }}
           >
             <span style={{ color: '#FBBF24', fontWeight: 600 }}>Esqueci a senha</span>
           </button>
        </div>

        <div className={styles.actions}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </div>
      </form>

      <div className={styles.divider}>
        <span>ou</span>
      </div>

      <button
        type="button"
        className={styles.googleButton}
        onClick={handleGoogleLogin}
      >
        <span className={styles.googleIcon}>G</span>
        Entrar com Google
      </button>

      <div className={styles.footer}>
        <span>Não tem uma conta? </span>
        <Link to="/register">Cadastre-se</Link>
      </div>

      <ForgotPasswordModal 
        isOpen={isForgotOpen} 
        onClose={() => setIsForgotOpen(false)} 
      />

      <ResetPasswordModal 
         isOpen={isResetOpen} // Agora usa a variável calculada
         token={resetTokenFromUrl}
         onClose={handleCloseReset}
       />
    </div>
  );
}