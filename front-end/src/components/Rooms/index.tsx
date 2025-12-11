
import SlideButton from '../SlideButton'; // Ajuste o caminho conforme sua pasta
import Pintura from '../../assets/pintura.png';
import './style.css'; // O CSS do Rooms abaixo

export default function Rooms() {
  
  const handlePrev = () => {
    console.log("Voltar slide...");
    // Sua lógica de voltar aqui
  };

  const handleNext = () => {
    console.log("Avançar slide...");
    // Sua lógica de avançar aqui
  };

  return (
    <section className="rooms-container">
      <div className="text-header">
        <h2>Salas em Destaque</h2>
        <p>Acompanhe algumas das salas presentes no museu</p>
      </div>

      {/* Container do Slider */}
      <div className="slider-wrapper">
        
        {/* BOTÃO ESQUERDO */}
        <div className="nav-left">
           <SlideButton direction="left" onClick={handlePrev} />
        </div>

        {/* A IMAGEM / CARD */}
        <div className="slide-content">
           <img 
             src= {Pintura} 
             alt="Sala das Pinturas" 
           />
           <div className="slide-info">
             <h3>Sala das Pinturas</h3>
             <p>Sala dedicada a pinturas de artistas da região...</p>
           </div>
        </div>

        {/* BOTÃO DIREITO */}
        <div className="nav-right">
           <SlideButton direction="right" onClick={handleNext} />
        </div>

      </div>
    </section>
  );
}