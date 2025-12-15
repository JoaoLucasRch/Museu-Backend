import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

import { InputField } from '../InputField'; 
import ForgotPasswordModal from '../ForgotPassword/ForgotPasswordModal';
import ResetPasswordModal from '../ResetPassword/ResetPasswordModal';
import styles from './style.module.css';  

interface LoginFormInputs {
  email: string;
  senha: string;
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  
  const googleContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // 1. LER A URL para reset de senha
  const [searchParams, setSearchParams] = useSearchParams();
  const resetTokenFromUrl = searchParams.get('token');
  
  // 2. Estado derivado para modal de reset
  const isResetOpen = !!resetTokenFromUrl;

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormInputs>();

  // Mede a largura do container para o botão do Google
  useEffect(() => {
    const updateWidth = () => {
      if (googleContainerRef.current) {
        const width = googleContainerRef.current.offsetWidth;
        setContainerWidth(width);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Login tradicional
  const onSubmit = async (data: LoginFormInputs) => {
    try {
      setErrorMessage('');
      
      const response = await axios.post('http://localhost:3333/auth/login', data);
      const { token } = response.data;

      localStorage.setItem('token', token);
      navigate('/dashboard'); 

    } catch (error: any) {
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Ocorreu um erro ao tentar entrar. Verifique sua conexão.');
      }
    }
  };

  // Login com Google
  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setIsGoogleLoading(true);
      setErrorMessage('');

      console.log('🔑 Token do Google recebido');
      
      const response = await axios.post(
        'http://localhost:3333/auth/login-google',
        {
          token: credentialResponse.credential
        }
      );

      console.log('✅ Resposta do backend:', response.data);
      
      const { token } = response.data;
      
      localStorage.setItem('token', token);
      navigate('/dashboard');
      
    } catch (error: any) {
      console.error('❌ Erro no Google login:', error);
      
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Erro ao autenticar com Google. Tente novamente.');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Erro no login com Google
  const handleGoogleError = () => {
    setErrorMessage('Falha ao fazer login com Google. Tente novamente.');
  };

  // Fechar modal de reset de senha
  const handleCloseReset = () => {
    // Limpa a URL
    setSearchParams({}); 
    navigate('/login');
  };

  // Client ID do Google
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  return (
    <div className={styles.formContainer}>
      <div className={styles.header}>
        <h2>Login</h2>
        <p>Conecte-se para aproveitar a experiência completa!</p>
      </div>

      {errorMessage && <div className={styles.errorBanner}>{errorMessage}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        
        <InputField
          label="Email"
          placeholder="seu@email.com"
          type="email"
          icon={<Mail size={20} color="#9CA3AF" />}
          {...register('email', { 
            required: 'E-mail é obrigatório',
            pattern: { value: /^\S+@\S+$/i, message: 'E-mail inválido' }
          })}
          error={errors.email?.message}
        />

        <div className={styles.passwordWrapper}>
          <InputField
            label="Senha"
            placeholder="********"
            type={showPassword ? 'text' : 'password'}
            icon={<Lock size={20} color="#9CA3AF" />}
            {...register('senha', { required: 'Senha é obrigatória' })}
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
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              padding: 0, 
              font: 'inherit', 
              color: 'inherit' 
            }}
          >
            <span style={{ color: '#FBBF24', fontWeight: 600 }}>Esqueci a senha</span>
          </button>
        </div>

        <div className={styles.actions}>
          <button 
            type="submit" 
            className={styles.submitButton} 
            disabled={isSubmitting || isGoogleLoading}
          >
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </div>
      </form>

      <div className={styles.divider}>
        <span>ou</span>
      </div>

      {/* Container do Google Login com referência */}
      <div 
        ref={googleContainerRef} 
        className={styles.googleButtonWrapper}
        style={{ minHeight: '44px' }}
      >
        {googleClientId ? (
          <GoogleOAuthProvider clientId={googleClientId}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap={false}
              theme="outline"
              size="large"
              width={containerWidth > 0 ? containerWidth.toString() : "300"} // Número em pixels
              text="continue_with"
              locale="pt-BR"
              shape="rectangular"
            />
          </GoogleOAuthProvider>
        ) : (
          <div className={styles.googleWarning}>
            <p>⚠️ Google Login não configurado</p>
            <small>Adicione VITE_GOOGLE_CLIENT_ID no .env</small>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <span>Não tem uma conta? </span>
        <Link to="/register">Cadastre-se</Link>
      </div>

      {/* Modais para recuperação de senha */}
      <ForgotPasswordModal 
        isOpen={isForgotOpen} 
        onClose={() => setIsForgotOpen(false)} 
      />

      <ResetPasswordModal 
        isOpen={isResetOpen}
        token={resetTokenFromUrl}
        onClose={handleCloseReset}
      />
    </div>
  );
}