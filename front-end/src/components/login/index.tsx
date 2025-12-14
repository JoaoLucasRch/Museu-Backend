import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

// REMOVIDO: import AuthLayout ...

// Ajuste o caminho se necessário (ex: './CancelButton' se estiver na mesma pasta)
import { InputField } from '../authentication/InputField'; 
import styles from './style.module.css';  

interface LoginFormInputs {
  email: string;
  senha: string;
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormInputs>();

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

  const handleGoogleLogin = async () => {
    console.log("Fluxo do Google pendente de biblioteca frontend");
  };

  // RETORNOU APENAS A DIV DO FORMULÁRIO
  return (
    <div className={styles.formContainer}>
      <div className={styles.header}>
        <h2>Login</h2>
        {/* Se quiser adicionar o subtítulo que estava no AuthLayout, descomente abaixo: */}
        {/* <p>Conecte-se para aproveitar a experiência completa!</p> */}
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
          <Link to="/forgot-password">Esqueci a senha</Link>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </div>
      </form>

      <div className={styles.divider}>
        <span>ou</span>
      </div>

      <button type="button" className={styles.googleButton} onClick={handleGoogleLogin}>
        <span className={styles.googleIcon}>G</span> 
        Entrar com Google
      </button>

      <div className={styles.footer}>
        <span>Não tem uma conta? </span>
        <Link to="/register">Cadastre-se</Link>
      </div>
    </div>
  );
}