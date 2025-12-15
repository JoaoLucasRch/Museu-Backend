import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { X, Mail } from 'lucide-react';
import { InputField } from '../InputField'; 
// 1. Importe o CancelButton
import CancelButton from '../../CancelButton'; 

import styles from './ForgotPasswordModal.module.css';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ForgotPasswordForm {
  email: string;
}

export default function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ForgotPasswordForm>();

  if (!isOpen) return null;

  const onSubmit = async (data: ForgotPasswordForm) => {
    setStatus('loading');
    setMessage('');
    try {
      await axios.post('http://localhost:3333/auth/forgot-password', data);
      setStatus('success');
      setMessage('Código enviado! Verifique sua caixa de entrada.');
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (error) {
      setStatus('error');
      setMessage('Erro ao enviar. Verifique o e-mail e tente novamente.');
    }
  };

  const handleClose = () => {
    setStatus('idle');
    setMessage('');
    reset();
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        
        <div className={styles.header}>
          <h2>Esqueci a senha</h2>
          <button onClick={handleClose} className={styles.closeIcon}>
            <X size={24} color="#666" />
          </button>
        </div>

        <p className={styles.description}>
          Digite um email cadastrado para recuperação de senha
        </p>

        {status === 'success' ? (
           <div className={styles.successMessage}>
             <span className={styles.checkIcon}>✅</span> {message}
           </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.inputWrapper}>
                <InputField 
                    label="" 
                    placeholder="seu@email.com"
                    type="email"
                    icon={<Mail size={20} color="#9CA3AF" />}
                    {...register('email', { 
                        required: 'E-mail é obrigatório',
                        pattern: { value: /^\S+@\S+$/i, message: 'E-mail inválido' }
                    })}
                    error={errors.email?.message}
                />
            </div>
            
            {status === 'error' && <div className={styles.errorMessage}>{message}</div>}

            <div className={styles.actions}>
              
              {/* 2. AQUI ESTÁ A MUDANÇA: Usando o CancelButton */}
              {/* Passamos onClick={handleClose} para ele NÃO voltar a página, e sim fechar o modal */}
              <CancelButton 
                onClick={handleClose} 
                className={styles.cancelButton} 
                label="Cancelar"
              />
              
              <button type="submit" className={styles.submitButton} disabled={status === 'loading'}>
                {status === 'loading' ? 'Enviando...' : 'Enviar código'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}