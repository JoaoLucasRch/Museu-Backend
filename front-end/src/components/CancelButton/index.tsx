import { useNavigate } from 'react-router-dom';
import type { ButtonHTMLAttributes } from 'react';
// Certifique-se que o nome do arquivo bate com o import (maiuscula/minuscula importa)
import style from "./Style.module.css"; 

interface CancelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export default function CancelButton({ 
  className = '', // Define um valor padrão vazio para não quebrar se for undefined
  label = "Cancelar", 
  ...props 
}: CancelButtonProps) {
  
  const navigate = useNavigate();

  return (
    <button
      type="button"
      // AQUI ESTÁ A CORREÇÃO:
      // Usamos template string (``) para juntar o estilo local com o externo
      className={`${style.container} ${className}`} 
      onClick={() => navigate(-1)}
      {...props}
    >
      {label}
    </button>
  );
}