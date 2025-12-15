import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Lock, Eye, EyeOff, X } from 'lucide-react';
import { InputField } from '../InputField';
import styles from './ResetPasswordModal.module.css';

interface ResetPasswordModalProps {
  token: string | null;
  isOpen: boolean;
  onClose: () => void;
}

interface ResetPasswordForm {
  senha: string;
  confirmarSenha: string;
}

export default function ResetPasswordModal({ token, isOpen, onClose }: ResetPasswordModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const { register, handleSubmit, reset, getValues, formState: { errors } } = useForm<ResetPasswordForm>();
  
  // CORREÇÃO 1: O useEffect agora só reseta o formulário (react-hook-form), não o estado do React
  useEffect(() => {
    if (isOpen) {
        reset();
    }
  }, [isOpen, reset]);

  // CORREÇÃO 2: Criamos essa função para limpar o estado QUANDO FECHAR
  const handleCloseModal = () => {
    setStatus('idle');       // Reseta o status
    setErrorMessage('');     // Limpa erros
    reset();                 // Limpa os inputs
    onClose();               // Chama a função do pai para fechar visualmente
  };

  if (!isOpen || !token) return null;

  const onSubmit = async (data: ResetPasswordForm) => {
    setStatus('loading');
    try {
      await axios.post('http://localhost:3333/auth/reset-password', {
        token: token,
        novaSenha: data.senha,
      });
      setStatus('success');
      
      setTimeout(() => {
        handleCloseModal(); // Usa a nossa função de limpeza
      }, 3000);

    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.response?.data?.message || 'Erro ao redefinir senha.');
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        
        <div className={styles.header}>
          <h2>Redefinir senha</h2>
          {/* Usa handleCloseModal aqui */}
          <button onClick={handleCloseModal} className={styles.closeIcon}>
            <X size={24} color="#666" />
          </button>
        </div>

        {status === 'success' ? (
          <div className={styles.successBody}>
            <h3 style={{color: 'green', textAlign: 'center'}}>Senha Alterada! 🎉</h3>
            <p style={{textAlign: 'center', color: '#666'}}>Agora você pode fazer login com a nova senha.</p>
            {/* Usa handleCloseModal aqui */}
            <button onClick={handleCloseModal} className={styles.submitButton} style={{marginTop: '1rem'}}>
                Ir para Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
            {status === 'error' && <div className={styles.errorBanner}>{errorMessage}</div>}

            <div className={styles.inputWrapper}>
              <InputField
                label="Nova senha"
                placeholder="********"
                type={showPassword ? 'text' : 'password'}
                icon={<Lock size={20} color="#9CA3AF" />}
                {...register('senha', { 
                  required: 'Senha é obrigatória',
                  minLength: { value: 6, message: 'Mínimo de 6 caracteres' }
                })}
                error={errors.senha?.message}
              />
               <button type="button" className={styles.eyeButton} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className={styles.inputWrapper}>
              <InputField
                label="Confirmar nova senha"
                placeholder="********"
                type={showConfirmPassword ? 'text' : 'password'}
                icon={<Lock size={20} color="#9CA3AF" />}
                {...register('confirmarSenha', { 
                  required: 'Confirmação é obrigatória',
                  validate: (val) => val === getValues('senha') || 'As senhas não coincidem'
                })}
                error={errors.confirmarSenha?.message}
              />
              <button type="button" className={styles.eyeButtonConfirm} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className={styles.actions}>
              {/* Usa handleCloseModal aqui também */}
              <button type="button" onClick={handleCloseModal} className={styles.cancelButton}>
                Cancelar
              </button>
              <button type="submit" className={styles.submitButton} disabled={status === 'loading'}>
                {status === 'loading' ? 'Salvando...' : 'Confirmar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}