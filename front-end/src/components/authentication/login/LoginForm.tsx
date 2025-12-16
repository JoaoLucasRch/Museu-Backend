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
  
  const [searchParams, setSearchParams] = useSearchParams();
  const resetTokenFromUrl = searchParams.get('token');
  const isResetOpen = !!resetTokenFromUrl;

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormInputs>();

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

  // Login tradicional - ATUALIZAÇÃO MÍNIMA
  const onSubmit = async (data: LoginFormInputs) => {
    try {
      setErrorMessage('');
      
      // 1. Primeiro faz o login
      const loginResponse = await axios.post('http://localhost:3333/auth/login', data);
      const { token } = loginResponse.data;

      console.log('🔐 Login bem-sucedido. Token:', token ? '✅ Presente' : '❌ Ausente');

      localStorage.setItem('token', token);

      // 2. Depois busca o perfil para obter o role
      try {
        const profileResponse = await axios.get('http://localhost:3333/user/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const { role } = profileResponse.data;
        console.log('👤 Perfil carregado. Role:', role);
        
        localStorage.setItem('userRole', role);
        
        // 3. Redireciona baseado no role
        if (role === 'ADMIN') {
          console.log('🔄 Redirecionando ADMIN para /admin/dashboard');
          navigate('/admin/dashboard');
        } else {
          console.log('🔄 Redirecionando ARTISTA para /dashboard');
          navigate('/dashboard');
        }
        
      } catch (profileError) {
        console.error('❌ Erro ao carregar perfil:', profileError);
        // Se não conseguir carregar o perfil, assume que é ARTISTA
        localStorage.setItem('userRole', 'ARTISTA');
        navigate('/dashboard');
      }

    } catch (error: any) {
      console.error('❌ Erro no login:', error);
      
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Ocorreu um erro ao tentar entrar. Verifique sua conexão.');
      }
    }
  };

  // Login com Google - ATUALIZAÇÃO MÍNIMA
  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setIsGoogleLoading(true);
      setErrorMessage('');

      console.log('🔑 Token do Google recebido');
      
      // 1. Login com Google
      const loginResponse = await axios.post(
        'http://localhost:3333/auth/login-google',
        {
          token: credentialResponse.credential
        }
      );

      console.log('✅ Resposta do backend:', loginResponse.data);
      
      const { token } = loginResponse.data;
      localStorage.setItem('token', token);

      // 2. Busca o perfil para obter o role
      try {
        const profileResponse = await axios.get('http://localhost:3333/user/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const { role } = profileResponse.data;
        console.log('👤 Perfil carregado (Google). Role:', role);
        
        localStorage.setItem('userRole', role);
        
        // 3. Redireciona baseado no role
        if (role === 'ADMIN') {
          console.log('🔄 Redirecionando ADMIN (Google) para /admin/dashboard');
          navigate('/admin/dashboard');
        } else {
          console.log('🔄 Redirecionando ARTISTA (Google) para /dashboard');
          navigate('/dashboard');
        }
        
      } catch (profileError) {
        console.error('❌ Erro ao carregar perfil (Google):', profileError);
        localStorage.setItem('userRole', 'ARTISTA');
        navigate('/dashboard');
      }
      
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

  // O RESTANTE DO CÓDIGO PERMANECE EXATAMENTE IGUAL
  const handleGoogleError = () => {
    setErrorMessage('Falha ao fazer login com Google. Tente novamente.');
  };

  const handleCloseReset = () => {
    setSearchParams({}); 
    navigate('/login');
  };

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    if (token && userRole) {
      if (userRole === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [navigate]);

  // O RETURN/JSX PERMANECE EXATAMENTE IGUAL
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
          disabled={isSubmitting || isGoogleLoading}
        />

        <div className={styles.passwordWrapper}>
          <InputField
            label="Senha"
            placeholder="********"
            type={showPassword ? 'text' : 'password'}
            icon={<Lock size={20} color="#9CA3AF" />}
            {...register('senha', { required: 'Senha é obrigatória' })}
            error={errors.senha?.message}
            disabled={isSubmitting || isGoogleLoading}
          />
          <button
            type="button"
            className={styles.eyeButton}
            onClick={() => setShowPassword(!showPassword)}
            disabled={isSubmitting || isGoogleLoading}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className={styles.forgotPassword}>
          <button 
            type="button" 
            onClick={() => setIsForgotOpen(true)}
            className={styles.forgotButton}
            disabled={isSubmitting || isGoogleLoading}
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
              width={containerWidth > 0 ? containerWidth.toString() : "300"}
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