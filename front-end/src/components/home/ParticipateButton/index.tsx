import './style.css';

export default function ParticipateButton({ onClick, text = "Quero Participar" }) {
  return (
    <button className="participate-btn" onClick={onClick}>
      <span className="btn-text">{text}</span>
      {/* Ícone de seta para a direita (reutilizado do SlideButton) */}
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