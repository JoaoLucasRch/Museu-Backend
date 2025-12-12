import './style.css';

// Recebe "direction" ('left' ou 'right') e a função "onClick"
export default function SlideButton({ direction, onClick }) {
  const isLeft = direction === 'left';

  return (
    <button 
      className={`slide-btn ${isLeft ? 'left' : 'right'}`} 
      onClick={onClick}
      aria-label={isLeft ? "Anterior" : "Próximo"}
    >
      {/* Ícone SVG da Seta (Muda o desenho baseado na direção) */}
      {isLeft ? (
        // Seta Esquerda
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      ) : (
        // Seta Direita
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      )}
    </button>
  );
}