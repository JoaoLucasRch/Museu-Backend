import { useNavigate } from 'react-router-dom'; // 1. Importe o hook
import './style.css';

export default function ParticipateButton({ onClick, text = "Quero Participar" }) {
  const navigate = useNavigate(); // 2. Inicialize o hook

  // 3. Função que lida com o clique
  const handleClick = (e) => {
    // Se você passou alguma outra função via prop (onClick), ela executa primeiro
    if (onClick) {
      onClick(e);
    }
    
    // Redireciona para o login
    navigate('/login');
  };

  return (
    // 4. Use a nova função no botão
    <button className="participate-btn" onClick={handleClick}>
      <span className="btn-text">{text}</span>
      {/* Ícone de seta para a direita */}
      <svg 
        className="btn-icon" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    </button>
  );
}