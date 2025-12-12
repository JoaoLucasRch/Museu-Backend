import ParticipateButton from '../ParticipateButton';
import Pintura from '../../../assets/Expose/pinturaManuel.jpg';
import Arara from '../../../assets/Expose/Arara.jpg';
import Onca from '../../../assets/Expose/Onca.jpg';
import './style.css';


const images = [
  Pintura,
  Arara,
  Onca
];

export default function Expose() {
  
  const handleParticipate = () => {
    console.log("Clicou em Quero Participar");
  };

  return (
    <section className="expose-container" id="exposicoes">
      
      {/* Lado Esquerdo: Texto */}
      <div className="expose-text-content">
        <h2>Exponha<br />Sua Arte</h2>
        <p>
          O Museu Francisco Coelho acredita que a arte vive de novas vozes.
          Junte-se a nós e mostre seu talento para o mundo.
        </p>
        
        <div className="cta-wrapper">
          <ParticipateButton onClick={handleParticipate} />
        </div>
      </div>

      {/* Lado Direito: Apenas as imagens */}
      <div className="expose-images-wrapper">
        <div className="cards-display">
          {images.map((imgUrl, index) => (
            <div key={index} className="art-card">
              <img src={imgUrl} alt={`Arte ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}